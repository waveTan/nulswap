<template>
  <el-dialog
    :title="$t('trading.trading11')"
    custom-class="swap-setting"
    :show-close="false"
    width="470px"
    v-model="visible"
    @closed="emit('close')"
  >
    <div class="content">
      <div class="set-item">
        <div class="name">{{ $t('trading.trading12') }}</div>
        <div class="protect flex-center">
          <span
            :class="[
              'number',
              'click',
              slippageTolerance === item ? 'active' : ''
            ]"
            v-for="item in protectSets"
            :key="item"
            @click="chooseSlippageTolerance(item)"
          >
            {{ item }}%
          </span>
          <el-input
            :model-value="customSlippageTolerance"
            @input="handleChange"
          />
          %
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps<{
  show: boolean;
  slippageTolerance: string;
}>();

const emit = defineEmits(['update:show', 'update:slippageTolerance', 'close']);

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});
const protectSets = ['0.5', '1', '3'];
const customSlippageTolerance = ref('');

function chooseSlippageTolerance(val: string) {
  update(val);
  customSlippageTolerance.value = '';
}

function handleChange(val: string) {
  let decimals = 2;
  const patrn = new RegExp(
    '^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,' + decimals + '})?$'
  );
  if (patrn.exec(val) || val === '') {
    if (val === '') {
      customSlippageTolerance.value = '';
    } else if (Number(val) > 100) {
      customSlippageTolerance.value = '100';
    } else {
      customSlippageTolerance.value = val;
    }
    update(customSlippageTolerance.value);
  }
}

function update(val: string) {
  // customSlippageTolerance.value = '';
  emit('update:slippageTolerance', val);
}
</script>

<style lang="scss">
.swap-setting {
  .content {
    .name {
      margin-bottom: 10px;
    }

    .protect {
      .number {
        width: 70px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #4a5ef2;
        background-color: #e3eeff;
        margin-right: 20px;
        border-radius: 15px;

        &.active {
          color: #fff;
          background-color: #4a5ef2;
        }
      }
    }

    .el-input {
      width: 80px;
      margin-right: 3px;

      .el-input__inner {
        border-radius: 10px;
      }
    }

    .bottom {
      padding: 0 0 20px;

      :deep(.el-button) {
        width: 185px;
        height: 48px;
        border-radius: 15px;

        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
