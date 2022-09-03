import nerve from 'nerve-sdk-js';
import { ethers } from 'ethers';
import { Minus, Plus, timesDecimals } from './util';
// const Signature = require("elliptic/lib/elliptic/ec/signature");
// const txsignatures = require("nerve-sdk-js/lib/model/txsignatures");
// @ts-ignore
import Signature from 'elliptic/lib/elliptic/ec/signature';
// @ts-ignore
import txsignatures from 'nerve-sdk-js/lib/model/txsignatures';
// @ts-ignore
import BufferReader from 'nerve-sdk-js/lib/utils/bufferreader';
// @ts-ignore
import txs from 'nerve-sdk-js/lib/model/txs';
import config from '@/config';
import { getProvider } from '@/hooks/useEthereum';
import { broadcastHex, getAssetBalance } from '@/service/api';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';

interface NProps {
  chain: 'NERVE' | 'NULS';
  type?: number;
}

export class NTransfer {
  chain: string;
  type?: number;
  sdk = nerve;
  provider: any;
  constructor(props: NProps) {
    if (!props.chain) {
      throw '未获取到交易网络，组装交易失败';
    }
    this.chain = props.chain; //链网络
    this.type = props.type; //交易类型
    this.sdk = nerve;
    this.provider = getProvider();
  }

  validateAddress(address: string) {
    try {
      const res = this.sdk.verifyAddress(address);
      return res.right;
    } catch (e) {
      return false;
    }
  }

  async getTxHex(data: any) {
    const { inputs, outputs, txData, remarks = '', pub, signAddress } = data;
    let tAssemble = data.tAssemble;
    let hash;
    if (!tAssemble) {
      // 组装交易
      tAssemble = this.sdk.transactionAssemble(
        inputs,
        outputs,
        '',
        this.type,
        txData
      );
      // 调用metamask签名hash，然后拼接公钥完成交易签名
    }
    hash = '0x' + tAssemble.getHash().toString('hex');
    const signature = await this.signHash(hash, signAddress);
    tAssemble.signatures = this.sdk.appSplicingPub(signature, pub);
    return tAssemble.txSerialize().toString('hex');
  }

  // 补充签名
  async appendSignature(data: any) {
    const { pub, signAddress, txHexForSign } = data;
    const bufferReader = new BufferReader(Buffer.from(txHexForSign, 'hex'), 0);
    // 反序列回交易对象
    const tAssemble = new txs.Transaction();
    tAssemble.parse(bufferReader);
    const hash = '0x' + tAssemble.getHash().toString('hex');
    // const signData = this.sdk.appSplicingPub(signature, pub);
    const signature = await this.signHash(hash, signAddress);
    //初始化签名对象
    const txSignData = new txsignatures.TransactionSignatures();
    // // 反序列化签名对象
    const reader = new BufferReader(tAssemble.signatures, 0);
    txSignData.parse(reader);
    // 追加签名到对象中
    txSignData.addSign(Buffer.from(pub, 'hex'), Buffer.from(signature, 'hex'));

    tAssemble.signatures = txSignData.serialize();
    // tAssemble.signatures = signData;
    return tAssemble.txSerialize().toString('hex');
  }

  /**
   * @desc 利用metamask签名hash
   * @param hash 待签名交易hash
   * @param signAddress 签名账户地址
   */
  async signHash(hash: string, signAddress: string) {
    hash = hash.startsWith('0x') ? hash : '0x' + hash;
    let flat = await this.provider.request({
      method: 'eth_sign',
      params: [signAddress, hash]
    });
    // console.log(flat, 66, signAddress)
    flat = flat.slice(2); // 去掉0x
    const r = flat.slice(0, 64);
    const s = flat.slice(64, 128);
    // const recoveryParam = flat.slice(128)
    // signature = signature.slice(2)
    return new Signature({ r, s }).toDER('hex');
  }

