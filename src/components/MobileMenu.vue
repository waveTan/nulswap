<template>
  <transition name="drawer-fade">
    <div class="mobile-menu" v-show="visible">
      <transition name="model">
        <div class="mask" v-show="visible" @click="chooseMenu"></div>
      </transition>
      <Menu
        :class="['menu', visible ? '' : 'hide-menu']"
        v-bind="$attrs"
        @clickMenu="chooseMenu"
      />
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue';
import Menu from './Menu.vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['update:show']);

const visible = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit('update:show', val);
  }
});

watch(
  () => visible.value,
  val => {
    if (val) {
      document.body.classList.add('overhide');
    } else {
      document.body.classList.remove('overhide');
    }
  }
);
function chooseMenu() {
  nextTick(() => {
    visible.value = false;
  });
}
</script>

<style lang="scss">
.mobile-menu {
  position: fixed;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  z-index: 9999;

  &.mobile-menu-show {
    z-index: 9999;
  }

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.46;
    background-color: #212121;
  }

  .menu {
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    animation: rtl-drawer-in 0.3s;
    &.hide-menu {
      animation: rtl-drawer-out 0.3s;
    }
  }
}
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s;
}

.drawer-fade-enter,
.drawer-fade-leave-to {
  opacity: 0;
}

.model-enter-active,
.model-leave-active {
  transition: opacity 0.2s;
}

.model-enter,
.model-leave-to {
  opacity: 0;
}
@keyframes rtl-drawer-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes rtl-drawer-out {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
