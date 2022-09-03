const TronWeb = require('tronweb');
//官方文档地址： https://cn.developers.tron.network/reference#address
import {
  isBeta,
  divisionDecimals,
  timesDecimals,
  Minus,
  Times,
  Division
} from '@/utils/util';
import config from '@/config';
const ethers = require('ethers');

const trxWithdrawFee = config.trxWithdrawFee;

const fullNode = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const solidityNode = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const eventServer = isBeta
  ? 'https://api.shasta.trongrid.io'
  : 'https://api.trongrid.io';
const privateKey =
  '138a22c03039e688daa2b7c785d1e8d6b9375d4413e6ea82471b1e7a61701a9d';
const customTronWeb = new TronWeb(
  fullNode,
  solidityNode,
  eventServer,
  ''
);
// customTronWeb.setHeader({ "TRON-PRO-API-KEY": '1355e44a-205d-4264-b4f6-76a3515aaec4' });

const CROSS_OUT_ABI = [
  'function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)'
];

const TRC20_ALLOWANCE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

export function generateTronAddress(pub: string) {
  pub = pub.startsWith('0x') ? pub : '0x' + pub;
  const unCompressPub = ethers.utils.computePublicKey(
    ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(pub), 33),
    false
  );
  const addressArray = customTronWeb.utils.crypto.computeAddress(
    customTronWeb.utils.code.hexStr2byteArray(unCompressPub.slice(2))
  );
  return customTronWeb.address.fromHex(
    customTronWeb.utils.code.byteArray2hexStr(addressArray)
  );
}

class TronLinkApi {
  hasTronLink = false;
  selectedAddress = '';
  provider = null;

  constructor(pub?: string) {
    if (pub) {
      this.selectedAddress = this.generateAddressByPub(pub);
    } else {
      this.hasTronLink = !!window.tronWeb;
      this.selectedAddress = this.isReady()
        ? window.tronWeb.defaultAddress.base58
        : '';
      this.getProvider();
    }
  }

  isReady() {
    return window.tronWeb && window.tronWeb.ready;
  }

  getProvider() {
    if (this.isReady()) {
      this.provider = window.tronWeb;
    }
  }

  generateAddressByPub(pub: string) {
    return generateTronAddress(pub);
  }

  async requestAccount() {
    if (this.isReady()) {
      return window.tronWeb.defaultAddress.base58;
    }
    let address;
    const res = await window.tronWeb.request({
      method: 'tron_requestAccounts'
    });
    // 锁定插件时 返回值为空
    if (!res) return '';
    if (res.code === 200) {
      // 插件确定授权  code=== 200
      address = window.tronWeb.defaultAddress.base58;
    } else {
      throw res.message;
    }
    this.selectedAddress = address;
    return address;
  }

  async getBlockHeight() {
    const tronWeb = this.getTronWeb();
    const block = await tronWeb.trx.getCurrentBlock('');
    if (block && block.block_header) {
      // console.log(block.block_header.raw_data.number, 1111)
      return block.block_header.raw_data.number;
    } else {
      throw 'get block error';
    }
    // const height = await tronWeb.trx.getBlockByHash(block.blockID)
    // console.log(height, 96633333)
  }

  getTronWeb(pri?: string) {
    if (this.provider) {
      return this.provider;
    } else {
      if (pri) {
        customTronWeb.setPrivateKey(pri);
      }
      return customTronWeb;
    }
  }

  validAddress(address: string) {
    const tronWeb = this.getTronWeb();
    return tronWeb.isAddress(address);
  }

  async getTrxBalance(address: string) {
    // console.log(address, '8777');
    const tronWeb = this.getTronWeb();

    const balance = await tronWeb.trx.getBalance(address);
    return divisionDecimals(balance, 6);
  }

  /**
   * @param address TRX地址
   * @param contractAddress 合约地址
   * @param decimals 资产精度
   * */
  async getTrc20Balance(
    address: string,
    contractAddress: string,
    decimals = 6
  ) {
    const tronWeb = this.getTronWeb();
    const parameter = [{ type: 'address', value: address }];
    const tx =
      await tronWeb.transactionBuilder.triggerConfirmedConstantContract(
        // tronWeb.address.toHex(contractAddress),
        contractAddress,
        'balanceOf(address)',
        {},
        parameter,
        address
      );
    const balance = tx.constant_result[0]; //十六进制余额
    const balance_bignumber = tronWeb.toBigNumber('0x' + balance).toString();
    // console.log(balance_bignumber, 123)
    return divisionDecimals(balance_bignumber, decimals);
  }

