<template>
  <div class="link-wrapper">
    <LinkCard
      :title="$t('header.header1')"
      :desc="$t('home.home3')"
      :btn-label="$t('home.home5')"
      link="/swap"
      :pic-src="swap"
    />
    <LinkCard
      title="Bridge"
      :desc="$t('home.home4')"
      :btn-label="$t('home.home6')"
      :link="config.bridgeUrl"
      :pic-src="bridge"
    />
  </div>
</template>

<script lang="ts" setup>
import LinkCard from './LinkCard.vue';
import swap from '@/assets/img/swap.svg';
import bridge from '@/assets/img/bridge.svg';
import config from '@/config';
</script>

<style lang="scss">
.link-wrapper {
  display: flex;
  justify-content: space-around;
  margin: 70px 0 80px;
  @media screen and (max-width: 1200px) {
    margin: 40px 0 50px;
    display: block;
  }
}
</style>
