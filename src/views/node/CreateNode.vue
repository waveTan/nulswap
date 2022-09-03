<template>
  <div class="create-node" v-loading="loading">
    <div class="content box_wrapper">
      <h3 class="title">{{ $t('createNode.createNode1') }}</h3>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-position="top"
      >
        <el-form-item :label="$t('createNode.createNode2')">
          <el-input :modelValue="address" disabled></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('createNode.createNode3')"
          prop="rewardAddress"
        >
          <el-input
            v-model.trim="formData.rewardAddress"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('createNode.createNode4')" prop="blockAddress">
          <el-input
            v-model.trim="formData.blockAddress"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('createNode.createNode5') + '(NVT)'"
          prop="amount"
        >
          <template #label>
            <p class="flex-between">
              <span>
                {{ $t('createNode.createNode5') + '(NVT)' }}
              </span>
              <span class="font12">
                {{ $t('public.public12') }}{{ nvtBalance }}
              </span>
            </p>
          </template>
          <el-input v-model.trim="formData.amount"></el-input>
        </el-form-item>
        <!--      <div class="font14">
                <el-tooltip placement="top">
                  <div slot="content">{{$t('transfer.transfer5')}}</div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
                {{$t('public.fee')}}: 0.001 <span class="fCN">{{agentAsset.agentAsset.symbol}}</span>
              </div>-->
        <el-form-item class="form-next">
          <el-button
            type="primary"
            @click="createForm"
            :disabled="isRed"
            v-if="address"
          >
            {{ $t('public.public9') }}
          </el-button>
          <AuthButton v-else />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import AuthButton from '@/components/AuthButton.vue';
import { ElForm } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { timesDecimals, isValidNerveAddress } from '@/utils/util';
import { getPunishList } from '@/service/api';
import config from '@/config';
import useBroadcastNerveHex from '@/hooks/useBroadcastNerveHex';

const props = defineProps<{
  address: string;
  nvtBalance: string;
}>();
const emit = defineEmits(['refresh']);

const { t } = useI18n();
const toast = useToast();
const { handleTxInfo } = useBroadcastNerveHex();

const formRef = ref<InstanceType<typeof ElForm>>();
const formData = reactive({
  rewardAddress: '',
  blockAddress: '',
  amount: ''
});
const checkRewardAddress = (rule: any, value: any, callback: any) => {
  const isValidAddress = isValidNerveAddress(value);
  if (!value) {
    return callback(new Error(t('createNode.createNode6')));
  } else if (!isValidAddress) {
    return callback(new Error(t('createNode.createNode10')));
  } else {
    formData.blockAddress &&
      formRef.value?.validateField('blockAddress', () => {});
    callback();
  }
};
const checkBlockAddress = (rule: any, value: any, callback: any) => {
  const isValidAddress = isValidNerveAddress(value);
  if (!value) {
    return callback(new Error(t('createNode.createNode7')));
  } else if (value === props.address) {
    return callback(new Error(t('createNode.createNode8')));
  } else if (value === formData.rewardAddress) {
    return callback(new Error(t('createNode.createNode11')));
  } else if (!isValidAddress) {
    return callback(new Error(t('createNode.createNode12')));
  } else {
    callback();
  }
};
const checkAmount = (rule: any, value: any, callback: any) => {
  const reg = new RegExp('^([1-9][0-9]*|0)?([.][0-9]{1,8})?$');
  if (!value) {
    return callback(new Error(t('createNode.createNode9')));
  } else if (!reg.exec(value)) {
    callback(new Error(t('createNode.createNode13')));
  } else if (+props.nvtBalance - value < 0) {
    callback(new Error(t('createNode.createNode14')));
  } else if (value < 200000 || value > 10000000000000000) {
    callback(new Error(t('createNode.createNode15')));
  } else {
    callback();
  }
};
const rules = {
  rewardAddress: [
    { validator: checkRewardAddress, trigger: ['blur', 'change'] }
  ],
  blockAddress: [{ validator: checkBlockAddress, trigger: ['blur', 'change'] }],
  amount: [{ validator: checkAmount, trigger: ['blur', 'change'] }]
};

onMounted(() => {
  checkValidAddress();
});

const isRed = ref(false);
async function checkValidAddress() {
  if (!props.address) return;
  const result: any = await getPunishList(props.address);
  isRed.value = result.list.length !== 0;
  if (result.list.length) {
    isRed.value = true;
    toast.warning(t('createNode.createNode16'));
  }
}

const loading = ref(false);
function createForm() {
  formRef.value?.validate(async valid => {
    if (valid) {
      try {
        loading.value = true;
        const { blockAddress, rewardAddress, amount } = formData;
        const transferInfo = {
          from: props.address,
          assetsChainId: config.chainId,
          assetsId: config.assetId,
          amount: timesDecimals(amount, 8),
          fee: 0
        };
        const txData = {
          agentAddress: props.address,
          packingAddress: blockAddress,
          rewardAddress: rewardAddress,
          deposit: timesDecimals(amount, 8)
        };
        const result: any = await handleTxInfo(transferInfo, 4, txData);
        if (result && result.hash) {
          emit('refresh');
        }
      } catch (e) {
        console.log(e, 'create-node-error');
        toast.error(e.message || e);
      }
      loading.value = false;
    }
  });
}
</script>

<style lang="scss">
.create-node {
  //padding: 0 0 50px;
  width: 800px;
  margin: 0 auto;
  h3 {
    text-align: center;
    padding: 30px 0;
    color: #475472;
    font-size: 22px;
    font-weight: 600;
  }

  .el-form {
    width: 600px;
    margin: 0 auto;
  }

  .form-next {
    padding-top: 20px;
    padding-bottom: 20px;
    .el-form-item__content {
      display: flex;
      justify-content: center;
    }
    .el-button {
      width: 68%;
      border-radius: 6px;
    }
    .auth-button {
      width: 68%;
      .el-button {
        width: 100%;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    //padding: 0 0 50px;
    padding: 0 16px;
    width: 100%;
    margin: 0 auto;
    .content {
      padding: 0 16px;
    }
    h3 {
      padding: 18px 0;
      font-size: 20px;
    }

    .el-form {
      width: 100%;
      margin: 0 auto;
    }

    .form-next {
      text-align: center;
      padding-top: 20px;

      .el-button {
        width: 68%;
        border-radius: 6px;
      }
    }
  }
}
</style>
