import config from '@/config';

import NULSLogo from '@/assets/img/chainLogo/NULS.png';
import NERVELogo from '@/assets/img/chainLogo/NERVE.png';
import ETHLogo from '@/assets/img/chainLogo/ETH.png';
import BSCLogo from '@/assets/img/chainLogo/BSC.jpg';
import HecoLogo from '@/assets/img/chainLogo/Heco.png';
import OECLogo from '@/assets/img/chainLogo/OEC.png';
import HarmonyLogo from '@/assets/img/chainLogo/Harmony.png';
import PolygonLogo from '@/assets/img/chainLogo/Polygon.png';
import KCCLogo from '@/assets/img/chainLogo/KCC.png';
import CROLogo from '@/assets/img/chainLogo/Cronos.png';
import AVAVLogo from '@/assets/img/chainLogo/AVAX.png';
import ARBILogo from '@/assets/img/chainLogo/arbitrum.png';
import FTMLogo from '@/assets/img/chainLogo/fantom.png';
import TRONLogo from '@/assets/img/chainLogo/tron.svg';
import MetisLogo from '@/assets/img/chainLogo/Metis.png';
import LotexLogo from '@/assets/img/chainLogo/LOTEX.png';
import OptimismLogo from '@/assets/img/chainLogo/optimism.png';
import KlaytnLogo from '@/assets/img/chainLogo/Klaytn.png';
import SmartBCHLogo from '@/assets/img/chainLogo/smartBCH.png';

const isBeta = config.isBeta;

const NERVEOrigin = isBeta
  ? 'http://beta.scan.nerve.network'
  : 'https://scan.nerve.network';
const NULSOrigin = isBeta ? 'http://beta.nulscan.io' : 'https://nulscan.io';
const ETHOrigin = isBeta
  ? 'https://ropsten.etherscan.io'
  : 'https://etherscan.io';
const BSCOrigin = isBeta
  ? 'https://testnet.bscscan.com'
  : 'https://bscscan.com';
const HecoOrigin = isBeta
  ? 'https://testnet.hecoinfo.com'
  : 'https://hecoinfo.com';
const OECOrigin = isBeta
  ? 'https://www.oklink.com/okexchain-test'
  : 'https://www.oklink.com/okexchain';
const HarmonyOrigin = isBeta
  ? 'https://explorer.pops.one'
  : 'https://explorer.harmony.one';
const PolygonOrigin = isBeta
  ? 'https://mumbai.polygonscan.com'
  : 'https://polygonscan.com';
const KCCOrigin = isBeta
  ? 'https://scan-testnet.kcc.network'
  : 'https://explorer.kcc.io';
const TRONOrigin = isBeta
  ? 'https://shasta.tronscan.org/#'
  : 'https://tronscan.org/#';
const CronosOrigin = isBeta
  ? 'https://cronos.crypto.org/explorer/testnet3'
  : 'https://cronos.crypto.org/explorer';
const AvalancheOrigin = isBeta
  ? 'https://testnet.snowtrace.io'
  : 'https://snowtrace.io';
const ArbitrumOrigin = isBeta
  ? 'https://testnet.arbiscan.io'
  : 'https://arbiscan.io';
const FantomOrigin = isBeta
  ? 'https://testnet.ftmscan.com'
  : 'https://ftmscan.com';
const MetisOrigin = isBeta
  ? 'https://stardust-explorer.metis.io'
  : 'https://andromeda-explorer.metis.io';
const LotexOrigin = isBeta
  ? 'https://testnet.iotexscan.io'
  : 'https://iotexscan.io';
const OptimismOrigin = isBeta
  ? 'https://kovan-optimistic.etherscan.io'
  : 'https://optimistic.etherscan.io';
const KlaytnOrigin = isBeta
  ? 'https://baobab.scope.klaytn.com'
  : 'https://scope.klaytn.com';
const SmartBCHOrigin = isBeta
  ? 'https://smartscan.cash'
  : 'https://smartscan.cash';

