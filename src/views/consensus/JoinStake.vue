<template>
  <el-dialog
    custom-class="join-staking-dialog"
    :title="$t('staking.staking1')"
    v-model="visible"
    :show-close="false"
    width="500px"
    @closed="resetState"
  >
    <div v-loading="loading">
      <el-form
        ref="joinFormRef"
        label-position="top"
        :model="joinStakingModel"
        :rules="joinStakingRule"
      >
        <el-form-item :label="$t('staking.staking4') + ': '" prop="currency">
          <el-select
            v-model="joinStakingModel.currency"
            @change="changeCurrency"
            :placeholder="$t('staking.staking56')"
          >
            <el-option
              v-for="(item, index) in canStakingList"
              :key="index"
              :label="item.symbol"
              :value="item.assetKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('staking.staking17') + ': '" prop="deadline">
          <el-select
            v-model="joinStakingModel.deadline"
            @change="projectedRevenue"
          >
            <el-option
              v-for="item in deadlineList"
              :disabled="isStableCurrency && item.value !== 0"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="fr font12">
          {{ $t('public.public12') }}:
          {{ currentCurrency.available }}
        </div>
        <el-form-item
          :label="$t('staking.staking16') + ': '"
          prop="amount"
          class="append-input"
        >
          <el-input v-model="joinStakingModel.amount">
            <template #append>
              <span
                class="click"
                @click="joinStakingModel.amount = currentCurrency.available"
              >
                MAX
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('staking.staking29') + ': '"
          class="revenue-item"
        >
          <span class="estimate">
            {{ revenue }} NVT
            <span class="font12" v-show="joinStakingModel.deadline === 0">
              ({{ $t('staking.staking51') }})
            </span>
          </span>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="visible = false">
          {{ $t('public.public8') }}
        </el-button>
        <el-button type="primary" @click="joinStaking">
          {{ $t('public.public9') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Division, fixNumber, Minus, Times, timesDecimals } from '@/utils/util';
import { ElForm } from 'element-plus';
import useStoreState from '@/hooks/useStoreState';
import { useToast } from 'vue-toastification';
import useBroadcastNerveHex from '@/hooks/useBroadcastNerveHex';
import { CanStakingListItem } from './types';

const props = defineProps<{
  address?: string;
  show: boolean;
  canStakingList: CanStakingListItem[];
}>();

const emit = defineEmits(['update:show', 'refresh']);

const { t } = useI18n();
const toast = useToast();
const { handleTxInfo } = useBroadcastNerveHex();
const { assetsList } = useStoreState();

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});

const validateJoinCurrency = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('staking.staking26')));
  } else {
    if (joinStakingModel.amount !== '') {
      joinFormRef.value?.validateField('amount', () => {});
      projectedRevenue();
    }
    callback();
  }
};
const validateJoinAmount = async (rule: any, value: any, callback: any) => {
  const baseNumber = 1000;
  const currencyNumber = Division(baseNumber, nvtPrice).toFixed();
  const maxAvailable = currentCurrency.value.available;
  const decimals = currentCurrency.value.decimals; //8;
  const reg = new RegExp(
    '^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$'
  );
  projectedRevenue();
  if (value === '') {
    callback(new Error(t('staking.staking27')));
  } else if (!reg.exec(value)) {
    callback(new Error(t('transfer.transfer17') + ': ' + decimals));
    // @ts-ignore
  } else if (Minus(value, currencyNumber).toFixed() < 0) {
    callback(
      new Error(
        t('staking.staking49') + currencyNumber + currentCurrency.value.symbol
      )
    );
  } else if (!Number(currentCurrency.value.available)) {
    callback(new Error(t('staking.staking55')));
    // @ts-ignore
  } else if (Minus(value, maxAvailable).toFixed() > 0) {
    callback(
      new Error(
        t('staking.staking50') + maxAvailable + currentCurrency.value.symbol
      )
    );
  } else {
    callback();
  }
};
const validateJoinDeadline = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('staking.staking28')));
  } else {
    callback();
  }
};
const joinFormRef = ref<InstanceType<typeof ElForm>>();
const joinStakingModel = reactive({
  currency: '',
  amount: '',
  deadline: 0
});
const joinStakingRule = {
  currency: [{ validator: validateJoinCurrency, trigger: ['blur', 'change'] }],
  amount: [{ validator: validateJoinAmount, trigger: ['blur', 'change'] }],
  deadline: [{ validator: validateJoinDeadline, trigger: ['blur'] }]
};

const defaultCurrency = assetsList.value.filter(v => v.symbol === 'NVT')[0];

// 当前选择的资产
// const currentCurrency = ref(defaultCurrency);

const currentCurrency = computed(() => {
  if (defaultCurrency || joinStakingModel.currency) {
    const assetKey = joinStakingModel.currency || defaultCurrency.assetKey;
    return assetsList.value.filter(v => v.assetKey === assetKey)[0];
  } else {
    return { available: 0, symbol: '', decimals: 8, chainId: '', assetId: '' };
  }
});

if (defaultCurrency) {
  joinStakingModel.currency = defaultCurrency.assetKey;
  joinStakingModel.deadline = 0;
  changeCurrency();
}

