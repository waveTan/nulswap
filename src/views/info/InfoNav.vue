<template>
  <div class="info-nav">
    <div class="nav-route">
      <template v-for="item in routeConfig" :key="item.path">
        <router-link
          :class="{ active: item.path === activePath }"
          :to="item.path"
        >
          {{ item.label }}
        </router-link>
      </template>
    </div>

    <InfoSearch />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import InfoSearch from './InfoSearch.vue';

const { t } = useI18n();
const route = useRoute();

const routeConfig = computed(() => {
  return [
    { label: t('info.info1'), path: '/info', key: 'info' },
    { label: t('info.info2'), path: '/info/pools', key: 'pools' },
    { label: t('info.info3'), path: '/info/tokens', key: 'tokens' },
    {
      label: t('info.info35'),
      path: '/info/multi-routing',
      key: 'multiRouting'
    }
  ];
});

const activePath = computed(() => {
  return route.path;
  // console.log(path);
  // const pathArr = path.split('/');
  // return pathArr[pathArr.length - 1];
});
</script>

<style lang="scss">
.info-nav {
  position: relative;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  a {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    margin-right: 40px;
    color: #475472;
    &.active {
      color: #2688f7;
      border-bottom: 3px solid #2688f7;
    }
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #dfe4ef;
    z-index: -1;
  }
  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    .nav-route {
      margin-bottom: 20px;
    }
    .info-search .search-content .el-input .el-input__inner {
      border-radius: 15px;
    }
  }
}
</style>
