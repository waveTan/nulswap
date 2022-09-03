import { App } from 'vue';
import Lazy from './Lazy';

export function useLazyLoad(app: App) {
  const lazy = new Lazy();
  app.directive('lazy', {
    mounted: lazy.add.bind(lazy),
    updated: lazy.update.bind(lazy),
    unmounted: lazy.remove.bind(lazy)
  });
}
