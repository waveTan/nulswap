<template>
  <div class="w1200 assets-wrap">
    <template v-if="!showTransfer">
      <h3 class="assets-title">{{ $t('assets.assets11') }}</h3>
      <AssetsControl
        v-if="address"
        v-model:searchVal="searchVal"
        v-model:hideSmall="hideSmall"
        @showDialog="showAssetManage = true"
      />
      <div class="assets-list">
        <el-table
          :data="filteredAssets"
          class="show_table"
          v-loading="loading"
          stripe
        >
          <el-table-column width="20px"></el-table-column>
          <el-table-column :label="$t('public.public1')">
            <template v-slot="scope">
              <div class="flex-center">
<!--                <symbol-icon :icon="scope.row.symbol"></symbol-icon>-->
                <el-tooltip placement="top" v-if="scope.row.registerContract">
                  <template #content>
                    <div>
                      <span>
                        {{ $t('assets.assets10') }}
                        {{ scope.row.registerContract }}
                      </span>
                    </div>
                  </template>
                  <SymbolInfo
                    :name="scope.row.symbol"
                    :chain="scope.row.originNetwork"
                    :asset-key="scope.row.assetKey"
                  ></SymbolInfo>
                </el-tooltip>
                <SymbolInfo
                  v-else
                  :name="scope.row.symbol"
                  :chain="scope.row.originNetwork"
                  :asset-key="scope.row.assetKey"
                ></SymbolInfo>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.public2')">
            <template v-slot="scope">
              {{ $thousands(scope.row.available) }}
            </template>
          </el-table-column>
          <el-table-column prop="locking" :label="$t('public.public3')">
            <template v-slot="scope">
              {{ $thousands(scope.row.locking) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.public4')">
            <template v-slot="scope">
              {{ $thousands(scope.row.number) }}
              <p class="ydy">≈${{ $thousands(scope.row.valuation) }}</p>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('public.public5')"
            align="center"
            width="260px"
          >
            <template v-slot="scope">
              <div class="handle-column" v-if="scope.row">
                <el-button
                  type="text"
                  v-if="scope.row.canToL1"
                  :disabled="
                    disableTx || !canToL1OnCurrent(scope.row.canToL1OnCurrent)
                  "
                  @click="transfer(scope.row, TransferType.CrossIn)"
                >
                  {{ $t('transfer.transfer1') }}
                </el-button>
                <el-button
                  type="text"
                  @click="transfer(scope.row, TransferType.General)"
                >
                  {{ $t('transfer.transfer2') }}
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.canToL1"
                  :disabled="
                    disableTx || !canToL1OnCurrent(scope.row.canToL1OnCurrent)
                  "
                  @click="transfer(scope.row, TransferType.Withdrawal)"
                >
                  {{ $t('transfer.transfer3') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="mobile-cont pb-28">
        <el-empty
          :description="$t('public.public19')"
          v-loading="loading"
          v-if="!filteredAssets.length"
        />
        <div v-for="(item, index) in filteredAssets" v-else :key="index">
          <div class="p-24 asset-cont-wrap" @click="assetClick(item)">
            <div class="asset-cont">
              <SymbolInfo
                :name="item.symbol"
                :chain="item.originNetwork"
                :asset-key="item.assetKey"
              ></SymbolInfo>
              <div class="asset-amount flex-center">
                <div class="left">
                  <div class="font-bold align-right" style="font-size: 15px">
                    {{ $thousands(item.number) }}
                  </div>
                  <div class="size-13 align-right">
                    ≈{{ $thousands(item.valuation) }}
                  </div>
                </div>
                <el-icon
                  :class="[
                    'icon-caret-right',
                    item.showDetail ? 'rotate-icon' : ''
                  ]"
                >
                  <CaretRight />
                </el-icon>
              </div>
            </div>
            <div class="t_info">
              <span v-if="item.registerContract">
                {{ $t('assets.assets10') }}
                {{ superLong(item.registerContract, 10) }}
              </span>
            </div>
          </div>

          <CollapseTransition>
            <div class="option-btn" v-if="item.showDetail">
              <div class="btn-cont">
                <div
                  class="btn"
                  @click="transfer(item, TransferType.CrossIn)"
                  v-if="item.canToL1"
                  :class="{
                    btn_disable:
                      disableTx || !canToL1OnCurrent(item.canToL1OnCurrent)
                  }"
                >
                  {{ $t('transfer.transfer1') }}
                </div>
                <div class="btn" @click="transfer(item, TransferType.General)">
                  {{ $t('transfer.transfer2') }}
                </div>
                <div
                  class="btn"
                  @click="transfer(item, TransferType.Withdrawal)"
                  v-if="item.canToL1"
                  :class="{
                    btn_disable:
                      disableTx || !canToL1OnCurrent(item.canToL1OnCurrent)
                  }"
                >
                  {{ $t('transfer.transfer3') }}
                </div>
              </div>
            </div>
          </CollapseTransition>
        </div>
      </div>
    </template>
    <transfer
      v-else
      v-model:currentTab="currentTab"
      v-model:show="showTransfer"
      :disableTx="disableTx || !assetCanCross"
    />
    <assets-manage
      v-model:showAssetManage="showAssetManage"
      :assetList="allAssetsList"
      :selectAssets="selectAssets"
      @addAssets="addAssets"
    ></assets-manage>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  provide,
  ref,
  reactive
} from 'vue';
import AssetsControl from './AssetsControl.vue';
import SymbolInfo from '@/components/SymbolInfo.vue';
import AssetsManage from './AssetsManage.vue';
import Transfer from './transfer/index.vue';
import CollapseTransition from '@/components/CollapseTransition.vue';
import { superLong } from '@/utils/util';
import useStoreState from '@/hooks/useStoreState';
import useAssetsList from './hooks/useAssetsList';
import { specialChain } from '@/hooks/useEthereum';

