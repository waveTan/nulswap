<template>
  <el-dialog
    :title="$t('public.public6')"
    custom-class="account-manage"
    :show-close="false"
    v-model="visible"
    :append-to-body="true"
  >
    <div v-loading="showLoading">
      <div class="content">
        <div class="top">
          <p>
            <span class="pc">{{ superLong(address, 8) }}</span>
            <span class="mobile">{{ superLong(address, 7) }}</span>
          </p>
          <p>
            <span @click="copy(address)">
              <i class="iconfont icon-fuzhi"></i>
            </span>
            <span @click="openExplorer('address', address)">
              <i class="iconfont icon-tiaozhuanlianjie"></i>
            </span>
          </p>
        </div>
        <div class="bottom tc">
          <el-button type="primary" @click="emit('disconnect')">
            {{ $t('public.public7') }}
          </el-button>
        </div>
      </div>
      <div class="txs">
        <!--      <p>{{ $t('public.public23') }}</p>-->
        <template v-if="newList.length">
          <div v-for="item in newList" :key="item.hash">
            <div class="tx-item flex">
              <span class="hash link" @click="openUrl(item)">
                {{ superLong(item.hash, 5) }}
              </span>
              <span class="create-time">{{ formatTime(item.time) }}</span>
              <span class="status">
                <span
                  class="iconfont icon-chenggong"
                  v-if="item.status === 1"
                  style="color: #94a6ce"
                ></span>
                <span
                  v-else-if="item.type === 43"
                  class="link flex-center"
                  @click="showAdditionFee(item.hash, item.expand)"
                >
                  {{ $t('transfer.transfer31') }}
                  <el-icon color="#2688F7" class="is-loading">
                    <loading />
                  </el-icon>
                </span>
                <el-icon color="#2688F7" class="is-loading" v-else>
                  <loading />
                </el-icon>
              </span>
            </div>
            <template v-if="item.type === 43 && !item.status">
              <AdditionFee
                v-if="item.expand"
                :tx-info="activeTx"
                @cancel="showAdditionFee('', true)"
                @confirm="additionFee"
              />
            </template>
          </div>
        </template>
        <p v-else class="no-data">{{ $t('public.public19') }}</p>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import AdditionFee from './AdditionFee.vue';
import {
  superLong,
  openExplorer,
  openL1Explorer,
  divisionDecimals,
  timesDecimals
} from '@/utils/util';
import useCopy from '@/hooks/useCopy';
import dayjs from 'dayjs';
import { getTx } from '@/service/api';
import useStoreState from '@/hooks/useStoreState';
import useBroadcastNerveHex from '@/hooks/useBroadcastNerveHex';
import _ from 'lodash';
import config from '@/config';
import { TxInfo } from '@/store/types';

const props = defineProps<{
  show: boolean;
  address?: string;
  txList: TxInfo[];
}>();

const emit = defineEmits(['update:show', 'disconnect', 'connect']);

const toast = useToast();
const { copy } = useCopy();

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});

const newList = ref(props.txList);
watch(
  () => props.txList,
  val => {
    const list = _.cloneDeep(val);
    list.map((v: any) => {
      newList.value.map(tx => {
        if (v.hash === tx.hash) {
          v.expand = tx.expand || false;
        }
      });
    });
    newList.value = list;
  }
);
function formatTime(time: number) {
  return dayjs(time).format('MM-DD HH:mm');
}
function openUrl(item: TxInfo) {
  if (item.L1Chain) {
    openL1Explorer(item.L1Chain, 'hash', item.hash);
  } else {
    openExplorer('hash', item.hash);
  }
}

const activeTx: any = ref({});
const { assetsList, nerveAddress } = useStoreState();
let feeCoin: any = {};
function showAdditionFee(hash: string, isExpand: boolean) {
  activeTx.value = {};
  feeCoin = {};
  if (isExpand) {
    newList.value.map(v => (v.expand = false));
    return;
  }
  newList.value.map(v => (v.expand = false));
  newList.value.map(async v => {
    if (v.hash === hash) {
      v.expand = !v.expand;
      const tx = await getTx(hash);
      const txData = tx?.txData;
      if (txData) {
        feeCoin = assetsList.value.find(
          asset =>
            asset.chainId === txData.feeCoin.chainId &&
            asset.assetId === txData.feeCoin.assetId
        )!;
        activeTx.value = {
          fee: divisionDecimals(txData.fee, feeCoin.decimals),
          symbol: feeCoin.symbol,
          hash
        };
      }
    }
  });
}

const showLoading = ref(false);
const { handleTxInfo } = useBroadcastNerveHex();
async function additionFee(amount: string) {
  showLoading.value = true;
  try {
    const transferInfo = {
      from: nerveAddress.value,
      to: config.feeAddress,
      assetsChainId: feeCoin.chainId,
      assetsId: feeCoin.assetId,
      amount: timesDecimals(amount, feeCoin.decimals)
    };
    const result: any = await handleTxInfo(transferInfo, 56, {
      txHash: activeTx.value.hash
    });
    if (result && result.hash) {
      newList.value.map(v => {
        if (v.hash === activeTx.value.hash) {
          v.expand = false;
        }
      });
    }
  } catch (e) {
    console.log(e, 'addition-fee-error');
    toast.error(e.message || e);
  }
  showLoading.value = false;
}
</script>

<style lang="scss">
@import '../../assets/css/style.scss';
.account-manage {
  max-width: 470px;
  .content {
    /* display: ; */
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      span {
        font-size: 24px;
        color: $txColor;
      }
      i {
        color: $linkColor;
        font-size: 32px;
        cursor: pointer;
        margin-left: 20px;
        &.icon-tiaozhuanlianjie {
          font-size: 30px;
        }
      }
    }
    .bottom {
      padding: 30px 0 25px;
      .el-button {
        width: 205px;
        height: 48px;
        border-radius: 15px;
        border: none;
      }
    }
  }
  .txs {
    max-height: 300px;
    overflow: auto;
    padding-top: 15px;
    .no-data {
      padding-top: 8px;
      font-size: 13px;
      color: #909399;
      text-align: center;
    }
    .tx-item {
      align-items: center;
      margin-bottom: 5px;
    }
    .hash {
      width: 32%;
    }
    .create-time {
      width: 30%;
      text-align: center;
    }
    .status {
      width: 38%;
      padding-right: 5px;
      display: flex;
      justify-content: flex-end;
      .is-loading {
        margin-left: 2px;
        transform-origin: center center;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .content .top span {
      font-size: 22px;
      i {
        font-size: 24px;
        &.icon-tiaozhuanlianjie {
          font-size: 22px;
        }
      }
    }
    .content {
      .bottom {
        padding: 20px 0 10px;
        .el-button {
          height: 36px;
        }
      }
    }
  }
}
</style>