export const RPC_URL = {
  BSC: isBeta
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed.binance.org/',
  Polygon: isBeta
    ? 'https://matic-mumbai.chainstacklabs.com'
    : 'https://matic-mainnet.chainstacklabs.com',
  Heco: isBeta
    ? 'https://http-testnet.hecochain.com'
    : 'https://http-mainnet.hecochain.com',
  OKC: isBeta
    ? 'https://exchaintestrpc.okex.org'
    : 'https://exchainrpc.okex.org',
  Avalanche: isBeta
    ? 'https://api.avax-test.network/ext/bc/C/rpc'
    : 'https://api.avax.network/ext/bc/C/rpc',
  Harmony: isBeta ? 'https://api.s0.b.hmny.io' : 'https://api.harmony.one',
  KCC: isBeta
    ? 'https://rpc-testnet.kcc.network'
    : 'https://rpc-mainnet.kcc.network',
  Cronos: isBeta
    ? 'https://cronos-testnet-3.crypto.org:8545'
    : 'https://evm-cronos.crypto.org',
  Arbitrum: isBeta
    ? 'https://rinkeby.arbitrum.io/rpc'
    : 'https://arb1.arbitrum.io/rpc',
  Fantom: isBeta
    ? 'https://rpc.testnet.fantom.network'
    : 'https://rpc.ftm.tools',
  Metis: isBeta
    ? 'https://stardust.metis.io/?owner=588'
    : 'https://andromeda.metis.io/?owner=1088',
  Iotex: isBeta
    ? 'https://babel-api.testnet.iotex.io'
    : 'https://babel-api.mainnet.iotex.io',
  Optimism: isBeta
    ? 'https://kovan.optimism.io'
    : 'https://mainnet.optimism.io',
  Klaytn: isBeta
    ? 'https://api.baobab.klaytn.net:8651'
    : 'https://public-node-api.klaytnapi.com/v1/cypress',
  smartBCH: isBeta
    ? 'https://moeing.tech:9545'
    : 'https://smartbch.greyh.at',
};