import { AssetItemType, rootCmpKey, TransferType } from './types';

export default defineComponent({
  name: 'assets',
  components: {
    SymbolInfo,
    AssetsManage,
    Transfer,
    CollapseTransition,
    AssetsControl
  },
  setup() {
    const internalInstance = getCurrentInstance();
    // provide<InstanceType<typeof internalInstance?.proxy>>("father", internalInstance?.proxy);
    provide('father', internalInstance?.proxy);

    const {
      nerveAddress,
      chain: network,
      wrongChain: disableTx,
      currentAccount,
      currentAddress: address
    } = useStoreState();

    const {
      loading,
      searchVal,
      hideSmall,
      allAssetsList,
      selectAssets,
      filteredAssets,
      crossInOutSymbol,
      addAssets,
      assetClick
    } = useAssetsList();

    const showAssetManage = ref(false); // 资产管理弹窗

    // 显示交易tab
    const currentTab = ref<TransferType>(TransferType.General);
    const showTransfer = ref(false);
    const transferAsset = ref<AssetItemType>({} as AssetItemType); // 当前交易的资产
    const assetCanCross = ref(true);

    function transfer(asset: AssetItemType, type: TransferType) {
      if (type !== TransferType.General && disableTx.value) return;
      if (
        type !== TransferType.General &&
        !canToL1OnCurrent(asset.canToL1OnCurrent)
      ) {
        return;
      }
      assetCanCross.value = !(
        disableTx.value || !canToL1OnCurrent(asset.canToL1OnCurrent)
      );
      currentTab.value = type;
      showTransfer.value = true;
      transferAsset.value = asset;
    }

    function canToL1OnCurrent(status: boolean) {
      if (!status) return false;
      if (network.value === 'TRON') return true;
      return specialChain.indexOf(network.value) < 0;
    }

    const rootCmp = reactive({
      nerveAddress,
      address,
      disableTx,
      network,
      transferAsset,
      crossInOutSymbol,
      allAssetsList,
      currentAccount
    });

    provide(rootCmpKey, rootCmp);

    return {
      searchVal,
      hideSmall,
      loading,
      showAssetManage,
      allAssetsList,
      selectAssets,
      filteredAssets,
      crossInOutSymbol,
      showTransfer,
      currentTab,
      transferAsset,
      network,
      disableTx,
      currentAccount,
      address,
      nerveAddress,
      addAssets,
      transfer,
      superLong,
      assetClick,
      TransferType,
      assetCanCross,
      canToL1OnCurrent
    };
  }
});
</script>

