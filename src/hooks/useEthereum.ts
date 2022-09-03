import { reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store';
// import { Web3Provider } from "ethers";

import MetaMask from '@/assets/img/provider/metamask.svg';
import Nabox from '@/assets/img/provider/nabox.svg';
import TrustWallet from '@/assets/img/provider/trustwallet.svg';
import Tokenpocket from '@/assets/img/provider/Tokenpocket.jpg';
import Mathwallet from '@/assets/img/provider/mathwallet.svg';
import binancechain from '@/assets/img/provider/binancechain.svg';
import OKEx from '@/assets/img/provider/metax.jpg';
import safepal from '@/assets/img/provider/safepal.svg';
import coin98 from '@/assets/img/provider/coin98.svg';
import bitkeep from '@/assets/img/provider/bitkeep.jpg';
import onto from '@/assets/img/provider/ONTO.png';

import { ethers } from 'ethers';
import nerve from 'nerve-sdk-js';
import storage from '@/utils/storage';
import { getCurrentAccount } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import { generateTronAddress } from '@/utils/tronLink';

interface State {
  address: string | null;
  networkError: string;
}

interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface AddChain {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: NativeCurrency;
  blockExplorerUrls: string[];
}

interface SwitchChain {
  chainId: string;
}

interface GenerateAddressConfig {
  chainId: number;
  assetId: number;
  prefix: string;
}

// const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(
//   navigator.userAgent
// );

const MetaMaskProvider = 'ethereum';
const NaboxProvider = 'NaboxWallet';
const OKExProvider = 'okexchain';
const BSCProvider = 'BinanceChain';
// const ONTOProvider = 'onto';

export const providerList = [
  { name: 'MetaMask', src: MetaMask, provider: MetaMaskProvider },
  { name: 'Nabox', src: Nabox, provider: NaboxProvider },
  { name: 'Trust Wallet', src: TrustWallet, provider: MetaMaskProvider },
  { name: 'TokenPocket', src: Tokenpocket, provider: MetaMaskProvider },
  { name: 'MathWallet', src: Mathwallet, provider: MetaMaskProvider },
  { name: 'Binance Wallet', src: binancechain, provider: BSCProvider },
  { name: 'MetaX', src: OKEx, provider: OKExProvider },
  { name: 'SafePal', src: safepal, provider: MetaMaskProvider },
  { name: 'Coin98', src: coin98, provider: MetaMaskProvider },
  { name: 'BitKeep', src: bitkeep, provider: MetaMaskProvider },
  { name: 'ONTO', src: onto, provider: MetaMaskProvider }
];

export function getProvider(type?: string) {
  if (type) return window[type];
  const providerType = storage.get('providerType');
  return providerType ? window[providerType] : null;
}

export function getAddress() {
  const provider = getProvider();
  return provider?.selectedAddress;
}

export async function generateAddress(
  address: string,
  NerveConfig: GenerateAddressConfig,
  NULSConfig: GenerateAddressConfig
) {
  let heterogeneousAddress = '',
    pub = '';
  if (!address.startsWith('0x')) {
    if (!window.nabox) {
      throw 'Unknown error';
    }
    pub = await window.nabox.getPub({
      address: address
    });
    heterogeneousAddress = ethers.utils.computeAddress(
      ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + pub), 33)
    );
  } else {
    const provider = getProvider();
    const EProvider = new ethers.providers.Web3Provider(provider);
    const jsonRpcSigner = EProvider.getSigner();
    let message = 'Generate L2 address';
    const signature = await jsonRpcSigner.signMessage(message);
    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredPubKey = ethers.utils.recoverPublicKey(
      msgHashBytes,
      signature
    );
    if (recoveredPubKey.startsWith('0x04')) {
      const compressPub = ethers.utils.computePublicKey(recoveredPubKey, true);
      heterogeneousAddress = address;
      pub = compressPub.slice(2);
    } else {
      throw 'Sign error';
    }
  }
  const { chainId, assetId = 1, prefix } = NerveConfig;
  const nerveAddress = nerve.getAddressByPub(chainId, assetId, pub, prefix);
  const NULSAddress = nerve.getAddressByPub(
    NULSConfig.chainId,
    NULSConfig.assetId,
    pub,
    NULSConfig.prefix
  );
  return {
    address: {
      EVM: heterogeneousAddress,
      NERVE: nerveAddress,
      NULS: NULSAddress,
      TRON: generateTronAddress(pub)
    },
    pub
  };
}