  async inputsOrOutputs(data: any) {
    if (!this.type) {
      throw '获取交易类型失败';
    }
    if (this.type === 2) {
      //链内交易
      return this.transferTransaction(data);
    } else if (this.type === 10) {
      //nerve-nuls跨链交易
      return this.crossChainTransaction(data);
    } else if (this.type === 16) {
      //调用合约
    } else if (this.type === 43) {
      // nerve 网络提现到eth bsc
      return this.WithdrawalTransaction(data);
    } else if (this.type === 5) {
      // 加入staking
      return this.joinStakingTransaction(data);
    } else if (this.type === 6) {
      // 退出staking
      return this.quitStakingTransaction(data);
    } else if (this.type === 32) {
      // 批量退出staking
      return this.batchQuitTransaction(data);
    } else if (this.type === 33) {
      // 批量转定期，合并
      return this.batchJoinTransaction(data);
    } else if (this.type === 4) {
      // 创建节点
      return this.createNodeTransaction(data);
    } else if (this.type === 28) {
      // 追加保证金
      return this.addDepositTransaction(data);
    } else if (this.type === 29) {
      // 撤销保证金
      return this.quitDepositTransaction(data);
    } else if (this.type === 9) {
      // 注销节点
      return this.stopNodeTransaction(data);
    } else if (this.type === 56) {
      // 追加提现手续费
      return this.additionFee(data);
    }
  }

