<template>
  <div class="home w1200">
    <Description />
    <LinkWrapper />
    <DataInfo />
    <SupportChains />
    <Partner />
  </div>
</template>

<script lang="ts" setup>
import Description from './Description.vue';
import LinkWrapper from './LinkWrapper.vue';
import DataInfo from './DataInfo.vue';
import SupportChains from './SupportChains.vue';
import Partner from './Partner.vue';
</script>

<style lang="scss">
.home {
  @media screen and (max-width: 1200px) {
    padding: 0 16px;
  }
}
</style>
