<template>
  <div class="key-info flex-between">
    <div class="left flex-center">
      <div class="symbol-wrap flex-center" v-if="props.isPool">
        <SymbolIcon :icon="symbols[1]" :asset-key="assetKeys[1]"></SymbolIcon>
        <SymbolIcon :icon="symbols[0]" :asset-key="assetKeys[0]"></SymbolIcon>
      </div>
      <div class="symbol-wrap" v-else>
        <SymbolIcon :icon="props.info.name" :asset-key="props.info.assetKey" />
      </div>
      <div class="symbol-info">
        <p class="name fw">
          <template v-if="props.isPool">
            <span class="link" @click="toAsset(assetKeys[0])">
              {{ symbols[0] }}
            </span>
            /
            <span class="link" @click="toAsset(assetKeys[1])">
              {{ symbols[1] }}
            </span>
          </template>
          <template v-else>{{ props.info.name }}</template>
<!--          {{ props.isPool ? symbols[0] + '/' + symbols[1] : props.info.name }}-->
        </p>
        <p class="key">
          ID: {{ props.info.assetKey || props.info.tokenLP }}
          <span v-if="!props.isPool" style="color: #475472; font-size: 16px">
            ${{ props.info.price }}
          </span>
        </p>
      </div>
    </div>
    <CollectIcon v-model="isCollected" @change="change" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useCollect from '../hooks/useCollect';
import SymbolIcon from '@/components/SymbolIcon.vue';
import CollectIcon from '@/components/CollectIcon.vue';
import { useStore } from '@/store';
import { sortAssetsByValuation } from '@/utils/util';

const props = defineProps<{
  info: any;
  isPool?: boolean;
}>();

const router = useRouter();
const store = useStore();
const { changeCollect } = useCollect();
console.log(props.info, 881222222);
const symbols = computed(() => {
  const { token0Symbol, token1Symbol } = props.info;
  console.log(props.info, 881222222);
  if (!token0Symbol) return ['', ''];
  if (!token1Symbol) return [token0Symbol, ''];
  return sortAssetsByValuation(token0Symbol, token1Symbol);
});

const assetKeys = computed(() => {
  if (!props.isPool) return [];
  const { token0Symbol, token1Symbol, token0, token1 } = props.info;
  if (symbols.value[0] === token0Symbol && symbols.value[1] === token1Symbol) {
    return [token0, token1];
  } else {
    return [token1, token0];
  }
});

watch(
  () => props.info,
  val => {
    checkIsCollected(val);
  }
);
const isCollected = ref(false);
function checkIsCollected(info: any) {
  let flag = false;
  if (props.isPool) {
    const watchPools = store.state.watchPools;
    flag = watchPools.indexOf(info.address) > -1;
  } else {
    const watchTokens = store.state.watchTokens;
    flag = watchTokens.indexOf(info.assetKey) > -1;
  }
  isCollected.value = flag;
}

function change(status: boolean) {
  // console.log(status);
  const type = props.isPool ? 'pool' : 'token';
  const value = props.isPool ? props.info.address : props.info.assetKey;
  changeCollect(value, status, type);
}

function toAsset(key: string) {
  router.push('/info/tokens/' + key);
}
</script>

<style lang="scss">
.key-info {
  .symbol-wrap {
    margin-right: 10px;
    img {
      width: 42px;
      height: 42px;
      background-color: #fff;
    }
    img:nth-child(2) {
      margin-left: -10px;
    }
  }
  .symbol-info {
    .name {
      font-size: 20px;
    }
    .key {
      color: #94a6ce;
      font-size: 14px;
    }
  }
  .collect {
    cursor: pointer;
  }
  @media screen and (max-width: 1200px) {
    .symbol-wrap {
      img {
        width: 35px;
        height: 35px;
      }
    }
    .symbol-info {
      .name {
        font-size: 18px;
      }
      .key {
        font-size: 14px;
      }
    }
  }
}
</style>
