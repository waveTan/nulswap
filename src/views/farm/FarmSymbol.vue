<template>
  <div class="farm-item-symbol">
    <div class="mult-img-wrap" v-if="props.logo2">
      <symbol-icon :icon="props.logo1"></symbol-icon>
      <symbol-icon :icon="props.logo2"></symbol-icon>
    </div>
    <div class="img-wrap" v-else>
      <symbol-icon :icon="props.logo1"></symbol-icon>
    </div>
    <div class="name">{{ props.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import SymbolIcon from '@/components/SymbolIcon.vue';

const props = defineProps({
  logo1: String,
  logo2: String,
  name: String
});
</script>

<style lang="scss">
.farm-item-symbol {
  width: 265px;
  height: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  .mult-img-wrap,
  .img-wrap {
    width: 65px;
    height: 100%;
    margin-right: 10px;
    flex-shrink: 0;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .mult-img-wrap {
    position: relative;
    img {
      position: absolute;
      &:first-child {
        bottom: 0;
        right: 0;
        z-index: 2;
      }
      &:last-child {
        top: 0;
        left: 0;
      }
    }
  }
  .img-wrap {
    display: flex;
    align-items: center;
  }
  .name {
    font-size: 20px;
    //font-weight: bold;
  }
}
</style>
