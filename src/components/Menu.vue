<template>
  <div class="horizon-menu" @click.stop="">
    <template v-for="item in menus" :key="item.key">
      <div
        class="menu-item"
        :class="{ active: activeMenu === item.key, disable: item.disable }"
        @click="emit('clickMenu')"
      >
        <a v-if="item.url" :href="item.url" target="_blank">{{ item.label }}</a>
        <router-link v-else :to="'/' + item.key">
          {{ item.label }}
        </router-link>
      </div>
    </template>
    <div class="lang-warp mobile" @click="changeLang">
      <img src="../assets/img/lang.svg" alt="" />
      {{ lang }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { isBeta } from '@/utils/util';
import useLang from '@/hooks/useLang';

const emit = defineEmits(['clickMenu']);

const { t } = useI18n();

const route = useRoute();

const activeMenu = computed(() => {
  const path = route.path;
  return path.split('/')[1] || 'home';
});

const menus = computed(() => {
  return [
    {
      label: t('info.info1'),
      key: 'home',
      needAuth: true
    },
    {
      label: t('info.info2'),
      key: 'pools',
      needAuth: true
    },
    {
      label: t('info.info3'),
      key: 'tokens',
      needAuth: true
    },
  ];
});

const { lang, switchLang } = useLang();
function changeLang() {
  switchLang();
  emit('clickMenu');
}
</script>

<style lang="scss">
.horizon-menu {
  display: flex;

  .menu-item {
    padding: 18px 0;
    a {
      display: inline-block;
      height: 44px;
      line-height: 44px;
      padding: 0 20px;
      color: #475472;
      //font-size: 18px;
      &:hover,
      &:focus,
      &:active {
        color: #32e08d;
        //background-color: #387cf4;
      }
    }

    &.active a {
      color: #fff;
      background-color: #32e08d;
      border-radius: 20px;
    }
    &.disable {
      cursor: not-allowed;
      a {
        pointer-events: none;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    position: absolute;
    z-index: 100;
    right: 0;
    width: 150px;
    height: 100%;
    background: #fff;
    flex-direction: column;
    padding-top: 20px;
    .menu-item {
      padding: 0;
      a {
        height: 48px;
        line-height: 48px;
      }

      &.active a {
        color: #32e08d;
        background-color: #fff;
        border-radius: 0;
      }
    }
    .lang-warp {
      position: absolute;
      bottom: 20px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      img {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
}
</style>
