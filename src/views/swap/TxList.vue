<template>
  <div class="swap-tx-list">
    <el-table :data="props.list" max-height="435" v-loading="loading">
      <el-table-column width="10px"></el-table-column>
      <el-table-column :label="$t('trading.trading3')">
        <template #default="scope">
          {{ $thousands(scope.row.toAmount) }} {{ scope.row.toSymbol }}
        </template>
      </el-table-column>
      <el-table-column prop="lock" :label="$t('trading.trading4')">
        <template #default="scope">
          {{ $thousands(scope.row.fromAmount) }} {{ scope.row.fromSymbol }}
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        :label="$t('trading.trading2')"
      ></el-table-column>
      <el-table-column :label="$t('trading.trading5')" width="100px">
        <template #default="scope">
          <span class="iconfont icon-chenggong" :scope="scope"></span>
          <span
            class="click iconfont icon-tiaozhuanlianjie"
            :scope="scope"
            style="margin-left: 10px"
            @click="openExplorer('hash', scope.row.hash)"
          ></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mobile-list">
      <ul>
        <li v-for="(item, index) in props.list" :key="index">
          <div class="flex-between">
            <div class="left">
              <div>
                <span>{{ $t('trading.trading3') }}</span>
                <p>{{ $thousands(item.toAmount) + item.toSymbol }}</p>
              </div>
              <div>
                <span>{{ $t('trading.trading4') }}</span>
                <p>{{ $thousands(item.fromAmount) + item.fromSymbol }}</p>
              </div>
            </div>
            <div class="right">
              <div>
                <span>{{ $t('trading.trading5') }}</span>
                <p>{{ $t('trading.trading18') }}</p>
              </div>
              <div>
                <span>{{ $t('trading.trading2') }}</span>
                <p>{{ item.time }}</p>
              </div>
            </div>
          </div>
          <p>
            Hash:
            <span class="link" @click="openExplorer('hash', item.hash)">
              {{ superLong(item.hash, 8) }}
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { openExplorer, superLong } from '@/utils/util';

const props = defineProps({
  list: Array,
  loading: Boolean
});

const name = ref('hi');
</script>

<style lang="scss">
@import '../../assets/css/style.scss';
.swap-tx-list {
  .el-table {
    border: none !important;
    th .cell {
      font-size: 16px;
      font-weight: 400;
    }
    tr td {
      border-bottom: 1px solid #e4efff !important;
    }
    tr .cell {
      line-height: 46px;
      font-size: 16px;
      //color: #333;
    }
    .iconfont {
      color: #1678ff;
      font-size: 26px;
    }
  }
  .mobile-list {
    display: none;
  }
  @media screen and (max-width: 1200px) {
    .el-table {
      th .cell {
        font-size: 14px;
      }
      tr .cell {
        line-height: 24px;
        font-size: 14px;
      }
      .iconfont {
        font-size: 22px;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .el-table {
      display: none;
    }
    .mobile-list {
      display: block;
      ul {
        max-height: 335px;
        overflow: auto;
      }
      li {
        padding: 10px 0;
        border-bottom: 1px solid #e4e9f4;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          border-bottom: none;
        }
      }
      .left,
      .right {
        div:first-child {
          margin-bottom: 2px;
        }
        span {
          font-size: 14px;
          color: $labelColor;
        }
        p {
          font-size: 14px;
        }
        .iconfont {
          color: #21d8ba;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
