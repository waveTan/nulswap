<template>
  <div class="addition-fee">
    <div class="row-item">
      <span class="label" style="margin-bottom: 3px">{{ $t('transfer.transfer32') }}</span>
      <p>{{ props.txInfo.fee }}{{ props.txInfo.symbol }}</p>
    </div>
    <div class="row-item">
      <span class="label">{{ $t('transfer.transfer33') }}</span>
      <p class="addition-input">
        <input type="text" v-model="amount" @input="changeInput" />
        <span>{{ props.txInfo.symbol }}</span>
      </p>
    </div>
    <div class="row-item">
      <span class="label"></span>
      <p>
        <el-button type="text" @click="emit('cancel')">
          {{ $t('public.public8') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button type="text" @click="confirm" :disabled="!amount">
          {{ $t('public.public9') }}
        </el-button>
      </p>
    </div>
    <div class="loading-wrap" v-if="isLoading">
      <el-icon color="#2688F7" class="is-loading" :size="20">
        <loading />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps<{
  txInfo: any;
}>();

const emit = defineEmits(['confirm', 'cancel']);

const { t } = useI18n();
const toast = useToast();

const isLoading = ref(true);
watch(
  () => props.txInfo.hash,
  val => {
    isLoading.value = !val;
  }
);

const amount = ref('');
function changeInput(e: Event) {
  // this.amount = val;
  const decimals = props.txInfo.decimals || 8;
  const target = e.target as HTMLInputElement;
  const val = target.value;
  const reg = new RegExp(
    '^([1-9][\\d]*|0)(\\.[\\d]{0,' +
      decimals +
      '})?$|(^\\.[\\d]{0,' +
      decimals +
      '}$)'
  );

  if (reg.exec(val) || val === '') {
    amount.value = val;
  } else {
    amount.value = val.slice(0, -1);
  }
  return false;
}
async function confirm() {
  if (!amount.value) {
    toast.error(t('transfer.transfer34'));
  } else {
    await emit('confirm', amount.value);
    amount.value = '';
  }
}
</script>

<style lang="scss">
.addition-fee {
  border-top: 1px solid #dfe4ef;
  background-color: #f3f6fd;
  padding: 8px 15px 10px;
  display: flex;
  position: relative;
  .row-item {
    &:first-child {
      width: 32%;
    }
    &:nth-child(2) {
      width: 30%;
    }
    &:last-child {
      width: 38%;
      text-align: right;
    }
    .label {
      font-size: 12px;
      color: #94a6ce;
      //height: 20px;
      //line-height: 20px;
      display: inline-block;
    }
    p {
      font-size: 14px;
      line-height: 24px;
    }
  }
  .addition-input {
    display: flex;
    align-items: center;
    input {
      flex: 1;
      outline: none;
      //width: auto;
      border: 1px solid #dfe4ef;
      background-color: #fff;
      border-radius: 5px;
      width: 88px;
      height: 24px;
      margin-right: 3px;
    }
    span {
      flex-shrink: 0;
    }
  }
  .el-button {
    min-height: auto;
    padding: 0;
    span {
      font-size: 12px;
      color: #2688f7;
    }
  }
  .el-button.is-disabled {
    span {
      color: #c0c4cc;
    }
  }
  .el-divider--vertical {
    height: 10px;
    border-color: #7e879b;
  }
  .loading-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
  }
  @media screen and (max-width: 500px) {
    flex-wrap: wrap;
    .row-item {
      //flex: auto;
      &:first-child {
        width: 50%;
      }
      &:nth-child(2) {
        width: 50%;
      }
      &:last-child {
        width: 100%;
        text-align: center;
        padding-top: 10px;
        .label {
          display: none;
        }
      }
    }
  }
}
</style>