  //nuls nerve普通转账input output
  async transferTransaction(transferInfo: any) {
    const { from, to, assetsChainId, assetsId, amount, fee } = transferInfo;
    const inputs = [],
      outputs = [];
    //转账资产nonce
    const nonce = await this.getNonce(from, assetsChainId, assetsId);
    if (!nonce) throw '获取nonce值失败';
    if (config.chainId === assetsChainId && config.assetId === assetsId) {
      // 转账资产为本链主资产, 将手续费和转账金额合成一个input
      const newAmount = Plus(amount, fee).toFixed();
      inputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount: newAmount,
        locked: 0,
        nonce: nonce
      });
    } else {
      const mainAssetNonce = await this.getNonce(
        from,
        config.chainId,
        config.assetId
      );
      inputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount,
        locked: 0,
        nonce: transferInfo.nonce || nonce // 闪兑资产和跨链资产一样，闪兑后nonce值使用hash后16位
      });
      inputs.push({
        address: from,
        assetsChainId: config.chainId,
        assetsId: config.assetId,
        amount: fee,
        locked: 0,
        nonce: mainAssetNonce
      });
    }
    outputs.push({
      address: to,
      assetsChainId,
      assetsId,
      amount,
      lockTime: 0
    });
    return { inputs, outputs };
  }

  // nerve跨链到nuls
  async crossChainTransaction(transferInfo: any) {
    const { inputs, outputs } = await this.transferTransaction(transferInfo);
    // const
    if (this.chain === 'NERVE') {
      const CROSS_INFO = config.NULSConfig;
      // nerve资产跨链到nuls,要收取nuls手续费
      let isNULS = false;
      const nulsFee = timesDecimals(0.01, 8);
      for (let input of inputs) {
        if (
          input.assetsChainId === CROSS_INFO.chainId &&
          input.assetsId === CROSS_INFO.assetId
        ) {
          //跨链资产为nuls
          isNULS = true;
          input.amount = Plus(input.amount, nulsFee).toFixed();
        }
      }
      if (!isNULS) {
        // 跨链资产不是nuls
        const nonce = await this.getNonce(
          transferInfo.from,
          CROSS_INFO.chainId,
          CROSS_INFO.assetId
        );
        if (!nonce) throw '获取nuls nonce值失败';
        inputs.push({
          address: transferInfo.from,
          assetsChainId: CROSS_INFO.chainId,
          assetsId: CROSS_INFO.assetId,
          amount: nulsFee,
          locked: 0,
          nonce: nonce
        });
      }
    }
    return { inputs, outputs };
  }

  // nerve 提现
  async WithdrawalTransaction(transferInfo: any) {
    const {
      from,
      assetsChainId,
      assetsId,
      amount,
      withdrawalFee,
      fee_asset,
      fee
    } = transferInfo;
    let nonce;
    if (transferInfo.nonce) {
      nonce = transferInfo.nonce;
    } else {
      nonce = await this.getNonce(from, assetsChainId, assetsId);
    }
    let inputs = [];
    const totalFee = Plus(withdrawalFee, fee).toFixed();
    if (fee_asset.chainId === assetsChainId && fee_asset.assetId === assetsId) {
      const newAmount = Plus(amount, totalFee).toFixed();
      inputs.push({
        address: from,
        amount: newAmount,
        assetsChainId,
        assetsId,
        nonce,
        locked: 0
      });
    } else {
      const mainAssetNonce = await this.getNonce(
        from,
        fee_asset.chainId,
        fee_asset.assetId
      );
      inputs = [
        {
          address: from,
          amount: amount,
          assetsChainId,
          assetsId,
          nonce,
          locked: 0
        },
        {
          address: from,
          amount: totalFee,
          assetsChainId: fee_asset.chainId,
          assetsId: fee_asset.assetId,
          nonce: mainAssetNonce,
          locked: 0
        }
      ];
    }
    // 系统补贴手续费地址
    const feeAddress = config.feeAddress;
    const blockHoleAddress = config.destroyAddress;
    let outputs = [
      {
        address: blockHoleAddress, //黑洞地址
        amount: amount,
        assetsChainId,
        assetsId,
        locked: 0
      },
      {
        address: feeAddress, //提现费用地址
        amount: withdrawalFee,
        assetsChainId: fee_asset.chainId,
        assetsId: fee_asset.assetId,
        locked: 0
      }
    ];
    return { inputs, outputs };
  }

  // 加入staking
  async joinStakingTransaction(transferInfo: any) {
    const { from, assetsChainId, assetsId, amount } = transferInfo;
    const nonce = await this.getNonce(from, assetsChainId, assetsId);
    const inputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount,
        locked: 0,
        nonce
      }
    ];
    const outputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount,
        lockTime: -1
      }
    ];
    return { inputs, outputs };
  }
  // 退出staking
  async quitStakingTransaction(transferInfo: any) {
    const { from, assetsChainId, assetsId, amount, fee, nonce } = transferInfo;
    const inputs = [];
    const outputs = [];
    const { chainId, assetId } = config;
    if (assetsChainId !== chainId || assetsId !== assetId) {
      // 加入的资产不是nvt input组装两个
      inputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount,
        locked: -1,
        nonce
      });
      outputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount,
        lockTime: 0
      });
    } else {
      //加入的资产是nvt 合并amount+fee
      // 退出锁定7天
      const sevenDays = new Date().valueOf() + 3600000 * 24 * 7; //锁定7天
      const lockTime = Number(
        sevenDays.toString().substr(0, sevenDays.toString().length - 3)
      );
      inputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount,
        locked: -1,
        nonce
      });
      outputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount: Minus(amount, fee).toFixed(), // fee可以为0 底层已支持
        lockTime
      });
    }

    return { inputs, outputs };
  }
  // 批量退出staking
  async batchQuitTransaction(transferInfo: any) {
    const { from, fee, stakingList } = transferInfo;
    const inputs: any[] = [];
    const outputs: any[] = [];
    const sevenDays = new Date().valueOf() + 3600000 * 24 * 7; //nvt锁定7天
    const lockTime = Number(
      sevenDays.toString().substr(0, sevenDays.toString().length - 3)
    );
    const symbolList: string[] = [],
      outs: any[] = [];
    const { chainId, assetId } = config;
    stakingList.map(async (v: any) => {
      inputs.push({
        address: from,
        assetsChainId: v.assetChainId,
        assetsId: v.assetId,
        amount: Plus(0, v.amountStr).toFixed(),
        locked: -1,
        nonce: v.txHash.substring(v.txHash.length - 16)
      });
      const isNvt = chainId === v.assetChainId && assetId === v.assetId;
      const id = v.assetChainId + '-' + v.assetId;
      if (symbolList.indexOf(id) === -1) {
        symbolList.push(id);
        outs.push({
          isNvt: isNvt,
          id: id,
          address: from,
          chainId: v.assetChainId,
          assetId: v.assetId,
          amount: Plus(0, v.amountStr).toFixed(),
          lockTime: isNvt ? lockTime : 0
        });
      } else {
        outs.map(out => {
          if (out.id === id) {
            out.amount = Plus(out.amount, v.amountStr).toFixed();
          }
        });
      }
    });
    const hasNvt = outs.filter(v => v.isNvt).length;
    if (hasNvt) {
      outs.map(item => {
        outputs.push({
          address: item.address,
          assetsChainId: item.chainId,
          assetsId: item.assetId,
          amount: item.isNvt ? Minus(item.amount, fee).toString() : item.amount, // 要收取0.001个手续费，底层未支持此处减免
          lockTime: item.lockTime
        });
      });
    } else {
      const nonce = await this.getNonce(from, chainId, assetId);
      inputs.push({
        address: from,
        assetsChainId: chainId,
        assetsId: assetId,
        amount: 0, // 必须组装个nvt inputs  金额可填0
        locked: 0,
        nonce
      });
      outs.map(item => {
        outputs.push({
          address: item.address,
          assetsChainId: item.chainId,
          assetsId: item.assetId,
          amount: item.amount,
          lockTime: item.lockTime
        });
      });
    }
    return { inputs, outputs };
  }
  // 批量转定期，合并staking
  async batchJoinTransaction(transferInfo: any) {
    const {
      from,
      assetsChainId,
      assetsId,
      amount,
      fee,
      nonceList,
      amountList
    } = transferInfo;
    const inputs = [];
    const outputs = [];
    const { chainId, assetId } = config;
    if (assetsChainId !== chainId || assetsId !== assetId) {
      // 加入的资产不是nvt input组装两个
      for (let i = 0; i < nonceList.length; i++) {
        inputs.push({
          address: from,
          assetsChainId,
          assetsId,
          amount: amountList[i],
          locked: -1,
          nonce: nonceList[i]
        });
      }
      const nvtNonce = await this.getNonce(from, chainId, assetId);
      inputs.push({
        address: from,
        assetsChainId: chainId,
        assetsId: assetId,
        amount: 0, // // 必须组装个nvt inputs  金额可填0
        locked: 0,
        nonce: nvtNonce
      });
      outputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount,
        lockTime: -1
      });
    } else {
      //加入的资产是nvt 合并amount+fee
      for (let i = 0; i < nonceList.length; i++) {
        inputs.push({
          address: from,
          assetsChainId,
          assetsId,
          amount: amountList[i],
          locked: -1,
          nonce: nonceList[i]
        });
      }
      outputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount: Minus(amount, fee).toFixed(), // 要收取0.001个手续费，底层未支持此处减免
        lockTime: -1
      });
    }
    return { inputs, outputs };
  }
  // 创建节点
  async createNodeTransaction(transferInfo: any) {
    const { from, assetsChainId, assetsId, amount } = transferInfo;
    const nonce = await this.getNonce(from, assetsChainId, assetsId);
    const inputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount: amount,
        locked: 0,
        nonce
      }
    ];
    const outputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount: amount,
        lockTime: -1
      }
    ];
    return { inputs, outputs };
  }
  //追加保证金
  async addDepositTransaction(transferInfo: any) {
    const { from, assetsChainId, assetsId, amount } = transferInfo;
    const nonce = await this.getNonce(from, assetsChainId, assetsId);
    const inputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount: amount,
        locked: 0,
        nonce
      }
    ];
    const outputs = [
      {
        address: from,
        assetsChainId,
        assetsId,
        amount: amount,
        lockTime: -1
      }
    ];
    return { inputs, outputs };
  }
  //撤销保证金
  async quitDepositTransaction(transferInfo: any, isStopNode = false) {
    const { from, assetsChainId, assetsId, amount, nonceList, fee } =
      transferInfo;
    //锁定15 = 24*15天
    const time = new Date().valueOf() + 3600000 * 24 * 15;
    const lockTime = Number(
      time.toString().substr(0, time.toString().length - 3)
    );
    const inputs = [];
    const outputs = [];
    for (let item of nonceList) {
      inputs.push({
        address: from,
        assetsChainId,
        assetsId,
        amount: item.deposit,
        locked: -1,
        nonce: item.nonce
      });
    }

    outputs.push({
      address: from,
      assetsChainId,
      assetsId,
      amount: Minus(amount, fee).toFixed(),
      lockTime: lockTime
    });
    if (!isStopNode) {
      let allAmount = '0';
      for (let item of nonceList) {
        allAmount = Plus(allAmount, item.deposit).toFixed();
      }
      if (allAmount !== amount) {
        outputs.push({
          address: from,
          assetsChainId,
          assetsId,
          amount: Minus(allAmount, amount).toFixed(),
          lockTime: -1
        });
      }
    }
    return { inputs, outputs };
  }
  // 注销节点
  stopNodeTransaction(transferInfo: any) {
    return this.quitDepositTransaction(transferInfo, true);
  }

  // 追加提现手续费
  async additionFee(transferInfo: any) {
    const { assetsChainId, assetsId, from, to, amount } = transferInfo;
    const nonce = await this.getNonce(from, assetsChainId, assetsId);
    const inputs = [{
      address: from,
      assetsChainId,
      assetsId,
      amount,
      locked: 0,
      nonce
    }];
    const outputs = [{
      address: to,
      assetsChainId,
      assetsId,
      amount,
      lockTime: 0
    }];
    return { inputs, outputs };
  }

  async getNonce(from: string, assetsChainId: number, assetsId: number) {
    const res: any = await getAssetBalance(assetsChainId, assetsId, from);
    return res ? res.nonce : null;
  }

  async broadcastHex(txHex: string) {
    return await broadcastHex(txHex);
  }
}