export const _networkInfo = {
  Ethereum: {
    name: 'Ethereum',
    chainName: isBeta ? 'Ethereum_Beta' : 'Ethereum', // 用于metamask添加链时显示链名称 区分正式、测试网
    chainId: 101,
    assetKey: isBeta ? '5-2' : '9-2',
    origin: ETHOrigin,
    mainAsset: 'ETH',
    nativeId: isBeta ? '0x3' : '0x1',
    supported: true,
    logo: ETHLogo
  },
  BSC: {
    name: 'BSC',
    chainName: isBeta ? 'BSC_Beta' : 'BSC',
    chainId: 102,
    assetKey: isBeta ? '5-8' : '9-25',
    origin: BSCOrigin,
    mainAsset: 'BNB',
    nativeId: isBeta ? '0x61' : '0x38',
    supported: true,
    logo: BSCLogo,
    decimals: 18,
    rpcUrl: RPC_URL.BSC
  },
  Polygon: {
    name: 'Polygon',
    chainName: isBeta ? 'Polygon_Beta' : 'Polygon',
    chainId: 106,
    assetKey: isBeta ? '5-34' : '9-160',
    origin: PolygonOrigin,
    mainAsset: 'MATIC',
    nativeId: isBeta ? '0x13881' : '0x89',
    supported: true,
    logo: PolygonLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Polygon
  },
  Heco: {
    name: 'Heco',
    chainName: isBeta ? 'Heco_Beta' : 'Heco',
    chainId: 103,
    assetKey: isBeta ? '5-9' : '9-55',
    origin: HecoOrigin,
    mainAsset: 'HT',
    nativeId: isBeta ? '0x100' : '0x80',
    supported: true,
    logo: HecoLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Heco
  },
  OKC: {
    name: 'OKC',
    chainName: isBeta ? 'OKC_Beta' : 'OKC',
    chainId: 104,
    assetKey: isBeta ? '5-12' : '9-87',
    origin: OECOrigin,
    mainAsset: 'OKT',
    nativeId: isBeta ? '0x41' : '0x42',
    supported: true,
    logo: OECLogo,
    decimals: 18,
    rpcUrl: RPC_URL.OKC
  },
  Avalanche: {
    name: 'Avalanche',
    chainName: isBeta ? 'Avalanche_Beta' : 'Avalanche',
    chainId: 110,
    assetKey: isBeta ? '5-94' : '9-267',
    origin: AvalancheOrigin,
    mainAsset: 'AVAX',
    nativeId: isBeta ? '0xa869' : '0xa86a',
    supported: true,
    logo: AVAVLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Avalanche
  },
  Harmony: {
    name: 'Harmony',
    chainName: isBeta ? 'Harmony_Beta' : 'Harmony',
    chainId: 105,
    assetKey: isBeta ? '5-33' : '9-159',
    origin: HarmonyOrigin,
    mainAsset: 'ONE',
    nativeId: isBeta ? '0x6357d2e0' : '0x63564c40',
    supported: true,
    logo: HarmonyLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Harmony
  },
  KCC: {
    name: 'KCC',
    chainName: isBeta ? 'KCC_Beta' : 'KCC',
    chainId: 107,
    assetKey: isBeta ? '5-35' : '9-161',
    origin: KCCOrigin,
    mainAsset: 'KCS',
    nativeId: isBeta ? '0x142' : '0x141',
    supported: true,
    logo: KCCLogo,
    decimals: 18,
    rpcUrl: RPC_URL.KCC
  },
  Cronos: {
    name: 'Cronos',
    chainName: isBeta ? 'Cronos_Beta' : 'Cronos',
    chainId: 109,
    assetKey: isBeta ? '5-93' : '9-266',
    origin: CronosOrigin,
    mainAsset: 'CRO',
    nativeId: isBeta ? '0x152' : '0x19',
    supported: true,
    logo: CROLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Cronos
  },
  Arbitrum: {
    name: 'Arbitrum',
    chainName: isBeta ? 'Arbitrum_Beta' : 'Arbitrum',
    chainId: 111,
    assetKey: isBeta ? '5-95' : '9-268',
    origin: ArbitrumOrigin,
    mainAsset: 'AETH',
    nativeId: isBeta ? '0x66eeb' : '0xa4b1',
    supported: true,
    logo: ARBILogo,
    decimals: 18,
    rpcUrl: RPC_URL.Arbitrum
  },
  Fantom: {
    name: 'Fantom',
    chainName: isBeta ? 'Fantom_Beta' : 'Fantom',
    chainId: 112,
    assetKey: isBeta ? '5-96' : '9-269',
    origin: FantomOrigin,
    mainAsset: 'FTM',
    nativeId: isBeta ? '0xfa2' : '0xfa',
    supported: true,
    logo: FTMLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Fantom
  },
  TRON: {
    name: 'TRON',
    chainName: 'TRON',
    chainId: 108,
    assetKey: isBeta ? '5-55' : '9-218',
    origin: TRONOrigin,
    mainAsset: 'TRX',
    nativeId: '',
    supported: true,
    logo: TRONLogo,
    decimals: 6
  },
  Metis: {
    name: 'Metis',
    chainName: isBeta ? 'Metis_Beta' : 'Metis',
    chainId: 113,
    assetKey: isBeta ? '5-115' : '9-445',
    origin: MetisOrigin,
    mainAsset: 'METIS',
    nativeId: isBeta ? '0x24c' : '0x440',
    supported: true,
    logo: MetisLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Metis
  },
  Iotex: {
    name: 'Iotex',
    chainName: isBeta ? 'Iotex_Beta' : 'Iotex',
    chainId: 114,
    assetKey: isBeta ? '5-116' : '9-446',
    origin: LotexOrigin,
    mainAsset: 'IOTX',
    nativeId: isBeta ? '0x1252' : '0x1251',
    supported: true,
    logo: LotexLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Iotex
  },
  Optimism: {
    name: 'Optimism',
    chainName: isBeta ? 'Optimism_Beta' : 'Optimism',
    chainId: 115,
    assetKey: isBeta ? '5-117' : '9-447',
    origin: OptimismOrigin,
    mainAsset: 'OETH',
    nativeId: isBeta ? '0x45' : '0xa',
    supported: true,
    logo: OptimismLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Optimism
  },
  Klaytn: {
    name: 'Klaytn',
    chainName: isBeta ? 'Klaytn_Beta' : 'Klaytn',
    chainId: 116,
    assetKey: isBeta ? '5-118' : '9-448',
    origin: KlaytnOrigin,
    mainAsset: 'KLAY',
    nativeId: isBeta ? '0x3e9' : '0x2019',
    supported: true,
    logo: KlaytnLogo,
    decimals: 18,
    rpcUrl: RPC_URL.Klaytn
  },
  smartBCH: {
    name: 'smartBCH',
    chainName: isBeta ? 'smartBCH_Beta' : 'smartBCH',
    chainId: 117,
    assetKey: isBeta ? '5-119' : '9-449',
    origin: SmartBCHOrigin,
    mainAsset: 'BCH',
    nativeId: isBeta ? '0x2711' : '0x2710',
    supported: true,
    logo: SmartBCHLogo,
    decimals: 18,
    rpcUrl: RPC_URL.smartBCH
  },
  NULS: {
    name: 'NULS',
    chainName: 'NULS',
    chainId: isBeta ? 2 : 1,
    assetKey: isBeta ? '2-1' : '1-1',
    origin: NULSOrigin,
    mainAsset: 'NULS',
    nativeId: '0x-1',
    supported: true,
    logo: NULSLogo
  },
  NERVE: {
    name: 'NERVE',
    chainName: 'NERVE',
    chainId: isBeta ? 5 : 9,
    assetKey: isBeta ? '5-1' : '9-1',
    origin: NERVEOrigin,
    mainAsset: 'NVT',
    nativeId: '0x-2',
    supported: true,
    logo: NERVELogo
  }
};
