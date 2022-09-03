import betaLogos from './beta';
import mainLogos from './main';
import { isBeta } from '@/utils/util';
import storage from '@/utils/storage';
import http from '@/service';

const localConfig = isBeta ? betaLogos : mainLogos;

// const url = 'https://assets.nabox.io/api/image/list';
const url = isBeta
  ? 'https://beta.assets.nabox.io/api/image/list'
  : 'https://assets.nabox.io/api/image/list';
export async function getLogoConfig() {
  const storeConfig = storage.get('logoConfig');
  if (!storeConfig) {
    storage.set('logoConfig', localConfig);
  }
  const result = await http.get({
    url
  });
  if (result) {
    storage.set('logoConfig', result);
  }
}
