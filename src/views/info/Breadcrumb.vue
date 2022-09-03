<template>
  <div class="n-breadcrumb">
    <template v-for="(item, index) in props.items" :key="index">
      <span
        class="label"
        :class="item.path ? 'route' : ''"
        @click="toUrl(item)"
      >
        {{ item.label }}
      </span>
      <span class="separator" v-if="item.path">/</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

interface BreadItem {
  label: string;
  path?: string;
}

const props = defineProps<{
  items: BreadItem[];
}>();

const router = useRouter();

function toUrl(item: BreadItem) {
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style lang="scss">
.n-breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .label {
    color: #475472;
  }
  .route {
    color: #2688f7;
    cursor: pointer;
  }
  .separator {
    color: #475472;
    margin: 0 6px;
  }
}
</style>
