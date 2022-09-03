<template>
  <div class="funds-table">
    <Table v-bind="props" :columns="columns" @pageChange="pageChange">
      <template #name="scope">
        <div class="symbol-wrap flex-center">
          <SymbolIcon :icon="scope.row.name" />
        </div>
      </template>
      <template #contractAddress="scope">
        <span
          class="link"
          @click="openUrl(scope.row.name, scope.row.contractAddress)"
        >
          {{ superLong(scope.row.contractAddress) }}
        </span>
      </template>
      <template #liq="scope">${{ $format(scope.row.liq) }}</template>
      <template #ratio="scope">
        <el-progress :percentage="Number(scope.row.ratio || '')" color="#2688F7" :stroke-width="8" />
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue';
import Table from '@/components/Table/index.vue';
import SymbolIcon from '@/components/SymbolIcon.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { superLong, openExplorer, openL1Explorer } from '@/utils/util';
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
const emit = defineEmits(['pageChange']);

const { t } = useI18n();
const router = useRouter();

const columns = computed(() => {
  return [
    { width: 30 },
    {
      prop: 'name',
      label: t('info.info44'),
      slotName: 'name',
      width: 140
    },
    {
      prop: 'contractAddress',
      label: t('info.info40'),
      'min-width': 180,
      slotName: 'contractAddress'
    },
    {
      prop: 'nerveId',
      label: t('info.info41'),
      width: 180,
      slotName: 'nerveId'
    },
    { prop: 'liq', label: t('info.info4'), width: 160, slotName: 'liq' },
    {
      prop: 'ratio',
      label: t('info.info42'),
      'min-width': 140,
      slotName: 'ratio'
    },
    { width: 30 }
  ];
});

function pageChange(index: number) {
  // console.log(index);
  emit('pageChange', index);
}

function openUrl(chain: string, address: string) {
  if (chain === 'NULS' || chain === 'NERVE') {
    openExplorer('address', address, true);
  } else {
    openL1Explorer(chain, 'address', address);
  }
}
</script>

<style lang="scss">
.funds-table {
  .symbol-wrap {
    img {
      width: 30px;
      height: 30px;
      background-color: #fff;
    }
  }
}
</style>