const CROSS_OUT_ABI = [
  'function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)'
];
// token授权
const ERC20_ABI = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)'
];

// 查询余额
const erc20BalanceAbiFragment = [
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  }
];

// token转账
const erc20TransferAbiFragment = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: '_to', type: 'address' },
      { type: 'uint256', name: '_tokens' }
    ],
    constant: false,
    outputs: [],
    payable: false
  }
];

const tokenGaslimit = 150000;
const defaultGaslimit = 35000;

export function getGasLimit(isToken: boolean) {
  return isToken ? tokenGaslimit : defaultGaslimit;
}

export class ETransfer {
  provider: any;
  constructor(chain?: string) {
    this.getProvider(chain);
  }

  getProvider(chain?: string) {
    if (!chain) {
      const provider = getProvider();
      this.provider = new ethers.providers.Web3Provider(provider);
    } else {
      if (chain === 'Ethereum') {
        const network = config.isBeta ? 'ropsten' : 'homestead';
        this.provider = ethers.getDefaultProvider(network);
      } else {
        this.provider = new ethers.providers.JsonRpcProvider(
          _networkInfo[chain].rpcUrl
        );
      }
    }
  }

  decodeData(data: any) {
    /* const commonTransferABI = ["function transfer(address recipient, uint256 amount)"] // eth等链发起的交易
    // CROSS_OUT_ABI nerve链发起的跨链转入交易
    const ABI = fromNerve ? CROSS_OUT_ABI : commonTransferABI
    const iface = new ethers.utils.Interface(ABI);  */
    const iface = new ethers.utils.Interface([
      'function transfer(address recipient, uint256 amount)'
    ]);
    const txInfo = iface.parseTransaction({ data });
    //const decode = iface.functions["transfer(address,uint256)"].decode(data);
    // const decode = iface.decodeFunctionData("transfer(address,uint)", data);
    if (txInfo) {
      return { to: txInfo.args[0], amount: txInfo.args[1].toString() };
    }
    return null;
  }

