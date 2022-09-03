<template>
  <el-table :data="props.data" stripe class="node-record-table">
    <!--<el-table-column width="30">
    </el-table-column>-->
    <el-table-column
      prop="blockHeight"
      :label="$t('public.public20')"
      width="120"
      align="center"
    ></el-table-column>
    <el-table-column label="TXID" min-width="160" align="center">
      <template v-slot="scope">
        <span class="link" @click="openExplorer('hash', scope.row.txHash)">
          {{ superLong(scope.row.txHash, 12) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      :label="$t('createNode.createNode5') + ' (NVT)'"
      width="120"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="createTime"
      :label="$t('public.public21')"
      width="200"
      align="center"
    ></el-table-column>
    <el-table-column :label="$t('public.public22')" width="160" align="center">
      <template v-slot="scope">
        <span>{{ $t('nodeType.' + scope.row.type) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { openExplorer, superLong } from '@/utils/util';
import { RecordItem } from '@/views/node/types';

const props = defineProps<{
  data: RecordItem[];
}>();
</script>

<style lang="scss">
.node-record-table {
}
</style>
