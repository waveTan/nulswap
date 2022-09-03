<template>
  <Table
    :columns="columns"
    v-bind="props"
    @sortChange="sortChange"
    @pageChange="pageChange"
  >
    <template #type="scope">
      <TxType
        v-if="scope.row.type"
        :type="scope.row.type"
        :hash="scope.row.hash"
        :token0="scope.row.token0"
        :token1="scope.row.token1"
        :is-multi-routing="props.isMultiRouting"
        :from-chain="scope.row.fromChain"
        :to-chain="scope.row.toChain"
      />
    </template>
    <template #totalVal="scope">
      <span>${{ $format(scope.row.totalVal) }}</span>
    </template>
    <template #amount0="scope">
      <template v-if="props.isMultiRouting">
        <span>{{ Number(scope.row.amount0) ? scope.row.amount0 : scope.row.amount1 }} {{ scope.row.token0 || scope.row.token1 }}</span>
      </template>
      <template v-else>
        <span>{{ scope.row.amount0 }} {{ scope.row.token0 }}</span>
      </template>
    </template>
    <template #amount1="scope">
      <span>{{ scope.row.amount1 }} {{ scope.row.token1 }}</span>
    </template>
    <template #address="scope">
      <span class="link" @click="openExplorer('address', scope.row.address)">
        {{ superLong(scope.row.address) }}
      </span>
    </template>
    <template #time="scope">
      <span>{{ scope.row.time }}</span>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { openExplorer, superLong } from '@/utils/util';
import Table from '@/components/Table/index.vue';
import TxType from './TxType.vue';

const props = defineProps<{
  data: any[];
  pageIndex: number;
  total: number;
  isMultiRouting?: boolean;
}>();

const emit = defineEmits(['pageChange']);

const { t } = useI18n();

const columns = computed(() => {
  const result = [
    { width: 30 },
    {
      prop: 'type',
      label: t('info.info24'),
      'min-width': 180,
      slotName: 'type'
    },
    {
      prop: 'totalVal',
      label: t('info.info25'),
      width: 160,
      slotName: 'totalVal'
      // sortable: 'custom'
    },
    {
      prop: 'amount0',
      label: t('info.info26'),
      width: 200,
      slotName: 'amount0'
      // sortable: 'custom'
    },
    {
      prop: 'amount1',
      label: t('info.info26'),
      width: 200,
      slotName: 'amount1'
      // sortable: 'custom'
    },
    {
      prop: 'address',
      label: t('info.info27'),
      slotName: 'address',
      'min-width': 210
    },
    {
      prop: 'time',
      label: t('info.info28'),
      width: 140,
      slotName: 'time'
      // sortable: 'custom'
    }
  ];
  if (props.isMultiRouting) {
    result.splice(4, 1);
  }
  return result;
});
function sortChange(item) {
  console.log(item);
}
function pageChange(index: number) {
  emit('pageChange', index);
}
</script>

<style></style>