  formatEther(value: any) {
    return ethers.utils.formatEther(value);
  }

  /**
   * metamask 跨链转入nerve
   * @param multySignAddress 多签地址
   * @param nerveAddress nerve地址
   * @param numbers 交易数量
   * @param fromAddress metamask地址
   * @param contractAddress ERC20合约地址
   * @param decimals token精度
   *
   */
  async crossIn(params: any) {
    const {
      multySignAddress,
      nerveAddress,
      numbers,
      fromAddress,
      contractAddress,
      decimals
    } = params;
    let transactionParameters;
    this.validateAddress(multySignAddress);
    this.validateAddress(fromAddress);
    if (contractAddress) {
      this.validateAddress(contractAddress);
      // token 转入
      const numberOfTokens = ethers.utils.parseUnits(numbers, decimals);
      const iface = new ethers.utils.Interface(CROSS_OUT_ABI);
      const data = iface.functions.crossOut.encode([
        nerveAddress,
        numberOfTokens,
        contractAddress
      ]);
      transactionParameters = {
        // gasLimit: tokenGaslimit,
        to: multySignAddress,
        from: fromAddress, //验证合约调用需要from,必传
        value: '0x00',
        data: data
      };
    } else {
      const amount = ethers.utils.parseEther(numbers);
      const iface = new ethers.utils.Interface(CROSS_OUT_ABI);
      const data = iface.functions.crossOut.encode([
        nerveAddress,
        amount,
        '0x0000000000000000000000000000000000000000'
      ]);
      transactionParameters = {
        // gasLimit: defaultGaslimit,
        to: multySignAddress,
        value: amount,
        data: data
      };
    }
    const failed = await this.validate(transactionParameters);
    if (failed) {
      console.error('failed approveERC20' + failed);
      return { success: false, message: 'failed crossIn' + failed };
    }
    if (transactionParameters.from) {
      delete transactionParameters.from;
    }
    if (this.provider._web3Provider?.chainId === _networkInfo.Klaytn.nativeId) {
      // @ts-ignore
      // Klaytn 网络设置gas为250，不然交易无法发送
      transactionParameters.gasPrice = '0x3a35294400';
    }
    return await this.sendTransaction(transactionParameters);
  }

