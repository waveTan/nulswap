<template>
  <div class="pools-table">
    <Table
      v-bind="props"
      :columns="columns"
      @rowClick="rowClick"
      @pageChange="pageChange"
    >
      <template #name="scope">
        <div class="symbol-wrap flex-center">
          <LiquiditySymbols
            :symbol1="scope.row.token0Symbol"
            :symbol2="scope.row.token1Symbol"
            :asset-key1="scope.row.token0"
            :asset-key2="scope.row.token1"
          ></LiquiditySymbols>
        </div>
      </template>
      <template #tx_24="scope">${{ $format(scope.row.tx_24) }}</template>
      <template #tx_7d="scope">${{ $format(scope.row.tx_7d) }}</template>
      <template #lp_24="scope">${{ $format(scope.row.lp_24) }}</template>
      <template #apr="scope">{{ scope.row.apr }}%</template>
      <template #liq="scope">${{ $format(scope.row.liq) }}</template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue';
import Table from '@/components/Table/index.vue';
import LiquiditySymbols from '@/components/LiquiditySymbols.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { PoolItem } from '../types';

const props = withDefaults(
  defineProps<{
    title: string;
    data: PoolItem[];
    total: number | string;
    pageIndex?: number;
    pagination?: boolean;
    pageSize?: number | string;
  }>(),
  {
    pagination: true
  }
);
const emit = defineEmits(['pageChange', 'rowClick']);

const { t } = useI18n();
const router = useRouter();

const columns = computed(() => {
  return [
    { width: 40 },
    {
      prop: 'name',
      label: t('info.info2'),
      slotName: 'name',
      'min-width': 140
    },
    { prop: 'tx_24', label: t('info.info11'), width: 180, slotName: 'tx_24' },
    { prop: 'tx_7d', label: t('info.info12'), width: 180, slotName: 'tx_7d' },
    { prop: 'lp_24', label: t('info.info13'), width: 180, slotName: 'lp_24' },
    { prop: 'apr', label: t('info.info14'), width: 180, slotName: 'apr' },
    { prop: 'liq', label: t('info.info4'), width: 180, slotName: 'liq' }
  ];
});
function rowClick(item: PoolItem) {
  // console.log(item);
  // emit('rowClick', item);
  router.push('/info/pools/' + item.address);
}
function pageChange(index: number) {
  // console.log(index);
  emit('pageChange', index);
}
</script>

<style lang="scss">
.pools-table {
  tr.el-table__row {
    cursor: pointer;
  }
  .symbol-wrap {
    img {
      width: 30px;
      height: 30px;
      background-color: #fff;
    }
    img:last-of-type {
      margin-left: -10px;
      margin-right: 8px;
    }
  }
}
</style>
