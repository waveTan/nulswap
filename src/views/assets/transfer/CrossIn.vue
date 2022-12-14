<template>
  <div class="cross-in" v-loading="loading">
    <template v-if="isTron && !TRONAddress">
      <el-button type="primary" @click="connectTron" class="connect-tron-btn" style="width: 100%; margin: 25px 0">
        {{ $t('transfer.transfer27') }}
      </el-button>
    </template>
    <template v-else>
      <div class="title">
        {{ 'From ' + father.network }}
        <span class="click" @click="openUrl(L1Address, father.network)">
          {{ superLong(L1Address, 6) }}
          <i class="iconfont icon-tiaozhuanlianjie"></i>
        </span>
      </div>
      <div class="transfer-content">
        <custom-input
          v-model:inputVal="amount"
          :label="$t('public.public11')"
          :icon="transferAsset.symbol"
          :assetList="assetsList"
          :balance="balance"
          :show-amount="false"
          :selectedAsset="transferAsset"
          @selectAsset="selectAsset"
          @max="max"
        ></custom-input>
      </div>
      <div class="confirm-wrap">
        <el-button
          type="primary"
          v-if="!needAuth"
          @click="handleSendTx"
          :disabled="disableTransfer"
        >
          {{
            amountErrorTip ? $t('transfer.transfer15') : $t('transfer.transfer9')
          }}
        </el-button>
        <el-button
          type="primary"
          v-else
          @click="handleApprove"
          :disabled="father.disableTx"
        >
          {{ $t('transfer.transfer13') }}
        </el-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  watch,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue';
import { useToast } from 'vue-toastification';
import CustomInput from '@/components/CustomInput.vue';
import { superLong, Minus } from '@/utils/util';
import { useI18n } from 'vue-i18n';
import useCrossIn from '../hooks/useCrossIn';

import { rootCmpKey, RootComponent, AssetItemType } from '../types';
import { HeterogeneousInfo } from '@/store/types';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import { setAccountTxs } from '@/hooks/useBroadcastNerveHex';

