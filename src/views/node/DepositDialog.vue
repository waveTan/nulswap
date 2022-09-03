<template>
  <el-dialog
    custom-class="node-deposit-dialog"
    :title="
      handleType === HandleType.ADDITION
        ? $t('nodeDetail.nodeDetail14')
        : $t('nodeDetail.nodeDetail13')
    "
    v-model="visible"
    width="500px"
    @closed="resetForm"
  >
    <div v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-position="top"
      >
        <el-form-item prop="amount">
          <template #label>
            <p class="flex-between">
              <span>
                {{
                  handleType === HandleType.ADDITION
                    ? $t('nodeDetail.nodeDetail15')
                    : $t('nodeDetail.nodeDetail16') + ': '
                }}
              </span>
              <span v-if="handleType === HandleType.ADDITION">
                {{ $t('public.public12') }}{{ balance }}
              </span>
            </p>
          </template>
          <el-input v-model="formData.amount"></el-input>
        </el-form-item>
        <!--      <el-form-item :label="$t('public.fee')+': '">
                <span class="fee">0.001 NVT</span>
              </el-form-item>-->
      </el-form>
      <div class="dialog-footer">
        <el-button @click="visible = false">
          {{ $t('public.public8') }}
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t('public.public9') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { ElForm } from 'element-plus';
import { HandleType } from '@/views/node/types';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  show: boolean;
  loading: boolean;
  handleType: HandleType;
  balance: string;
  totalDeposit: string;
}>();

const emit = defineEmits(['update:show', 'submit']);

const { t } = useI18n();

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});

const formRef = ref<InstanceType<typeof ElForm>>();

const formData = reactive({
  amount: ''
});
const checkAmount = (rule: any, value: any, callback: any) => {
  const reg = new RegExp('^([1-9][0-9]*|0)?([.][0-9]{1,8})?$');
  const minAmount = 2000;
  if (props.handleType === HandleType.ADDITION) {
    if (!value) {
      return callback(new Error(t('nodeDetail.nodeDetail17')));
    } else if (!reg.exec(value)) {
      callback(new Error(t('nodeDetail.nodeDetail18')));
    } else if (value - minAmount < 0) {
      return callback(new Error(t('nodeDetail.nodeDetail19')));
    } else if (+props.balance - value < 0) {
      return callback(new Error(t('nodeDetail.nodeDetail20') + props.balance));
    } else {
      callback();
    }
  } else {
    const maxNumber = +props.totalDeposit - 200000;
    if (!value) {
      return callback(new Error(t('nodeDetail.nodeDetail21')));
    } else if (!reg.exec(value)) {
      return callback(new Error(t('nodeDetail.nodeDetail22')));
    } else if (value - minAmount < 0) {
      return callback(new Error(t('nodeDetail.nodeDetail23')));
    } else if (value - maxNumber > 0) {
      return callback(
        new Error(t('nodeDetail.nodeDetail24') + ' ' + maxNumber)
      );
    } else {
      callback();
    }
  }
};
const rules = {
  amount: [{ validator: checkAmount, trigger: ['blur', 'change'] }]
};

// const loading = ref(false);
function handleSubmit() {
  formRef.value?.validate(async valid => {
    if (valid) {
      emit('submit', formData.amount, props.handleType);
    }
  });
}

function resetForm() {
  formRef.value?.resetFields();
}
</script>

<style lang="scss"></style>
