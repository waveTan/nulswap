<template>
  <div class="partner">
    <h3>{{ $t('home.home9') }}</h3>
    <!--    <div class="partner-list">-->
    <el-row :gutter="20" class="partner-list">
      <el-col :span="12" :lg="6" v-for="item in partners" :key="item.src">
        <a :href="item.href" target="_blank">
          <img :src="item.src" alt="" />
        </a>
      </el-col>
    </el-row>
    <!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
import OMNI from '@/assets/img/partner/OMINI.jpg';
import CATCHERVC from '@/assets/img/partner/CATCHERVC.png';
import Binance from '@/assets/img/partner/Binance.png';
import Polygon from '@/assets/img/partner/Polygon.png';
import Cronos from '@/assets/img/partner/Cronos.png';
import Arbitrum from '@/assets/img/partner/Arbitrum.png';
import Heco from '@/assets/img/partner/Heco.png';
import OKEXChain from '@/assets/img/partner/OEC.png';
import Kcc from '@/assets/img/partner/Kcc.png';
import Harmony from '@/assets/img/partner/Harmony.png';
import NULS from '@/assets/img/partner/nuls.jpg';
import Nabox from '@/assets/img/partner/nabox.jpg';
import SlowMist from '@/assets/img/partner/slowMist.jpg';
import ChainGuard from '@/assets/img/partner/chainsGuard.jpg';

const partners = [
  {
    src: OMNI,
    href: 'https://www.omnichains.com/'
  },
  {
    src: CATCHERVC,
    href: 'https://catchervc.chaincatcher.com/'
  },
  {
    src: Binance,
    href: 'https://www.binance.org/'
  },
  {
    src: Polygon,
    href: 'https://polygon.technology/'
  },
  {
    src: Cronos,
    href: 'https://cronos.crypto.org/'
  },
  {
    src: Arbitrum,
    href: 'https://arbitrum.io/'
  },
  {
    src: Heco,
    href: 'https://www.hecochain.com/'
  },
  {
    src: OKEXChain,
    href: 'https://okex.com/okchain'
  },
  {
    src: Kcc,
    href: 'https://www.kcc.io/'
  },
  {
    src: Harmony,
    href: 'https://www.harmony.one/'
  },
  {
    src: NULS,
    href: 'https://www.nuls.io/'
  },
  {
    src: Nabox,
    href: 'http://nabox.io/'
  },
  {
    src: SlowMist,
    href: 'https://www.slowmist.com/'
  },
  {
    src: ChainGuard,
    href: 'https://www.chainsguard.com/index.html#home'
  }
];

/*const partners = [
  {
    src: NULS,
    href: 'https://www.nuls.io/'
  },
  {
    src: Nabox,
    href: 'http://nabox.io/'
  },
  {
    src: Binance,
    href: 'https://bscscan.com/'
  },
  {
    src: OKEXChain,
    href: 'https://okex.com/okchain'
  },
  {
    src: SlowMist,
    href: 'https://www.slowmist.com/'
  },
  {
    src: UniSwap,
    href: 'https://app.uniswap.org/#/swap'
  },
  {
    src: ChainGuard,
    href: 'https://www.chainsguard.com/index.html#home'
  },
  {
    src: PancakeSwap,
    href: 'https://pancakeswap.finance/'
  },
  {
    src: MDEX,
    href: 'https://ht.mdex.com/'
  },
  {
    src: Polygon,
    href: ''
  }
];*/
</script>

<style lang="scss">
.partner {
  padding-top: 40px;
  margin-bottom: 70px;

  h3 {
    color: #475472;
    font-size: 30px;
    margin-bottom: 50px;
    text-align: center;
    font-weight: 600;
  }

  .partner-list {
    .el-col {
      margin-bottom: 20px;
    }

    a {
      display: inline-block;
      background-color: #fff;
      //border: 1px solid #e4e9f4;
      border-radius: 20px;
      overflow: hidden;

      img {
        width: 100%;
        //height: 90px;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    margin-bottom: 20px;
    padding-top: 0;
    h3 {
      font-size: 24px;
      margin: 50px 0 20px;
    }
    .partner-list {
      .el-col {
        margin-bottom: 10px;
      }
    }
    .el-col-12 {
      padding-left: 6px !important;
      padding-right: 6px !important;
    }
  }
}
</style>
