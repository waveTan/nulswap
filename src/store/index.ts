import { createStore, useStore as useVuexStore } from 'vuex';
import storage from '@/utils/storage';
import { getAssetList } from '@/service/api';
import { Account, State } from '@/store/types';

export default createStore<State>({
  state: {
    addressInfo: {} as Account,
    address: '',
    network: storage.get('network', 'session') || '',
    isWrongChain: false,
    showConnect: false,
    lang: storage.get('lang'),
    assetList: storage.get('assetList', 'session') || [],
    nvtPrice: '',
    height: 0,
    watchTokens: storage.get('watchTokens') || [],
    watchPools: storage.get('watchPools') || []
  },
  getters: {
    nerveAddress(state) {
      return state.addressInfo?.address?.NERVE;
    }
  },
  mutations: {
    setCurrentAddress(state, data) {
      console.log(data, 7777);
      state.addressInfo = data;
    },
    changeAddress(state, data) {
      state.address = data;
    },
    changeNetwork(state, data) {
      state.network = data;
      if (data) {
        storage.set('network', data, 'session');
      } else {
        storage.remove('network', 'session');
      }
    },
    changeIsWrongChain(state, isWrongChain) {
      state.isWrongChain = isWrongChain;
    },
    changeConnectShow(state, data) {
      state.showConnect = data;
    },
    switchLang(state, data) {
      state.lang = data;
      storage.set('lang', data);
    },
    setAssetList(state, list) {
      state.assetList = list;
      storage.set('assetList', list, 'session');
    },
    changeNVTPrice(state, price) {
      state.nvtPrice = price;
    },
    changeHeight(state, height) {
      state.height = height;
    },
    changeWatchTokens(state, tokens) {
      state.watchTokens = tokens;
    },
    changeWatchPools(state, pools) {
      state.watchPools = pools;
    }
  },
  actions: {
    async getAssetList({ commit }, address) {
      if (!address) return;
      const res = await getAssetList(address);
      if (res && res.length) {
        // console.log("====set-asset====")
        commit('setAssetList', res);
      }
    }
    // async setAccount({ state, commit }, account) {
    //   commit("setAccount", account);
    // }
  },
  modules: {}
});

export function useStore() {
  return useVuexStore<State>();
}
