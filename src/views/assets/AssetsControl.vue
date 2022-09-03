<template>
  <div class="assets-control">
    <div class="left">
      <el-input
        v-model="inputVal"
        :placeholder="$t('assets.assets8')"
        :suffix-icon="Search"
      ></el-input>
      <el-checkbox v-model="checkboxVal" :label="$t('assets.assets12')" />
    </div>
    <i class="iconfont icon-tianjia" @click="emit('showDialog')"></i>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Search } from '@element-plus/icons-vue';

const props = defineProps<{
  searchVal: string;
  hideSmall: boolean;
}>();

const emit = defineEmits([
  'update:searchVal',
  'update:hideSmall',
  'showDialog'
]);

const inputVal = computed({
  get() {
    return props.searchVal;
  },
  set(val: string) {
    emit('update:searchVal', val);
  }
});
const checkboxVal = computed({
  get() {
    return props.hideSmall;
  },
  set(val: boolean) {
    emit('update:hideSmall', val);
  }
});
</script>

<style lang="scss">
@import '../../assets/css/style.scss';
.assets-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: $txColor;
  margin: 0 0 20px;
  .left {
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 340px;
    margin-right: 30px;
    .el-input__inner {
      border-radius: 20px;
      line-height: 42px;
      height: 42px;
      padding: 0 50px 0 18px;
    }
    .el-input__suffix {
      font-size: 24px;
    }
  }
  .el-checkbox {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
      &:after {
        height: 10px;
        left: 5px;
        top: 1px;
        font-weight: 600;
        width: 5px;
      }
    }
    .el-checkbox__label {
      font-size: 15px;
    }
  }
  .icon-tianjia {
    color: $linkColor;
    font-size: 32px;
    cursor: pointer;
    margin-left: 20px;
  }
  @media screen and (max-width: 1200px) {
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-bottom: 12px;
    .left {
      width: 100%;
    }
    .el-input {
      width: 180px;
      margin-right: 10px;
      .el-input__inner {
        border-radius: 15px;
        line-height: 36px;
        height: 36px;
        padding: 0 45px 0 12px;
      }
      .el-input__suffix {
        font-size: 20px;
      }
    }
    .icon-tianjia {
      font-size: 20px;
      margin-left: 15px;
    }
  }
}
</style>