  async sendTrx(to: string, amount: string, pri?: string) {
    if (!this.validAddress(to)) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, 6);
    const tx = await tronWeb.transactionBuilder.sendTrx(
      to,
      amount_bigNumber,
      this.selectedAddress
    );
    const signedTx = await tronWeb.trx.sign(tx);
    return await tronWeb.trx.sendRawTransaction(signedTx);
  }

  async sendTrc20(
    to: string,
    amount: string,
    contractAddress: string,
    decimals: number,
    pri?: string
  ) {
    if (!this.validAddress(to)) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, decimals);
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value: amount_bigNumber }
    ];
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tronWeb.address.toHex(contractAddress),
      'transfer(address,uint256)',
      {},
      parameter,
      tronWeb.address.toHex(this.selectedAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction);
    return await tronWeb.trx.sendRawTransaction(signedTx);
  }

  /** 使用metamask
   * @param to nerve 地址
   * @param amount 转账数量
   * @param multySignAddress 多签地址
   * @param contractAddress 合约地址，trx传空
   * @param decimals 资产精度
   * @param pri
   * */
  async crossOutToNerve(
    to: string,
    amount: string,
    multySignAddress: string,
    contractAddress?: string,
    decimals = 6,
    pri?: string
  ) {
    if (
      !this.validAddress(multySignAddress) ||
      (contractAddress && !this.validAddress(contractAddress))
    ) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, decimals);
    // console.log(to, amount, multySignAddress, contractAddress, 9444, amount_bigNumber)
    const isToken = !!contractAddress;
    contractAddress =
      contractAddress || '0x0000000000000000000000000000000000000000';
    // const CROSS_OUT_ABI = ['function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)']
    /*const parameter = [{type:'string',value: to },{type: 'uint256',value: amount_bigNumber},{type: 'address',value: contractAddress}]
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tronWeb.address.toHex(multySignAddress),
      'crossOut(string,uint256,address)',
      {},
      parameter,
      tronWeb.address.toHex(this.selectedAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction)
    const broastTx = await tronWeb.trx.sendRawTransaction(signedTx)
    */
    const instance = await tronWeb.contract().at(multySignAddress);
    // console.log(instance, 132)
    return await instance.crossOut(to, amount_bigNumber, contractAddress).send({
      // feeLimit:100_000_000,
      callValue: isToken ? 0 : amount_bigNumber,
      shouldPollResponse: false
    });
  }

  /**手动转入方式
   * @param amount 转账数量
   * @param multySignAddress 多签地址
   * @param contractAddress 合约地址，trx传空
   * @param decimals 资产精度
   * @param pri
   * */
  async crossOutToNerveManual(
    amount: string,
    multySignAddress: string,
    contractAddress: string,
    decimals = 6,
    pri?: string
  ) {
    if (contractAddress) {
      return this.sendTrc20(
        multySignAddress,
        amount,
        contractAddress,
        decimals,
        pri
      );
    } else {
      return this.sendTrx(multySignAddress, amount, pri);
    }
  }

  /**
   * @desc 查询token授权情况
   * @param address TRX地址
   * @param multySignAddress 多签地址
   * @param contractAddress 合约地址
   * @param pri
   * */
  async getTrc20Allowance(address: string, multySignAddress: string, contractAddress: string, pri?: string) {
    const tronWeb = this.getTronWeb(pri);
    const instance = await tronWeb.contract(
      TRC20_ALLOWANCE_ABI,
      contractAddress
    );
    // console.log(instance, 9696)
    const allowance = await instance
      .allowance(address, multySignAddress)
      .call();
    const baseAllowance = '39600000000000000000000000000';
    // @ts-ignore
    return Minus(baseAllowance, allowance.toString()) >= 0;
  }

  async approveTrc20(address: string, multySignAddress: string, contractAddress: string, pri?: string) {
    if (
      !this.validAddress(multySignAddress) ||
      (contractAddress && !this.validAddress(contractAddress))
    ) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const instance = await tronWeb.contract().at(contractAddress);
    const approveAmount = tronWeb
      .toBigNumber(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .toFixed();
    return await instance.approve(multySignAddress, approveAmount).send({
      // feeLimit:100_000_000,
      callValue: 0,
      shouldPollResponse: false
    });
  }

  calWithdrawalNVT(nvtUSD: string, heterogeneousChainUSD: string) {
    const defaultTRX = divisionDecimals(trxWithdrawFee, 6);
    const nvtAmount = Division(
      Times(heterogeneousChainUSD, defaultTRX),
      nvtUSD
    ).toFixed();
    // @ts-ignore
    return Math.ceil(nvtAmount);
  }

  async getTxInfo(hash: string) {
    const tronWeb = this.getTronWeb();
    const res = await tronWeb.trx.getTransaction(hash);
    console.log(res, 666666666);
  }
}

export default TronLinkApi;