export default defineComponent({
  name: 'crossIn',
  components: {
    CustomInput
  },
  setup() {
    const father = inject(rootCmpKey, {} as RootComponent);
    console.log(father.network, 88777);
    const { t } = useI18n();
    const toast = useToast();

    const isTron = computed(() => {
      return father.network === 'TRON';
    });
    const loading = ref(false);
    const amount = ref('');
    const {
      TRONAddress,
      connect,
      balance,
      getBalance,
      fee,
      getFee,
      needAuth,
      getERC20Allowance,
      approveERC20,
      sendTx
    } = useCrossIn(isTron.value);

    const L1Address = computed(() => {
      return isTron.value ? TRONAddress.value : father.address;
    });

    async function connectTron() {
      try {
        await connect();
      } catch (e) {
        toast.error(e.message || e);
      }
    }

    watch(
      () => TRONAddress.value,
      val => {
        if (val && transferAsset.value && isTron.value) {
          checkAsset(transferAsset.value);
        }
      }
    );

    const amountErrorTip = ref('');
    watch(
      () => amount.value,
      val => {
        if (val) {
          if (
            !balance.value ||
            Minus(balance.value, amount.value).toNumber() < 0
          ) {
            amountErrorTip.value = t('transfer.transfer15');
          } else {
            amountErrorTip.value = '';
          }
        }
      }
    );
    // const { father, loading, amount, balance, amountErrorTip } = useTransfer();
    const disableTransfer = computed(() => {
      return !!(
        !fee.value ||
        !amount.value ||
        !balance.value ||
        amountErrorTip.value ||
        father.disableTx
      );
    });

    const assetsList = ref<AssetItemType[]>([]);
    const transferAsset = ref(father.transferAsset);

    let timer: number;
    onMounted(() => {
      getAssetsList();
      selectAsset(transferAsset.value);
    });
    onBeforeUnmount(() => {
      if (timer) clearInterval(timer);
    });

    function getAssetsList() {
      const chain = _networkInfo[father.network];
      const mainAsset = chain?.mainAsset;
      if (father.disableTx || !chain) return;
      assetsList.value = father.crossInOutSymbol
        .filter(v => {
          return v.heterogeneousList?.filter(item => {
            return item.heterogeneousChainId === chain.chainId;
          });
        })
        .map(item => {
          const tempAddress = item.heterogeneousList?.find(
            v => v.heterogeneousChainId === chain.chainId
          )?.contractAddress;
          return {
            ...item,
            contractAddress: tempAddress
          };
        });
      const tempIndex = assetsList.value.findIndex(
        item => item.symbol === mainAsset
      );
      const tempAsset = assetsList.value[tempIndex];
      // ?????????????????????????????????
      assetsList.value.splice(tempIndex, 1);
      assetsList.value.unshift(tempAsset);
    }

    async function selectAsset(asset: AssetItemType) {
      transferAsset.value = asset;
      // console.log(asset, 789654, this.father);
      if (timer) clearInterval(timer);
      if (father.disableTx) return;
      await checkAsset(asset);
      timer = window.setInterval(() => {
        checkAsset(asset);
      }, 5000);
    }

    let heterogeneousInfo: HeterogeneousInfo;
    // ?????????????????????????????????????????????
    async function checkAsset(asset: AssetItemType) {
      // needAuth.value = false;
      const heterogeneousList = asset.heterogeneousList || [];
      const heterogeneousChainId = _networkInfo[father.network]?.chainId;
      if (!heterogeneousChainId || !L1Address.value) return;
      heterogeneousInfo = heterogeneousList.find(
        v => v.heterogeneousChainId === heterogeneousChainId
      ) as HeterogeneousInfo;
      // console.log(heterogeneousInfo, 123456);
      if (heterogeneousInfo) {
        transferAsset.value = asset;
        if (heterogeneousInfo.isToken) {
          getERC20Allowance(heterogeneousInfo, L1Address.value);
        } else {
          needAuth.value = false;
        }
        await getFee(heterogeneousInfo.isToken);
        getBalance(
          heterogeneousInfo,
          L1Address.value,
          transferAsset.value.decimals
        );
      } else {
        transferAsset.value = {} as AssetItemType;
      }
    }

    function max() {
      if (!balance.value || !Number(balance.value)) {
        amount.value = '0';
        return;
      }
      if (heterogeneousInfo?.isToken) {
        amount.value = balance.value;
      } else {
        if (!fee.value) return;
        amount.value = Minus(balance.value, fee.value).toString();
      }
    }
    async function handleApprove() {
      loading.value = true;
      try {
        const res = await approveERC20(heterogeneousInfo, L1Address.value);
        handleMsg(res, 'approve');
      } catch (e) {
        toast.error(e.message || e);
      }
      loading.value = false;
    }

    async function handleSendTx() {
      loading.value = true;
      try {
        const res = await sendTx(
          heterogeneousInfo,
          father.nerveAddress,
          amount.value,
          L1Address.value,
          transferAsset.value.decimals
        );
        handleMsg(res, 'crossIn');
      } catch (e) {
        console.log(e, 'crossin-transfer-error');
        toast.error(e.message || e);
      }
      loading.value = false;
    }
    function handleMsg(data: any, type: string) {
      if (data.hash) {
        amount.value = '';
        toast.success(t('transfer.transfer14'));
        setAccountTxs(father.currentAccount.pub, {
          hash: data.hash,
          time: new Date().getTime(),
          status: 0,
          L1Chain: father.network,
          L1Type: type
        });
      } else {
        toast.error(data.message || data);
      }
    }
    function openUrl(address: string, network: string) {
      const { origin } = _networkInfo[network];
      window.open(origin + '/address/' + address);
    }

    return {
      father,
      isTron,
      TRONAddress,
      connectTron,
      L1Address,
      loading,
      amount,
      balance,
      fee,
      needAuth,
      amountErrorTip,
      disableTransfer,
      assetsList,
      transferAsset,
      selectAsset,
      superLong,
      max,
      handleApprove,
      handleSendTx,
      openUrl
    };
  }
});
</script>

<style lang="scss" scoped>
@import '../../../assets/css/style.scss';
.cross-in {
  .title {
    font-size: 18px;
    color: $labelColor;
    span {
      color: $linkColor;
    }
  }
  .transfer-content {
    margin: 35px 0 60px;
  }
  .wrong-net {
    margin-top: 10px;
  }
  @media screen and (max-width: 500px) {
    .title {
      font-size: 16px;
    }
    .transfer-content {
      margin: 35px 0 50px;
    }
    .wrong-net {
      margin-top: 10px;
    }
  }
}
</style>
