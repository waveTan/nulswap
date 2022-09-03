import { listen } from '@/service/socket/promiseSocket';
import config from '@/config';
import { genId } from '@/utils/util';

const url = config.WS_URL;

export async function getNerveFarm(farmHash?: string) {
  const channel = 'farmList';
  const params = {
    method: channel,
    id: genId(),
    params: {
      farmHash
    }
  };
  return await listen({
    url,
    channel,
    id: params.id,
    params: {
      cmd: true,
      channel: 'cmd:' + JSON.stringify(params)
    }
  });
}