  // 普通链内转账
  async commonTransfer(params: any) {
    const wallet = await this.provider.getSigner();
    const nonce = await wallet.getTransactionCount();
    if (params.contractAddress) {
      const contract = new ethers.Contract(
        params.contractAddress,
        erc20TransferAbiFragment,
        wallet
      );
      const numberOfTokens = ethers.utils.parseUnits(
        params.value,
        params.decimals
      );
      const transaction = { nonce };
      /* console.log("to: ", params.to)
      console.log("numberOfTokens: ", numberOfTokens)
      console.log("transaction: ", transaction) */
      return await contract.transfer(params.to, numberOfTokens, transaction);
    } else {
      // 非token转账
      const value = ethers.utils.parseEther(params.value);
      const transaction = { nonce, to: params.to, value };
      /* if (params.upSpeed) {
        transaction.gasPrice = await this.getSpeedUpGasPrice();
      } */
      // console.log("transaction: ", transaction)
      return await wallet.sendTransaction(transaction);
    }
  }

  getEthBalance(address: string) {
    let balancePromise = this.provider.getBalance(address);
    return balancePromise
      .then((balance: any) => {
        return ethers.utils.formatEther(balance);
      })
      .catch((e: Error) => {
        // console.error('获取余额失败' + e)
        throw '获取余额失败' + e;
      });
  }

