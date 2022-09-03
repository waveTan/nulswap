<template>
  <el-dialog
    title="Connect Wallet"
    custom-class="connect-dialog"
    :show-close="false"
    v-model="visible"
    :append-to-body="true"
    @closed="emit('changeShow', false)"
  >
    <div class="list">
      <div
        class="connect-btn"
        v-for="(item, index) in providerList"
        :key="index"
        @click="emit('connect', item.provider)"
      >
        {{ item.name }}
        <img class="fr" :src="item.src" alt="" />
      </div>
      <p class="ledger-tip tc">{{ $t('header.header14') }}</p>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { providerList } from '@/hooks/useEthereum';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['update:show', 'changeShow', 'connect']);

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});
</script>

<style lang="scss">
@import '../../assets/css/style.scss';
.connect-dialog {
  max-width: 470px !important;
  .el-dialog__body {
    padding: 0;
    .list {
      //padding: 0 25px 10px;
      display: flex;
      flex-wrap: wrap;
      .connect-btn {
        width: 48%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-weight: 600;
        padding: 0 15px;
        margin-bottom: 15px;
        border-radius: 15px;
        border: 1px solid #edeef2;
        //background: rgb(239, 244, 245);
        //background: $btnColor;
        cursor: pointer;
        &:hover {
          border-color: $linkColor;
          color: $linkColor;
        }
        &:nth-child(2n + 1) {
          margin-right: 4%;
        }
        img {
          margin-top: 7px;
          width: 35px;
          height: 35px;
        }
      }
      .ledger-tip {
        width: 100%;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .el-dialog__body {
      .list {
        .connect-btn {
          font-size: 13px;
          padding: 0 8px;
          height: 45px;
          line-height: 45px;
          margin-bottom: 10px;
          border-radius: 10px;
          img {
            width: 30px;
            height: 30px;
          }
        }
        .ledger-tip {
          padding-top: 10px;
        }
      }
    }
  }
}
</style>