<style lang="scss">
@import '../../assets/css/style.scss';

.assets-wrap {
  padding: 0 20px 30px;
  min-height: calc(100vh - 160px);

  .assets-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    color: #475472;
    margin-bottom: 20px;
  }
}

.show_table.el-table--scrollable-y .el-table__body-wrapper {
  overflow: scroll;
}

.handle-column {
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  .iconfont {
    font-size: 24px;
    color: $linkColor;
    margin: 0 10px;
    cursor: pointer;

    &.disable {
      cursor: not-allowed;
    }
  }

  .el-divider {
    background-color: $labelColor;
  }
}

.mobile-cont {
  display: none;
  //padding: 24px 15px 28px 15px;
  background-color: $BgColor;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #e4e9f4;

  .address-wrap {
    text-align: right;
    font-size: 16px;
    //color: #333;
    margin: 20px 0 10px;

    i {
      color: $linkColor;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
    }
  }

  .asset-cont-wrap {
    padding: 10px 15px;
    border-bottom: 1px solid #e4e9f4;

    .t_info {
      font-size: 12px;
      color: $labelColor;
      display: flex;
      justify-content: space-between;
      //padding-top: 2px;
    }
  }

  .asset-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    .symbol-chain-info {
      img {
        height: 28px;
        width: 28px;
        margin-right: 4px;
      }
    }

    .asset-amount {
      flex: 1;
      justify-content: flex-end;
    }

    .icon-caret-right {
      font-size: 16px;
      margin-left: 5px;
      transition: transform 0.1s ease;
    }

    .rotate-icon {
      transform: rotate(-90deg);
    }
  }

  .option-btn {
    padding: 20px 0;
    border-bottom: 1px solid #e4e9f4;
    //background-color: #313161;
    .btn-cont {
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        cursor: pointer;
        height: 36px;
        width: 88px;
        font-size: 15px;
        background-color: #409eff;
        color: #ffffff;
        line-height: 36px;
        text-align: center;
        border-radius: 10px;
        margin: 0 5px;
      }
    }
  }
}

.font-bold {
  //font-weight: bolder;
}

.p-24 {
  padding: 0 15px 0 15px;
}

.pt-25 {
  padding: 25px 15px 0 15px;
}

.pb-28 {
  padding-bottom: 28px;
}

.align-right {
  text-align: right;
}

.btn_disable {
  background-color: #a0cfff !important;
  cursor: not-allowed;
}

.assets-list {
  .font_20 {
    font-size: 20px;
  }

  .el-table {
    border: none !important;

    th.el-table__cell {
      padding: 12px 0;
    }

    .el-table__cell {
      padding: 10px 0;
    }

    th .cell {
      font-size: 16px;
    }

    tr .cell {
      font-size: 16px;
    }

    tr .flex-center {
      span {
        //font-weight: 600;
        //margin-left: 10px;
      }

      .t_info {
        margin-left: 10px;

        span {
          //font-weight: 600;
          line-height: 1;
          margin-bottom: 5px;
        }

        p {
          font-size: 14px;
          text-align: left;
          color: #c0c4cc;
          line-height: 1;
        }
      }
    }

    .el-button--text {
      color: #2688f7;
      &.is-disabled {
        color: #c0c4cc;
      }
      span {
        font-size: 14px;
      }
    }

    .ydy {
      color: $labelColor;
    }
  }
}

@media screen and (max-width: 1024px) {
  .assets-wrap {
    padding: 0 16px;
  }
  .assets-wrap .assets-title {
    margin-bottom: 15px;
  }
  .mobile-cont {
    display: block;
  }
  .assets-list {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  //.show_table {
  //  display: none;
  //}
  //.assets-list {
  //  display: block;
  //}
  .assets-list {
    padding: 20px;
    border-radius: 20px !important;
  }
  .assets-list .top .top-title {
    font-size: 18px;
  }
  .assets-list .font_20 {
    font-size: 16px;
  }
  .transfer-page .bottom {
    //padding: 10px;
  }
}
</style>