  /**
   * ERC20合约余额
   * @param contractAddress ERC20合约地址
   * @param tokenDecimals token小数位数
   * @param address 账户地址
   */
  getERC20Balance(
    contractAddress: string,
    tokenDecimals: number,
    address: string
  ) {
    let contract = new ethers.Contract(
      contractAddress,
      erc20BalanceAbiFragment,
      this.provider
    );
    let balancePromise = contract.balanceOf(address);
    return balancePromise
      .then((balance: any) => {
        // console.log(balance, 123456);
        return ethers.utils.formatUnits(balance, tokenDecimals);
      })
      .catch((e: Error) => {
        // console.error('获取ERC20余额失败' + e)
        throw '获取余额失败' + e;
      });
  }

  // 地址验证
  validateAddress(account: string) {
    try {
      ethers.utils.getAddress(account);
      return true;
    } catch (error) {
      throw '地址校验失败';
    }
  }

  //验证交易参数
  async validate(tx: any) {
    try {
      const result = await this.provider.call(tx);
      return ethers.utils.toUtf8String('0x' + result.substr(138));
    } catch (e) {
      return false;
    }
  }

  async sendTransaction(transactionParameters: any) {
    console.log(this.provider, 99888);
    const wallet = this.provider.getSigner();
    return await wallet.sendTransaction(transactionParameters);
  }

  /**
   * 查询erc20资产授权额度
   * @param contractAddress ERC20合约地址
   * @param multySignAddress 多签地址
   * @param address 账户eth地址
   */
  async getERC20Allowance(
    contractAddress: string,
    multySignAddress: string,
    address: string
  ) {
    const contract = new ethers.Contract(
      contractAddress,
      ERC20_ABI,
      this.provider
    );
    const allowancePromise = contract.allowance(address, multySignAddress);
    // console.log(contractAddress, multySignAddress, address, 66333)
    return allowancePromise
      .then((allowance: any) => {
        const baseAllowance = '39600000000000000000000000000';
        //已授权额度小于baseAllowance，则需要授权
        return Minus(baseAllowance, allowance).toNumber() >= 0;
      })
      .catch((e: Error) => {
        console.error('获取erc20资产授权额度失败' + e);
        return true;
      });
  }

