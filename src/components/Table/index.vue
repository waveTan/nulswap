<template>
  <div class="n-table">
    <h3 class="n-table-title" v-if="props.title">{{ props.title }}</h3>
    <el-table
      :data="props.data"
      stripe
      @row-click="rowClick"
      @sort-change="sortChange"
    >
      <template v-for="item in props.columns" :key="item.prop">
        <el-table-column v-bind="item">
          <template #default="scope">
            <slot :name="item.slotName" :row="scope.row">
              {{ scope.row[item.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="n-table-pagination" v-if="showPagination">
      <div
        class="icon-prev"
        :class="{ 'disable-btn': disablePrev }"
        @click="prev"
      >
        <i class="iconfont icon-arrowleft"></i>
      </div>
      <div class="page-number">
        {{ props.pageIndex || currentPage }}/{{ totalPage }}
      </div>
      <div
        class="icon-next"
        :class="{ 'disable-btn': disableNext }"
        @click="next"
      >
        <i class="iconfont icon-arrowright"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, withDefaults } from 'vue';

interface Column {
  prop: string;
  label: string;
  width?: string;
  align?: string;
  slotName?: string;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    data: any[];
    columns: Column[];
    pagination?: boolean;
    total?: number | string;
    pageIndex?: number;
    pageSize?: number | string;
  }>(),
  {
    pagination: true,
    pageIndex: 0,
    total: 0,
    pageSize: 10
  }
);

const emit = defineEmits(['pageChange', 'rowClick', 'sortChange']);

const currentPage = ref(1);

const showPagination = computed(() => {
  return (
    props.pagination &&
    props.total &&
    Number(props.total) > Number(props.pageSize)
  );
});

const totalPage = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});

const disablePrev = computed(() => {
  const page = props.pageIndex || currentPage.value;
  return page <= 1;
});

const disableNext = computed(() => {
  const page = props.pageIndex || currentPage.value;
  return page >= totalPage.value;
});

function prev() {
  if (disablePrev.value) return;
  let page = props.pageIndex;
  if (!page) {
    currentPage.value--;
    page = currentPage.value;
  } else {
    page--;
  }
  emit('pageChange', page);
}

function next() {
  if (disableNext.value) return;
  let page = props.pageIndex;
  if (!page) {
    currentPage.value++;
    page = currentPage.value;
  } else {
    page++;
  }
  emit('pageChange', page);
}

function rowClick(item) {
  emit('rowClick', item);
}

function sortChange(item) {
  // console.log(item,55);
  emit('sortChange', item);
}
</script>

<style lang="scss">
.n-table {
  margin-bottom: 38px;
  .el-table__body-wrapper {
    overflow-x: auto;
  }
  .n-table-title {
    font-size: 18px;
    font-weight: 600;
    color: #475472;
    line-height: 1;
    margin-bottom: 18px;
  }

  .n-table-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    .icon-prev,
    .icon-next {
      cursor: pointer;
      line-height: 1;
      i {
        font-size: 18px;
        color: #2688f7;
      }
    }
    .disable-btn {
      cursor: not-allowed;
      i {
        color: #94a6ce;
      }
    }
    .page-number {
      padding: 0 5px;
    }
  }
  @media screen and (max-width: 1200px) {
    margin-bottom: 20px;
    .n-table-title {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }
}
</style>
