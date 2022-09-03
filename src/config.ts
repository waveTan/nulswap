type EnvType = 'beta' | 'prod';

const env = process.env.BUILD_ENV as EnvType;

/*function getWSUrl(): string {
  let url;
  if (env === 'beta') {
    url = 'ws://beta.api.swap.nerve.network/ws';
    // url = "ws://api.swap.nerve.network/ws"
  } else {
    url = 'wss://api.swap.nerve.network/ws';
  }
  return url;
}

const WS_URL = getWSUrl();*/
const timeout = 15000;

const config = {
  beta: {
    isBeta: true,
    API_URL: 'http://beta.public.nerve.network',
    WS_URL: 'ws://beta.api.swap.nerve.network/ws',
    // WS_URL: 'ws://124.71.114.119:8009/ws',
    chainId: 5,
    assetId: 1,
    prefix: 'TNVT',
    symbol: 'NVT',
    NULSConfig: {
      chainId: 2,
      assetId: 1,
      prefix: 'tNULS'
    },
    timeout,
    ETHNET: 'ropsten',
    feeAddress: 'TNVTdTSPP9oSLvdtVSVFiUYCvXJdj1ZA1nyQU', //提现费用地址
    destroyAddress: 'TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY', // 黑洞地址
    /*htgMainAsset: {
      // 提现费用资产信息
      NERVE: { chainId: 5, assetId: 1, decimals: 8, symbol: 'NVT' },
      Ethereum: { chainId: 5, assetId: 2, decimals: 18, symbol: 'ETH' },
      BSC: { chainId: 5, assetId: 8, decimals: 18, symbol: 'BNB' },
      Heco: { chainId: 5, assetId: 9, decimals: 18, symbol: 'HT' },
      OKExChain: { chainId: 5, assetId: 12, decimals: 18, symbol: 'OKT' },
      Harmony: { chainId: 5, assetId: 33, decimals: 18, symbol: 'ONE' },
      Polygon: { chainId: 5, assetId: 34, decimals: 18, symbol: 'MATIC' },
      KCC: { chainId: 5, assetId: 35, decimals: 18, symbol: 'KCS' },
      TRON: { chainId: 5, assetId: 55, decimals: 6, symbol: 'TRX' },
      Cronos: { chainId: 5, assetId: 93, decimals: 18, symbol: 'CRO' },
      Avalanche: { chainId: 5, assetId: 94, decimals: 18, symbol: 'AVAX' },
      Arbitrum: { chainId: 5, assetId: 95, decimals: 18, symbol: 'AETH' },
      Fantom: { chainId: 5, assetId: 96, decimals: 18, symbol: 'FTM' }
    },*/
    trxWithdrawFee: '40000000',
    explorerUrl: 'http://beta.scan.nerve.network',
    bridgeUrl: 'http://beta.bridge.nerve.network/'
  },
  prod: {
    isBeta: false,
    API_URL: 'https://public.nerve.network',
    WS_URL: 'wss://api.swap.nerve.network/ws',
    chainId: 9,
    assetId: 1,
    prefix: 'NERVE',
    symbol: 'NVT',
    NULSConfig: {
      chainId: 1,
      assetId: 1,
      prefix: 'NULS'
    },
    timeout,
    ETHNET: 'homestead',
    feeAddress: 'NERVEepb69f573sRzfoTX9Kn67WeNtXhG6Y6W8',
    destroyAddress: 'NERVEepb63T1M8JgQ26jwZpZXYL8ZMLdUAK31L',
    /*htgMainAsset: {
      NERVE: { chainId: 9, assetId: 1, decimals: 8, symbol: 'NVT' },
      Ethereum: { chainId: 9, assetId: 2, decimals: 18, symbol: 'ETH' },
      BSC: { chainId: 9, assetId: 25, decimals: 18, symbol: 'BNB' },
      Heco: { chainId: 9, assetId: 55, decimals: 18, symbol: 'HT' },
      OKExChain: { chainId: 9, assetId: 87, decimals: 18, symbol: 'OKT' },
      Harmony: { chainId: 9, assetId: 159, decimals: 18, symbol: 'ONE' },
      Polygon: { chainId: 9, assetId: 160, decimals: 18, symbol: 'MATIC' },
      KCC: { chainId: 9, assetId: 161, decimals: 18, symbol: 'KCS' },
      TRON: { chainId: 9, assetId: 218, decimals: 6, symbol: 'TRX' },
      Cronos: { chainId: 9, assetId: 266, decimals: 18, symbol: 'CRO' },
      Avalanche: { chainId: 9, assetId: 267, decimals: 18, symbol: 'AVAX' },
      Arbitrum: { chainId: 9, assetId: 268, decimals: 18, symbol: 'AETH' },
      Fantom: { chainId: 9, assetId: 269, decimals: 6, symbol: 'FTM' }
    },*/
    trxWithdrawFee: '40000000',
    explorerUrl: 'https://scan.nerve.network',
    bridgeUrl: 'https://bridge.nerve.network/'
  }
};

export default config[env];
