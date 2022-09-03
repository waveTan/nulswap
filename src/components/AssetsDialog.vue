<template>
  <el-dialog
    custom-class="select-assets-dialog"
    :title="$t('transfer.transfer12')"
    :show-close="true"
    top="10vh"
    v-model="show"
    @closed="searchVal = ''"
  >
    <el-input
      v-if="!hideSearchInput"
      v-model="searchVal"
      :placeholder="$t(showAmount ? 'assets.assets8' : 'assets.assets9')"
    ></el-input>
    <ul class="hot-assets">
      <li
        v-for="item in hotAssets"
        :key="item.assetKey"
        :class="{ active: item.assetKey === selectedAsset?.assetKey }"
        @click="selectHotAsset(item.assetKey)"
      >
        <SymbolIcon :icon="item.symbol" :asset-key="item.assetKey"></SymbolIcon>
        {{ item.symbol }}
        <template v-if="item.registerChain">
          <span>({{ item.registerChain }})</span>
        </template>
      </li>
    </ul>
    <ul class="list-wrap">
      <li
        v-for="item in assetList"
        :key="item.assetKey"
        :class="{
          disable_asset:
            selectedAsset &&
            selectedAsset.chainId === item.chainId &&
            selectedAsset.assetId === item.assetId
        }"
        @click="changeSelect(item)"
      >
        <div class="flex-center flex-1" style="width: 100%">
          <SymbolIcon :icon="item.symbol" :asset-key="item.assetKey"></SymbolIcon>
          <div class="asset-base-info">
            <div>
              {{ item.symbol }}
              <span>({{ item.originNetwork }})</span>
            </div>
            <span v-if="showAmount">ID: {{ item.assetKey }}</span>
            <template v-else>
              <span class="pc-span">{{ item.contractAddress }}</span>
              <span class="mobile-span">
                {{ superLong(item.contractAddress, 15) }}
              </span>
            </template>
          </div>
          <div class="asset-price ellipsis" v-if="showBalance">
            <span class="ellipsis" v-if="showAmount">
              {{ item.listAvailable }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import { superLong } from '@/utils/util';
import SymbolIcon from '@/components/SymbolIcon.vue';

import { AssetItem } from '@/store/types';
import { HotAsset } from '@/views/swap/types';

export default defineComponent({
  name: 'AssetsDialog',
  components: {
    SymbolIcon
  },
  props: {
    showDialog: Boolean,
    assetList: {
      type: Array as PropType<AssetItem[]>,
      default: () => []
    },
    hotAssets: {
      type: Array as PropType<HotAsset[]>,
      default: () => []
    },
    showAmount: {
      type: Boolean,
      default: true
    },
    showBalance: {
      type: Boolean
    },
    selectedAsset: {
      type: Object as PropType<AssetItem>,
      default: () => null
    },
    hideSearchInput: {
      type: Boolean,
      default: false
    }
  },
  emits: ['filterAsset', 'changeSelect', 'update:showDialog'],
  setup(props, { emit }) {
    const show = computed({
      get() {
        return props.showDialog;
      },
      set(val) {
        emit('update:showDialog', val);
      }
    });

    const searchVal = ref('');
    watch(
      () => searchVal.value,
      val => {
        emit('filterAsset', val);
      }
    );

    function changeSelect(asset: AssetItem) {
      emit('changeSelect', asset);
    }
    function selectHotAsset(key: string) {
      const asset = props.assetList.find(v => v.assetKey === key);
      console.log(key, 88);
      emit('changeSelect', asset);
    }

    return {
      show,
      searchVal,
      superLong,
      changeSelect,
      selectHotAsset
    };
  }
});
</script>

<style scoped lang="scss">
@import '../assets/css/style.scss';
.select-assets-dialog {
  .el-input {
    .el-input__inner {
      border-radius: 10px;
      line-height: 45px;
      height: 45px;
    }
    margin-bottom: 15px;
  }
  .hot-assets {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      border: 1px solid #e3eeff;
      background: #f3f6fd;
      color: #475472;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
        background-color: #fff;
      }
      &.active {
        opacity: 0.6;
      }
    }
  }
  .list-wrap {
    max-height: 50vh;
    overflow-y: auto;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 66px;
      padding: 9px 0;
      cursor: pointer;
      img {
        width: 48px;
        height: 48px;
        margin-right: 15px;
      }
      .asset-base-info {
        flex: 1;
        div {
          font-size: 18px;
          //font-weight: 600;
        }
        span {
          font-size: 14px;
          color: $labelColor;
          font-weight: 400;
        }
        .mobile-span {
          display: none;
        }
      }
      .asset-price {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;
        max-width: 60%;
        span:nth-child(1) {
          text-align: right;
          font-size: 20px;
          //font-weight: bold;
        }
      }
    }
    .disable_asset {
      opacity: 0.6;
      cursor: not-allowed !important;
    }
  }
  @media screen and (max-width: 1200px) {
    .hot-assets {
      li {
        height: 36px;
        font-size: 14px;
        padding: 0 6px;
        border-radius: 6px;
      }
    }
    .list-wrap {
      li {
        .asset-base-info {
          .pc-span {
            display: none;
          }
          .mobile-span {
            display: block;
          }
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .el-input {
      .el-input__inner {
        line-height: 36px;
        height: 36px;
      }
      margin-bottom: 10px;
    }
    .list-wrap {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
        .asset-base-info {
          flex: 1;
          div {
            font-size: 14px;
          }
          span {
            font-size: 12px;
          }
        }
        .asset-price {
          max-width: 60%;
          span:nth-child(1) {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
