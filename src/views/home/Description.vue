<template>
  <div class="nerve-desc">
    <div class="pc">
      <div class="left">
        <h3>{{ $t('home.home1') }}</h3>
        <p class="desc">{{ $t('home.home2') }}</p>
        <Overview />
      </div>
      <div
        class="right"
        :style="{
          width: bgWrapper.width + 'px',
          height: bgWrapper.height + 'px'
        }"
      ></div>
    </div>
    <div class="mobile">
      <div class="right"></div>
      <div class="left">
        <h3>{{ $t('home.home1') }}</h3>
        <p class="desc">{{ $t('home.home2') }}</p>
        <Overview />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Overview from './Overview.vue';

const bgWrapper = ref({
  width: '',
  height: '550'
});
const defaultWidth = 1920;
// const defaultHeight = 937;
const initialWidth = 850;
// const initialHeight = 550;

// const
function calcContent() {
  const width = document.body.clientWidth;
  // const height = document.body.clientHeight;
  bgWrapper.value.width = (width / defaultWidth) * initialWidth;
  // bgWrapper.value.height = (width / defaultWidth) * initialHeight;
}

onMounted(() => {
  window.addEventListener('resize', calcContent);
  calcContent();
});
onUnmounted(() => {
  window.removeEventListener('resize', calcContent);
});
</script>

<style lang="scss">
.nerve-desc {
  //position: relative;
  margin-top: -80px;
  .pc {
    height: 460px;
  }
  .left {
    width: 45%;
    height: 100%;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3,
    .desc {
      color: #2d3750;
      line-height: 34px;
    }

    h3 {
      font-weight: 600;
      font-size: 40px;
      margin-bottom: 18px;
      line-height: 48px;
    }

    .desc {
      font-size: 20px;
    }
  }

  .right {
    position: absolute;
    z-index: -1;
    //right: 7%;
    //top: 3%;
    right: 100px;
    top: 30px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('../../assets/img/home-bg.svg');
  }

  @media screen and (max-width: 1200px) {
    margin-top: -50px;
    .left {
      width: 100%;
      height: auto;
      padding-bottom: 10px;
      h3 {
        font-size: 28px;
        margin-bottom: 5px;
        line-height: 38px;
      }

      .desc {
        font-size: 18px;
      }
    }

    .right {
      width: 100%;
      height: 300px;
      position: initial;
    }
  }
}
</style>
