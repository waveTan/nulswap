<template>
  <ElConfigProvider :locale="localeLang">
    <Header />
    <div id="inner_content" class="inner_content">
      <div class="w1200">
        <router-view></router-view>
      </div>

    </div>
    <Footer />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElConfigProvider } from 'element-plus';
import Header from '@/components/Header/index.vue';
import Footer from '@/components/Footer.vue';
import useLang from '@/hooks/useLang';
import nerve from 'nerve-sdk-js';
import config from '@/config';
import { getBlockInfo, getNVTPrice } from '@/service/api';
// 设置sdk网络
nerve.customnet(config.chainId, config.API_URL, config.timeout);

const store = useStore();
const { localeLang } = useLang();

let timer: number;
const nerveAddress = computed(() => store.getters.nerveAddress);
// 统一获取资产列表
watch(
  nerveAddress,
  val => {
    if (val) {
      store.dispatch('getAssetList', val);
      if (timer) clearInterval(timer);
      timer = window.setInterval(() => {
        store.dispatch('getAssetList', val);
      }, 5000);
    } else {
      store.commit('setAssetList', []);
    }
  },
  {
    immediate: true
  }
);
onMounted(() => {
  getNvtPrice();
  getHeight();
  setInterval(() => {
    getHeight();
  }, 2000);
  setInterval(() => {
    getNvtPrice();
  }, 5000);
});
// 获取nvt价格
async function getNvtPrice() {
  const result = await getNVTPrice(config.chainId, config.assetId);
  store.commit('changeNVTPrice', result?.usdPrice || '0');
}
// 获取高度
async function getHeight() {
  const result = await getBlockInfo();
  store.commit('changeHeight', result?.blockHeight || null);
}
</script>

<style lang="scss">
@import 'assets/css/base.scss';

#app {
  width: 100%;
  min-height: 100%;
  //word-break: break-all;
}

.inner_content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
  padding-bottom: 30px;
  @media screen and (max-width: 1200px) {
    padding-top: 30px;
    min-height: calc(100vh - 30px);
  }
}

.Vue-Toastification__container.top-right {
  top: 80px !important;
  @media only screen and (max-width: 600px) {
    top: 60px !important;
    width: 96%;
    left: 2%;
    .Vue-Toastification__toast {
      padding: 0 24px;
      align-items: center;
      min-height: 54px;
      border-radius: 10px;
    }
  }
}
</style>
