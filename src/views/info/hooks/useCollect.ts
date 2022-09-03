import { useStore } from '@/store';
import storage from '@/utils/storage';

export default function useCollect() {
  const store = useStore();
  function changeCollect(key: string, status: boolean, type: 'pool' | 'token') {
    if (type === 'pool') {
      const watchPools = storage.get('watchPools') || [];
      if (status) {
        watchPools.push(key);
      } else {
        const index = watchPools.indexOf(key);
        watchPools.splice(index, 1);
      }
      storage.set('watchPools', watchPools);
      store.commit('changeWatchPools', watchPools);
    } else {
      const watchTokens = storage.get('watchTokens') || [];
      if (status) {
        watchTokens.push(key);
      } else {
        const index = watchTokens.indexOf(key);
        watchTokens.splice(index, 1);
      }
      storage.set('watchTokens', watchTokens);
      store.commit('changeWatchTokens', watchTokens);
    }
  }
  return {
    changeCollect
  };
}