export const specialChain = ['NULS', 'NERVE', 'TRON'];

export default function useEthereum() {
  const store = useStore();
  const { t } = useI18n();

  const state: State = reactive({
    address: '',
    networkError: ''
  });

  async function initProvider() {
    const provider = getProvider();
    if (!provider) return;
    if (provider.on) {
      listenAccountChange();
      listenNetworkChange();
    }
    let address = provider?.selectedAddress || provider?.address;
    try {
      address = await provider
        ?.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => accounts && accounts[0]);
    } catch (error) {
      if ((error as any).code === 4001) {
        throw error.message;
      }
    }
    if (!address) {
      address = await provider
        .enable()
        .then((accounts: string[]) => accounts && accounts[0]);
    }
    if (address) {
      state.address = address;
      initChainInfo(address);
    }
  }

  function initChainInfo(address: string) {
    const currentAccount = getCurrentAccount(address);
    const provider = getProvider();
    let chainId = provider.chainId + '';
    chainId = chainId.startsWith('0x')
      ? chainId
      : '0x' + Number(chainId).toString(16);
    const chainInfo = Object.values(_networkInfo).find(
      v => v.nativeId === chainId
    );
    let isWrongChain = !chainInfo;
    let currentAddress = address;
    let network = storage.get('network', 'session');
    if (network && network !== 'undefined') {
      if (specialChain.indexOf(network) > -1) {
        isWrongChain = false;
        // 新账户、且bridge之前在NULS链，会导致currentAccount为null
        currentAddress = currentAccount
          ? currentAccount.address[network]
          : address;
      }
    } else {
      network = chainInfo?.name || '';
    }
    store.commit('changeIsWrongChain', isWrongChain);
    store.commit('changeAddress', currentAddress);
    store.commit('changeNetwork', network);
  }

  // 监听插件账户变动
  function listenAccountChange() {
    const provider = getProvider();
    provider?.on('accountsChanged', (accounts: string) => {
      console.log(accounts, '=======accountsChanged');
      reload();
      /*if (accounts.length) {
        state.address = accounts[0];
      } else {
        state.address = '';
      }*/
    });
  }

  // 监听插件网络变动
  function listenNetworkChange() {
    const provider = getProvider();
    provider?.on('chainChanged', (chainId: string) => {
      console.log(chainId, '=======chainId');
      if (chainId) {
        const chainInfo = Object.values(_networkInfo).find(
          v => v.nativeId === chainId
        );
        const network = chainInfo?.name || null;
        store.commit('changeNetwork', network);
        reload();
      }
    });
  }

  // 连接provider
  async function connect(providerType: string) {
    const provider = getProvider(providerType);
    const isMobile = /Android|webOS|iPhone|iPad|BlackBerry/i.test(
      navigator.userAgent
    );
    if (providerType === 'ethereum' && !provider && isMobile) {
      window.open('https://metamask.app.link/dapp/nerve.network');
      return;
    }
    if (!provider) {
      throw new Error(t('public.public25'));
    }
    await provider?.request({ method: 'eth_requestAccounts' });
    state.address = provider?.selectedAddress;
    storage.set('providerType', providerType);
    listenAccountChange();
    listenNetworkChange();
    reload();
  }

  function disconnect() {
    storage.remove('providerType');
    state.address = '';
    reload();
  }

  function reload() {
    window.location.reload();
  }

  async function addEthereumChain(params: AddChain) {
    const provider = getProvider();
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  }

  async function switchEthereumChain(params: SwitchChain) {
    const provider = getProvider();
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [params]
    });
  }

  return {
    initProvider,
    connect,
    disconnect,
    ...toRefs(state),
    addEthereumChain,
    switchEthereumChain,
    generateAddress
  };
}
