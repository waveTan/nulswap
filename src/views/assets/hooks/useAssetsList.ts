import { ref, watch } from 'vue';
import useStoreState from '@/hooks/useStoreState';
import { AssetItemType } from '../types';
import { Minus } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import { Account } from '@/store/types';
import storage from '@/utils/storage';
import { useStore } from '@/store';
import config from '@/config';

export default function useAssetsList() {
  const store = useStore();
  const loading = ref(false);
  let loaded = false;
  const searchVal = ref('');
  const hideSmall = ref(false);
  const allAssetsList = ref<AssetItemType[]>([]); // L2 所有资产
  const selectAssets = ref<AssetItemType[]>([]); // 已勾选显示的资产
  const filteredAssets = ref<AssetItemType[]>([]); // 已勾选并且已筛选的资产
  const crossInOutSymbol = ref<AssetItemType[]>([]); // 支持的L1-L2间跨链的资产
  let sortDataByValue: AssetItemType[] = [];
  // const tableData = ref<AssetItemType[]>([]); // 支持的L1-L2间跨链的资产
  const { assetsList, currentAccount, chain: network } = useStoreState();

  hideSmall.value = !!currentAccount.value.hideSmall;

  watch(
    () => assetsList.value,
    val => {
      if (val && val.length) {
        getList(val);
      } else {
        getList([]);
      }
    },
    {
      immediate: true
    }
  );

  watch(
    () => [searchVal.value, hideSmall.value],
    ([searchVal, hideSmall]) => {
      console.log(searchVal, hideSmall, 888);
      // @ts-ignore
      changeHide(hideSmall);
      filterAssets();
    }
  );

  function getList(list: AssetItemType[]) {
    loading.value = !loaded;
    list.map(v => {
      const exist = allAssetsList.value.find(
        item => v.assetKey === item.assetKey
      );
      v.showDetail = exist ? exist.showDetail : false;
    });
    sortDataByValue = [...list].sort((a, b) => {
      return Minus(a.valuation, b.valuation).toNumber() > 0 ? -1 : 1;
    });
    crossInOutSymbol.value = [...list].filter(item => {
      if (!item.heterogeneousList) {
        return false;
      } else {
        let supportedChain = false;
        item.heterogeneousList.map(v => {
          Object.keys(_networkInfo).map(key => {
            if (
              _networkInfo[key].chainId === v.heterogeneousChainId &&
              key === network.value
            ) {
              supportedChain = true;
            }
          });
        });
        return supportedChain;
      }
    });
    allAssetsList.value = list;
    filterAssets();
    loaded = true;
    loading.value = false;
  }

  // 过滤出table展示的资产列表
  function filterAssets() {
    let result: AssetItemType[] = [];
    const focusAssets = currentAccount.value.focusAssets;
    if (focusAssets && focusAssets.length) {
      sortDataByValue.map(v =>
        currentAccount.value.focusAssets?.map((item: string) => {
          if (item === v.assetKey) {
            result.push(v);
          }
        })
      );
    } else {
      result = sortDataByValue.filter(v => {
        return Number(v.available) > 0;
      });
      // 账户资产全都没有余额，默认显示nvt
      if (!result.length) {
        result = sortDataByValue.filter(v => {
          return v.chainId === config.chainId && v.assetId === config.assetId;
        });
      }
    }
    selectAssets.value = [...result];
    result = result
      .filter(v => {
        return hideSmall.value ? Number(v.valuation) > 10 : true;
      })
      .filter(v => {
        return (
          v.assetKey.indexOf(searchVal.value) > -1 ||
          v.symbol.toUpperCase().indexOf(searchVal.value.toUpperCase()) > -1
        );
      });
    filteredAssets.value = [...result];
  }

  function changeHide(isHide: boolean) {
    console.log(isHide, currentAccount.value.hideSmall, '--===hide---');
    if (currentAccount.value.hideSmall === isHide) return;
    const accountList: Account[] = storage.get('accountList') || [];
    accountList.map(v => {
      if (v.pub === currentAccount.value.pub) {
        v.hideSmall = isHide;
      }
    });
    storage.set('accountList', accountList);

    currentAccount.value.hideSmall = isHide;
    store.commit('setCurrentAddress', currentAccount);
  }

  // 添加资产
  function addAssets(assets: string[]) {
    currentAccount.value.focusAssets = assets;
    const accountList: Account[] = storage.get('accountList') || [];
    accountList.map(v => {
      if (v.pub === currentAccount.value.pub) {
        v.focusAssets = assets;
      }
    });
    storage.set('accountList', accountList);

    store.commit('setCurrentAddress', currentAccount);
    filterAssets();
  }

  // 展开、收起资产详情
  function assetClick(item: AssetItemType) {
    for (let asset of selectAssets.value) {
      if (item.assetKey === asset.assetKey) {
        item.showDetail = !item.showDetail;
      } else {
        asset.showDetail = false;
      }
    }
  }

  return {
    loading,
    searchVal,
    hideSmall,
    allAssetsList,
    selectAssets,
    filteredAssets,
    crossInOutSymbol,
    filterAssets,
    addAssets,
    assetClick
  };
}
