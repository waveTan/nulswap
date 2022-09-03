import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import usePlugins from '@/plugins';
import AddChain from '@/utils/AddChain';
import { getLogoConfig } from '@/utils/logoConfig';
// @ts-ignore
// import VConsole from 'vconsole'
// new VConsole()

/*if (process.env.NODE_ENV !== 'development') {
  window.console.log = () => {};
}*/

AddChain();
getLogoConfig();

setTimeout(() => {
  // 不延迟有时刷新会拿不到ethereum.selectedAddress???
  const app = createApp(App);
  app.use(router).use(store).use(usePlugins).mount('#app');
}, 500);