const deadlineList = computed(() => {
  return [
    { label: t('staking.staking5'), value: 0 },
    { label: t('staking.staking6'), value: 1 },
    { label: t('staking.staking7'), value: 2 },
    { label: t('staking.staking8'), value: 3 },
    { label: t('staking.staking9'), value: 4 },
    { label: t('staking.staking10'), value: 5 },
    { label: t('staking.staking11'), value: 6 },
    { label: t('staking.staking12'), value: 7 }
  ];
});

// 是否是稳定币资产
const isStableCurrency = computed(() => {
  const currency = joinStakingModel.currency;
  return !!props.canStakingList.filter(v => {
    return v.assetKey === currency && !v.canBePeriodically;
  }).length;
});

// 选择资产的收益率信息
const rateInfo = computed<CanStakingListItem | null>(() => {
  const symbol = currentCurrency.value.symbol;
  if (symbol && props.canStakingList.length) {
    return props.canStakingList.find(v => v.symbol === symbol) || null;
  }
  return null;
});

let nvtPrice = 1;
watch(
  () => rateInfo.value,
  val => {
    if (val && val.rate) {
      nvtPrice = val.nvtPrice;
      if (!val.canBePeriodically) {
        joinStakingModel.deadline = 0;
      }
    }
  }
);

//选择币种下拉
function changeCurrency() {
  nextTick(projectedRevenue);
}

// 预估收益值
const revenue = ref('0');

// 估算收益
function projectedRevenue() {
  let rateValue = '';
  const rate = rateInfo.value?.rate;
  if (!rate) {
    return 0;
  }
  if (joinStakingModel.deadline === 0) {
    //年化/365*30
    let everyDay = Division(rate.NONE, 365);
    rateValue = Times(everyDay, 30).toFixed();
  } else if (joinStakingModel.deadline === 1) {
    rateValue = rate.THREE_MONTHS;
  } else if (joinStakingModel.deadline === 2) {
    rateValue = rate.HALF_YEAR;
  } else if (joinStakingModel.deadline === 3) {
    rateValue = rate.ONE_YEAR;
  } else if (joinStakingModel.deadline === 4) {
    rateValue = rate.TOW_YEARS;
  } else if (joinStakingModel.deadline === 5) {
    rateValue = rate.THREE_YEARS;
  } else if (joinStakingModel.deadline === 6) {
    rateValue = rate.FIVE_YEARS;
  } else if (joinStakingModel.deadline === 7) {
    rateValue = rate.TEN_YEARS;
  } else {
    rateValue = rate.TEST;
  }

  if (joinStakingModel.deadline.toString() && joinStakingModel.amount) {
    const rewardNumber = Times(rateValue, joinStakingModel.amount);
    // console.log(rateInfo.value, 111, rewardNumber, rateValue);
    // console.log(Times(rewardNumber, rateInfo.value.nvtPrice).toFixed(), 123465);
    const nvtPrice = rateInfo.value?.nvtPrice as number;
    revenue.value = fixNumber(Times(rewardNumber, nvtPrice).toFixed(), 3);
  } else {
    revenue.value = '0';
  }
}

const loading = ref(false);

function joinStaking() {
  // console.log(currentCurrency.value, 465)
  joinFormRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        const { chainId, assetId, decimals } = currentCurrency.value;
        const amount = timesDecimals(joinStakingModel.amount, decimals),
          depositType = joinStakingModel.deadline === 0 ? 0 : 1, // 委托类型
          timeType = joinStakingModel.deadline
            ? joinStakingModel.deadline - 1
            : 0; // 委托时长
        const transferInfo = {
          from: props.address,
          assetsChainId: chainId,
          assetsId: assetId,
          amount: amount,
          fee: 0
        };
        const txData = {
          address: props.address,
          deposit: amount,
          assetsChainId: chainId, // 链ID
          assetsId: assetId, // 资产ID
          depositType: depositType, // 委托类型
          timeType: timeType //委托时长
        };
        const result: any = await handleTxInfo(transferInfo, 5, txData);
        if (result && result.hash) {
          emit('refresh');
          visible.value = false;
        }
      } catch (e) {
        console.log(e, 'join-error');
        toast.error(e.message || e);
      }
      loading.value = false;
    }
  });
}
function resetState() {
  loading.value = false;
  joinFormRef.value?.resetFields();
}
</script>

<style lang="scss">
.join-staking-dialog,
.change-staking-dialog {
  .el-dialog__body {
    padding-bottom: 0;
  }

  .revenue-item {
    .el-form-item__label {
      color: #475472;
    }
    .el-form-item__content {
      line-height: 1;
      .font12 {
        color: #8794b1;
      }
    }
  }

  .el-form-item__content {
    .el-select {
      width: 100%;

      .el-input__inner {
        width: 100%;
      }
    }

    .estimate {
      color: #606266;
    }

    .currency-label {
      color: #606266;
      margin-bottom: 10px;
    }

    .el-input-group__append {
      background-color: transparent;

      span {
        color: #608fff;
      }
    }
  }

  @media screen and (max-width: 1200px) {
    .el-form-item__content {
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
