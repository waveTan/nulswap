<template>
  <div class="w1200 info-page">
    <InfoNav />
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import InfoNav from './InfoNav.vue';
/*import { get300DaysData, getTokenList, getTxs } from '@/service/api';
get300DaysData();
getTokenList({});
getTxs({});*/
</script>

<style lang="scss">
.info-page {
  margin-top: -10px;
}
</style>
