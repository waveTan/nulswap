<template>
  <div class="multi-routing">
    <Table
      :title="$t('info.info32')"
      :data="pairs"
      :total="total"
      :columns="columns"
      @rowClick="rowClick"
      @pageChange="pageChange"
    >
      <template #name="scope">
        <div class="asset-wrap flex-center">
          <SymbolIcon :icon="scope.row.logo" />
          {{ scope.row.name }}
        </div>
      </template>
      <template #tx_24="scope">${{ $format(scope.row.tx_24) }}</template>
      <template #tx_7d="scope">${{ $format(scope.row.tx_7d) }}</template>
      <template #liq="scope">${{ $format(scope.row.liq) }}</template>
      <template #supportChain="scope">
        <div class="chain-list">
          <template v-for="item in scope.row.supportChain" :key="item">
            <SymbolIcon :icon="item" />
          </template>
        </div>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Table from '@/components/Table/index.vue';
import { MultiRoutingItem } from '@/views/info/types';
import { getMultiPairs } from '@/service/api';
import { divisionAndFix } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import config from '@/config';

const { t } = useI18n();
const router = useRouter();

const columns = computed(() => {
  return [
    { width: 30 },
    {
      prop: 'name',
      label: t('info.info36'),
      slotName: 'name',
      width: 210
    },
    { prop: 'lpTokenSymbol', label: t('info.info37'), width: 180 },
    { prop: 'tx_24', label: t('info.info11'), width: 140, slotName: 'tx_24' },
    { prop: 'tx_7d', label: t('info.info12'), width: 140, slotName: 'tx_7d' },
    { prop: 'liq', label: t('info.info4'), width: 140, slotName: 'liq' },
    { prop: 'supportChain', label: t('info.info38'), 'min-width': 180, slotName: 'supportChain' },
  ];
});

onMounted(() => {
  getList();
});

const pairs = ref<MultiRoutingItem[]>([]);
const total = ref(0);
async function getList(pageIndex = 1) {
  const data = { pageIndex };
  const res = await getMultiPairs(data);
  if (res) {
    const list: MultiRoutingItem[] = [];
    res.list.map(v => {
      list.push({
        address: v.pairAddress,
        name: v.name,
        logo: v.logo || v.name,
        lpTokenSymbol: v.lpTokenSymbol,
        assetKey: v.lpTokenChainId + '-' + v.lpTokenAssetId,
        price: v.price,
        tx_24: divisionAndFix(v.amountUsdtValue24H, 18, 2),
        tx_7d: divisionAndFix(v.amountUsdtValue7D, 18, 2),
        liq: divisionAndFix(v.reserveUsdtValue, 18, 2),
        supportChain: v.tokenList.map(v =>
          getChainNameById(v.sourceChainId, v.assetChainId)
        )
      });
    });
    pairs.value = list;
    total.value = res.total;
  }
}

function getChainNameById(sourceChainId: number, assetChainId: number) {
  const chains = Object.values(_networkInfo);
  let chainName = '';
  if (sourceChainId !== 0) {
    chainName = chains.find(v => v.chainId === sourceChainId)!.name;
  } else {
    chainName = config.chainId === assetChainId ? 'NERVE' : 'NULS';
  }
  return chainName;
}

function rowClick(item: MultiRoutingItem) {
  router.push('/info/multi-routing/' + item.address);
}
function pageChange(index: number) {
  // console.log(index);
  getList(index);
}
</script>

<style lang="scss">
.multi-routing {
  .asset-wrap img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
  .chain-list {
    display: flex;
    flex-wrap: wrap;
    img {
      width: 28px;
      height: 28px;
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  tr.el-table__row {
    cursor: pointer;
  }
}
</style>
