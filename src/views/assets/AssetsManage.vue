<template>
  <div class="custom-overlay">
    <el-dialog
      custom-class="add-assets-dialog"
      :show-close="false"
      top="10vh"
      v-model="showDialog"
      @closed="closed"
    >
      <template #title>
        <div class="title-slot flex-between">
          <span class="title">{{ $t('assets.assets7') }}</span>
          <span class="link" @click="submitToken">
            {{ $t('assets.assets13') }}
          </span>
        </div>
      </template>
      <el-input
        v-model="searchVal"
        :placeholder="$t('assets.assets8')"
      ></el-input>
      <!--      <VirtualList :list="list">
        <template v-slot="scope">
          <div @click="changeSelect(scope.item.assetKey)" class="list-item">
            <div class="flex-center">
              <symbol-icon :icon="scope.item.symbol"></symbol-icon>
              <div class="asset-base-info">
                <div>
                  {{ scope.item.symbol }}
                  <span>({{ scope.item.originNetwork }})</span>
                </div>
                <span>ID: {{ scope.item.assetKey }}</span>
              </div>
            </div>
            <keep-alive>
              <el-checkbox v-model="scope.item.added" disabled></el-checkbox>
            </keep-alive>
          </div>
        </template>
      </VirtualList>-->
      <ul class="list-wrap" v-if="list.length">
        <li
          v-for="item in list"
          :key="item.assetKey"
          @click="changeSelect(item.assetKey)"
          :class="{ 'disable-item': noCancel(item.chainId, item.assetId) }"
        >
          <div class="flex-center">
            <symbol-icon :icon="item.symbol" :asset-key="item.assetKey"></symbol-icon>
            <div class="asset-base-info">
              <div>
                {{ item.symbol }}
                <span>({{ item.originNetwork }})</span>
              </div>
              <span>ID: {{ item.assetKey }}</span>
            </div>
          </div>
          <el-checkbox v-model="item.added" disabled></el-checkbox>
        </li>
      </ul>
      <p v-else class="no-data" style="line-height: 30px">
        {{ $t('public.public19') }}
      </p>
      <div class="footer-wrap">
        <el-button @click="showDialog = false">
          {{ $t('public.public8') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('public.public9') }}
        </el-button>
      </div>
      <div class="dialog-footer_mobile">
        <el-button @click="showDialog = false">
          {{ $t('public.public8') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('public.public9') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref } from 'vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import _ from 'lodash';
import config from '@/config';
// import VirtualList from "@/components/VirtualList.vue";

import { AssetItemType } from './types';

export default defineComponent({
  components: {
    SymbolIcon
    // VirtualList
  },

  props: {
    showAssetManage: Boolean,
    assetList: {
      type: Array as PropType<AssetItemType[]>,
      default: () => []
    },
    selectAssets: {
      type: Array as PropType<AssetItemType[]>,
      default: () => []
    }
  },

  emits: ['addAssets', 'update:showAssetManage'],

  setup(props, { emit }) {
    const showDialog = computed({
      get() {
        return props.showAssetManage;
      },
      set(val) {
        emit('update:showAssetManage', val);
      }
    });
    // watch()
    const list = ref<AssetItemType[]>([]);
    let backupList: AssetItemType[] = [];
    const searchVal = ref('');
    // const virtualList = ref<InstanceType<typeof VirtualList>>();
    watch(
      () => props.showAssetManage,
      val => {
        if (val) {
          const cloneList: AssetItemType[] = _.cloneDeep(props.assetList);
          cloneList.map(item => {
            item.added = false;
            props.selectAssets.map(v => {
              if (item.assetKey === v.assetKey) {
                item.added = true;
              }
            });
          });
          list.value = cloneList;
          backupList = _.cloneDeep(cloneList);
          // virtualList.value?.resetScroll();
          filter(searchVal.value);
        }
      }
    );

    function filter(str: string) {
      if (!str) {
        list.value = backupList.filter(v => v);
      } else {
        list.value = backupList.filter(v => {
          return (
            v.assetKey.indexOf(str) > -1 ||
            v.symbol.toUpperCase().indexOf(str.toUpperCase()) > -1
          );
        });
      }
    }
    function changeSelect(key: string) {
      const nvtKey = config.chainId + '-' + config.assetId;
      if (key === nvtKey) return;
      backupList.map(v => {
        if (v.assetKey === key) {
          v.added = !v.added;
        }
      });
      filter(searchVal.value);
    }

    watch(
      () => searchVal.value,
      val => {
        // virtualList.value?.resetScroll();
        filter(val);
      }
    );

    function confirm() {
      const select: string[] = [];
      backupList.map(v => {
        if (v.added) {
          select.push(v.assetKey);
        }
      });
      emit('addAssets', select);
      showDialog.value = false;
    }

    function closed() {
      searchVal.value = '';
      // virtualList.value?.resetScroll();
    }

    // 不能取消勾选
    function noCancel(assetChainId: number, assetsId: number) {
      return config.chainId === assetChainId && config.assetId === assetsId;
    }

    function submitToken() {
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSdPXX4EDtzxqBg3OBMIq7EtoiBxnxcqokIeVzAqyXQFYbmf4w/viewform'
      );
    }

    return {
      list,
      showDialog,
      changeSelect,
      searchVal,
      closed,
      confirm,
      noCancel,
      submitToken
    };
  }
});
</script>
<style lang="scss">
@import '../../assets/css/style.scss';
.add-assets-dialog {
  max-width: 470px !important;
  .title-slot {
    span {
      font-size: 16px;
      &:first-child {
        font-size: 20px;
        font-weight: 600;
        color: #475472;
      }
    }
  }
  .el-input {
    .el-input__inner {
      border-radius: 10px;
      line-height: 52px;
      height: 52px;
    }
    margin-bottom: 15px;
  }
  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 66px;
    padding: 9px 0;
    /* border-bottom: 1px solid #dfe4ef; */
    cursor: pointer;
    img {
      width: 48px;
      height: 48px;
      margin-right: 15px;
    }
    .asset-base-info {
      /* width: 120px; */
      div {
        font-size: 18px;
        //font-weight: 600;
      }
      span {
        font-size: 14px;
        color: $labelColor;
        font-weight: 400;
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
      /* border-bottom: 1px solid #dfe4ef; */
      cursor: pointer;
      img {
        width: 48px;
        height: 48px;
        margin-right: 15px;
      }
      .asset-base-info {
        /* width: 120px; */
        div {
          font-size: 18px;
          //font-weight: 600;
        }
        span {
          font-size: 14px;
          //color: $labelColor;
          font-weight: 400;
        }
      }
      .el-checkbox {
        margin-right: 10px;
        .el-checkbox__inner {
          width: 20px;
          height: 20px;
          background: #fff !important;
          &::after {
            height: 10px;
            left: 6px;
            top: 2px;
            font-weight: 600;
            width: 5px;
          }
        }
        .el-checkbox__input .el-checkbox__inner {
          cursor: pointer !important;
          &:after {
            cursor: pointer !important;
          }
        }
        &.is-checked {
          .el-checkbox__inner {
            background-color: #409eff !important;
            border-color: #409eff;
            &:after {
              border-color: #fff;
            }
          }
        }
      }
      &.disable-item {
        cursor: not-allowed;
        .el-checkbox {
          .el-checkbox__input .el-checkbox__inner {
            cursor: not-allowed !important;
            &:after {
              cursor: not-allowed !important;
            }
          }
          &.is-checked {
            .el-checkbox__inner {
              background-color: #dcdfe6 !important;
              border-color: #dcdfe6;
            }
          }
        }
      }
    }
  }
  .footer-wrap {
    display: block;
    padding-top: 30px;
    .el-button {
      width: 185px;
      height: 48px;
      & + .el-button {
        margin-left: 20px;
      }
    }
  }

  .dialog-footer_mobile {
    display: none;
  }

  @media screen and (max-width: 1200px) {
    .custom-overlay {
      .el-overlay {
        padding: 20px !important;
      }
    }
    .list-wrap {
      li {
        .asset-base-info {
          //width: 2rem;
        }
        .el-checkbox {
          margin-right: 0;
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .title-slot {
      span {
        font-size: 14px;
        &:first-child {
          font-size: 18px;
        }
      }
    }
    .el-input {
      .el-input__inner {
        border-radius: 10px;
        line-height: 36px;
        height: 36px;
      }
      margin-bottom: 15px;
    }
    .list-wrap {
      li {
        height: 50px;
        padding: 9px 0;
        /* border-bottom: 1px solid #dfe4ef; */
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          margin-right: 15px;
        }
        .asset-base-info {
          div {
            font-size: 16px;
          }
          span {
            font-size: 13px;
          }
        }
        .el-checkbox {
          .el-checkbox__inner {
            width: 16px;
            height: 16px;
            &::after {
              height: 10px;
              left: 5px;
              top: 0;
              width: 4px;
            }
          }
        }
      }
    }
    .footer-wrap {
      padding-top: 20px;
      text-align: center;
      .el-button {
        width: 110px;
        height: 36px;
        & + .el-button {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