  async approveERC20(
    contractAddress: string,
    multySignAddress: string,
    address: string
  ) {
    this.validateAddress(contractAddress);
    this.validateAddress(multySignAddress);
    this.validateAddress(address);
    const iface = new ethers.utils.Interface(ERC20_ABI);
    const data = iface.functions.approve.encode([
      multySignAddress,
      new ethers.utils.BigNumber(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
    ]);
    const transactionParameters = {
      to: contractAddress,
      // gasLimit: tokenGaslimit,
      from: address,
      value: '0x00',
      data: data
    };
    const failed = await this.validate(transactionParameters);
    if (failed) {
      console.error('failed approveERC20' + failed);
      return { success: false, message: 'failed approveERC20' + failed };
    }
    if (this.provider._web3Provider?.chainId === _networkInfo.Klaytn.nativeId) {
      // @ts-ignore
      // Klaytn 网络设置gas为250，不然交易无法发送
      transactionParameters.gasPrice = '0x3a35294400';
    }
    // @ts-ignore
    delete transactionParameters.from; //etherjs 4.0 from参数无效 报错
    // console.log(transactionParameters, 333333333333333);
    return this.sendTransaction(transactionParameters);
  }

  // 获取手续费
  getGasPrice(isToken: boolean) {
    const gasLimit = getGasLimit(isToken);
    return this.provider.getGasPrice().then((gasPrice: any) => {
      return ethers.utils
        .formatEther(gasPrice.mul(gasLimit).toString())
        .toString();
    });
  }

  // 加速手续费
  async getSpeedUpFee(gasLimit: string) {
    const gasPrice = await this.getSpeedUpGasPrice();
    return ethers.utils
      .formatEther(gasPrice.mul(gasLimit).toString())
      .toString();
  }

  // 加速gasprice
  getSpeedUpGasPrice() {
    const GWEI_10 = ethers.utils.parseUnits('10', 9);
    return this.provider.getGasPrice().then((gasPrice: any) => {
      return gasPrice.add(GWEI_10);
    });
  }

  // 提现gas
  getWithdrawGas() {
    return this.provider.getGasPrice().then((gasPrice: any) => {
      return gasPrice;
    });
  }

  /**
   * @param mainAssetUSD 提现网络主资产USD
   * @param feeUSD 手续费USD
   * @param isToken 提现资产是否是token
   * @param feeDecimals 手续费精度
   * @param isMainAsset 手续费是否是提现网络主资产
   * @param isNVT 手续费是否是NVT
   * @param isTRX 手续费是否是TRX
   * */
  async calWithdrawalFee(
    mainAssetUSD: string,
    feeUSD: string,
    isToken: boolean,
    feeDecimals: number,
    isMainAsset: boolean,
    isNVT?: boolean,
    isTRX?: boolean
  ) {
    const gasPrice = await this.getWithdrawGas();
    let gasLimit;
    if (isToken) {
      gasLimit = new ethers.utils.BigNumber('210000');
    } else {
      gasLimit = new ethers.utils.BigNumber('190000');
    }
    if (isMainAsset) {
      return this.formatEthers(gasLimit.mul(gasPrice), feeDecimals);
    }
    const feeUSDBig = ethers.utils.parseUnits(feeUSD.toString(), 6);
    const mainAssetUSDBig = ethers.utils.parseUnits(mainAssetUSD.toString(), 6);
    let result: any = mainAssetUSDBig
      .mul(gasPrice)
      .mul(gasLimit)
      .mul(ethers.utils.parseUnits('1', feeDecimals))
      .div(ethers.utils.parseUnits('1', 18))
      .div(feeUSDBig);
    if (isNVT || isTRX) {
      // 如果是nvt，向上取整
      const numberStr = ethers.utils.formatUnits(result, feeDecimals);
      const ceil = Math.ceil(+numberStr);
      result = ethers.utils.parseUnits(ceil.toString(), feeDecimals).toString();
    }
    return this.formatEthers(result, feeDecimals);
  }

  /**
   * @desc 计算提现到tron的手续费
   * @param mainAssetUSD 提现网络主资产USD
   * @param feeUSD 手续费USD
   * @param feeDecimals 手续费精度
   * @param isMainAsset 手续费为trx
   * @param isNVT 是否是NVT
   * */
  calWithdrawalFeeForTRON(
    mainAssetUSD = '',
    feeUSD = '',
    feeDecimals: number,
    isMainAsset: boolean,
    isNVT?: boolean
  ) {
    if (isMainAsset) {
      return this.formatEthers(config.trxWithdrawFee, feeDecimals);
    } else {
      const feeUSDBig = ethers.utils.parseUnits(feeUSD.toString(), 6);
      const mainAssetUSDBig = ethers.utils.parseUnits(
        mainAssetUSD.toString(),
        6
      );
      let result: any = mainAssetUSDBig
        .mul(config.trxWithdrawFee)
        .mul(ethers.utils.parseUnits('1', feeDecimals))
        .div(ethers.utils.parseUnits('1', 6))
        .div(feeUSDBig);
      if (isNVT) {
        // 如果是nvt，向上取整
        const numberStr = ethers.utils.formatUnits(result, feeDecimals);
        const ceil = Math.ceil(+numberStr);
        result = ethers.utils
          .parseUnits(ceil.toString(), feeDecimals)
          .toString();
      }
      return this.formatEthers(result, feeDecimals);
    }
  }

  formatEthers(amount: any, decimals: number) {
    return ethers.utils.formatUnits(amount, decimals).toString();
  }
}
