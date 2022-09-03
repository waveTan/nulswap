<template>
  <div class="overview pd_40_rd_20">
    <div class="head" v-if="swapSymbol.to">
      <div class="top flex-center">
        <symbol-icon class="img1" :icon="swapSymbol.from" :key="swapSymbol.from"></symbol-icon>
        <symbol-icon class="img2" :icon="swapSymbol.to" :key="swapSymbol.to"></symbol-icon>
        <div class="pair">{{ swapSymbol.from }}/{{ swapSymbol.to }}</div>
      </div>
      <div class="bottom" v-if="swapRate">{{ swapRate }}</div>
    </div>
    <div class="order-history">
      <div class="order-nav">
        <span
          :class="{ active: txType === 'swap' }"
          @click="changeTxType('swap')"
        >
          {{ $t('trading.trading23') }}
        </span>
        <span
          :class="{ active: txType === 'multiRouting' }"
          @click="changeTxType('multiRouting')"
        >
          {{ $t('trading.trading24') }}
        </span>
      </div>
      <TxList :list="list" v-show="txType === 'swap'"></TxList>
      <TxList :list="list" v-show="txType === 'multiRouting'"></TxList>
      <pagination v-model:pager="newPager" @change="changeList"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import TxList from './TxList.vue';
import Pagination from '@/components/Pagination.vue';
import { SwapSymbol, OrderItem, Pager } from './types';
import { openExplorer, superLong } from '@/utils/util';
export default defineComponent({
  props: {
    swapSymbol: {
      type: Object as PropType<SwapSymbol>,
      default: () => {}
    },
    swapRate: String,
    list: {
      type: Array as PropType<OrderItem[]>,
      default: () => []
    },
    loading: Boolean,
    pager: {
      type: Object as PropType<Pager>,
      default: () => {}
    },
    txType: String
  },
  components: {
    SymbolIcon,
    TxList,
    Pagination
  },
  setup(props, { emit }) {
    const newPager = computed({
      get() {
        return props.pager;
      },
      set(val) {
        emit('update:pager', val);
      }
    });
    function changeTxType(type: string) {
      if (type === props.txType) return;
      emit('update:txType', type);
    }
    function changeList() {
      emit('changeList');
    }
    return {
      newPager,
      changeTxType,
      changeList,
      openExplorer,
      superLong
    };
  }
});
</script>

<style lang="scss" scoped>
@import '../../assets/css/style.scss';
.overview {
  //width: 790px;
  width: 60%;
  height: 752px;
  margin-right: 30px;
  //margin-right: 40px;
  .head {
    margin-bottom: 10px;
    .img1,
    .img2 {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    .img2 {
      margin-left: -8px;
    }
    .pair {
      margin-left: 10px;
      font-size: 24px;
    }
    .bottom {
      padding-top: 8px;
      font-size: 36px;
      color: #475472;
    }
  }
  .order-history {
    .order-nav {
      margin-bottom: 15px;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        margin-right: 40px;
        color: #475472;
        cursor: pointer;
        &.active {
          color: #2688f7;
          border-bottom: 3px solid #2688f7;
        }
      }
    }
    :deep(.el-table) {
      border: none !important;
      th .cell {
        font-size: 16px;
        font-weight: 400;
      }
      tr td {
        border-bottom: 1px solid #e4efff !important;
      }
      tr .cell {
        line-height: 46px;
        font-size: 16px;
        //color: #333;
      }
      .iconfont {
        color: #1678ff;
        font-size: 26px;
      }
    }
  }
  .mobile-list {
    display: none;
  }
  @media screen and (max-width: 1200px) {
    padding: 20px;
    .head {
      margin-bottom: 10px;
      .bottom {
        font-size: 32px;
      }
    }
    .order-history {
      .order-nav {
        margin-bottom: 10px;
        span {
          height: 34px;
          line-height: 34px;
          font-size: 18px;
          margin-right: 30px;
        }
      }
      :deep(.el-table) {
        th .cell {
          font-size: 14px;
        }
        tr .cell {
          line-height: 24px;
          font-size: 14px;
        }
        .iconfont {
          font-size: 22px;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    width: 100%;
    max-height: 460px;
    border: none;
    padding: 0;
    .head {
      margin-bottom: 10px;
      .top {
        img {
          width: 30px;
          height: 30px;
        }
        .pair {
          font-size: 18px;
        }
      }
      .bottom {
        padding-top: 5px;
        font-size: 22px;
      }
    }
    .order-history {

      :deep(.el-table) {
        display: none;
      }
    }
    .mobile-list {
      display: block;
      ul {
        max-height: 335px;
        overflow: auto;
      }
      li {
        padding: 10px 0;
        border-bottom: 1px solid #e4e9f4;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          border-bottom: none;
        }
      }
      .left,
      .right {
        div:first-child {
          margin-bottom: 2px;
        }
        span {
          font-size: 14px;
          color: $labelColor;
        }
        p {
          font-size: 14px;
        }
        .iconfont {
          color: #21d8ba;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
