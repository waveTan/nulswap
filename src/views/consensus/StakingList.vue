<template>
  <div>
    <div v-if="staking" class="batch-handle-wrap">
      <el-checkbox v-model="selectAll" @change="chooseAll">
        {{ $t('staking.staking45') }}
      </el-checkbox>
      <el-button
        type="primary"
        size="small"
        @click="batchHandle(BatchHandle.QUIT)"
      >
        {{ $t('staking.staking36') }}
      </el-button>
      <el-tooltip
        v-if="selectedItem.length > 1"
        effect="light"
        :content="$t('staking.staking44')"
        placement="top"
      >
        <el-button class="disabled-btn" size="small">
          {{ $t('staking.staking37') }}
        </el-button>
      </el-tooltip>
      <el-button class="disabled-btn" size="small" v-else-if="!canBatchChange">
        {{ $t('staking.staking37') }}
      </el-button>
      <el-button
        v-else
        type="primary"
        size="small"
        @click="batchHandle(BatchHandle.CHANGE)"
      >
        {{ $t('staking.staking37') }}
      </el-button>
      <el-tooltip
        v-if="selectedItem.length > 1"
        effect="light"
        :content="$t('staking.staking43')"
        placement="top"
      >
        <el-button class="disabled-btn" size="small">
          {{ $t('staking.staking38') }}
        </el-button>
      </el-tooltip>
      <el-button
        v-else
        type="primary"
        size="small"
        @click="batchHandle(BatchHandle.MERGE)"
      >
        {{ $t('staking.staking38') }}
      </el-button>
    </div>
    <el-table :data="tableData" stripe class="staking-list" v-if="staking">
      <el-table-column width="10"></el-table-column>
      <el-table-column width="40">
        <template v-slot="scope">
          <el-checkbox
            :disabled="scope.row.fixedType !== 'NONE'"
            v-model="scope.row.checked"
            @change="chooseItem"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column width="180" label="Hash" align="center">
        <template v-slot="scope">
          <span class="link" @click="toUrl(scope.row.txHash)">
            {{ superLong(scope.row.txHash) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        :label="$t('staking.staking4')"
        align="center"
        prop="symbol"
      ></el-table-column>
      <el-table-column
        width="150"
        :label="$t('staking.staking16')"
        align="center"
        prop="amount"
      ></el-table-column>
      <el-table-column
        width="120"
        :label="$t('staking.staking17')"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.status === 0">
            {{ $t('stakingType.' + scope.row.fixedType) }}
          </span>
          <span v-else>{{ $t('stakingType.' + scope.row.fixedType) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="210"
        :label="$t('staking.staking21')"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        :label="$t('staking.staking31')"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.interest }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        :label="$t('staking.staking22')"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.status !== 1">
            <span
              v-if="checkShow(scope.row)"
              class="link"
              @click="handleChange(scope.row)"
            >
              {{ $t('staking.staking23') }}
            </span>
            <span v-if="checkShow(scope.row)" class="divide">丨</span>
            <span class="link" @click="handleQuit(scope.row)">
              {{ $t('staking.staking24') }}
            </span>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="data" stripe class="staking-list" v-else>
      <el-table-column width="10"></el-table-column>
      <el-table-column width="180" label="Hash" align="center">
        <template v-slot="scope">
          <span class="link" @click="toUrl(scope.row.txHash)">
            {{ superLong(scope.row.txHash) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        :label="$t('staking.staking4')"
        align="center"
        prop="symbol"
      ></el-table-column>
      <el-table-column
        width="150"
        :label="$t('staking.staking16')"
        align="center"
        prop="amount"
      >
        <template v-slot="scope">
          <span
            :class="
              String(scope.row.amount).indexOf('-') > -1 ? 'red' : 'green'
            "
          >
            {{
              scope.row.amount.indexOf('-') > -1
                ? scope.row.amount.split('-')[1]
                : scope.row.amount
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="380"
        :label="$t('staking.staking17')"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.status === 0">
            {{ $t('stakingType.' + scope.row.fixedType) }}
          </span>
          <span v-else>
            {{
              $t('stakingType.' + scope.row.fixedType) +
              '(' +
              scope.row.createTime +
              '~' +
              scope.row.endTime +
              ')'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        :label="$t('staking.staking52')"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ $t('nodeType.' + scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        :label="$t('staking.staking35')"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="staking-list-mobile" v-if="staking">
      <div class="staking-item" v-for="item in tableData" :key="item.txHash">
        <el-checkbox
          :disabled="item.fixedType !== 'NONE'"
          v-model="item.checked"
          @change="chooseItem"
        ></el-checkbox>
        <div class="item-info">
          <div class="item-head">
            {{ item.symbol }}
            <div class="btn-wrap fr">
              <span class="link" @click="toUrl(item.txHash)">
                {{ $t('staking.staking46') }}
              </span>
              <span
                v-if="checkShow(item)"
                class="link"
                @click="handleChange(item)"
              >
                {{ $t('staking.staking23') }}
              </span>
              <span class="link" @click="handleQuit(item)">
                {{ $t('staking.staking24') }}
              </span>
            </div>
          </div>
          <div class="item-content">
            <div class="left">
              <p>{{ $t('staking.staking17') }}</p>
              {{ $t('stakingType.' + item.fixedType) }}
            </div>
            <div class="center">
              <p>{{ $t('staking.staking16') }}</p>
              {{ item.amount }}
            </div>
            <div class="right">
              <p>{{ $t('staking.staking21') }}</p>
              {{ item.endTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="staking-list-mobile" v-else>
      <div class="staking-item" v-for="item in tableData" :key="item.txHash">
        <div class="item-info">
          <div class="item-head">
            {{ item.symbol }}
            <span class="time">{{ item.createTime }}</span>
            <div class="btn-wrap fr">
              <span class="link" @click="toUrl(item.txHash)">
                {{ $t('staking.staking46') }}
              </span>
            </div>
          </div>
          <div class="item-content">
            <div class="left">
              <p>{{ $t('staking.staking17') }}</p>
              {{ $t('stakingType.' + item.fixedType) }}
            </div>
            <div class="center">
              <p>{{ $t('staking.staking16') }}</p>
              {{ item.amount }}
            </div>
            <div class="right">
              <p>{{ $t('staking.staking52') }}</p>
              {{ $t('nodeType.' + item.type) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="batch-handle-dialog form-dialog"
      width="440px"
      :title="dialogTitle"
      v-model="dialogShow"
      :show-close="false"
      @closed="selectedRow = null"
    >
      <div class="batch-info" v-if="!selectedRow">
        <div>
          <span class="info-name">{{ $t('staking.staking39') }}</span>
          {{ tableData.filter(v => v.checked).length
          }}{{ $t('staking.staking53') }}
        </div>
        <div style="display: flex">
          <span class="info-name">{{ $t('staking.staking40') }}</span>
          <span class="select-items">
            <span v-for="item in selectedItem" :key="item.symbol">
              {{ item.amount + item.symbol }}
              <br />
            </span>
          </span>
        </div>
        <div v-if="batchType === 2">
          <span class="info-name">{{ $t('staking.staking17') + ': ' }}</span>
          <el-select v-model="deadLine">
            <el-option
              v-for="item in deadLineList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div v-if="batchType === 3" class="tip">
          {{ $t('staking.staking42') }}
        </div>
      </div>
      <div class="batch-info" v-else>
        <div>
          <span class="info-name">{{ $t('staking.staking39') }}</span>
          1{{ $t('staking.staking53') }}
        </div>
        <div>
          <span class="info-name">{{ $t('staking.staking40') }}</span>
          {{ selectedRow?.amount + selectedRow?.symbol }}
        </div>
        <div>
          <span class="info-name">{{ $t('staking.staking17') + ': ' }}</span>
          <el-select v-model="deadLine">
            <el-option
              v-for="item in deadLineList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogShow = false">
            {{ $t('public.public8') }}
          </el-button>
          <el-button type="primary" @click="batchEmit">
            {{ $t('public.public9') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { ElMessageBox } from 'element-plus';
import { Plus, superLong } from '@/utils/util';
import config from '@/config';
import { BatchHandle, CanStakingListItem, StakingListItem } from './types';

const props = defineProps<{
  data: StakingListItem[];
  staking: boolean;
  canStakingList: CanStakingListItem[];
}>();

const emit = defineEmits(['batchHandle', 'quitStaking']);

const { t } = useI18n();
const toast = useToast();

const tableData = ref<StakingListItem[]>([]);
const selectAll = ref(false); // 全选
const batchType = ref<BatchHandle>(BatchHandle.QUIT); // 1 批量退出 2 转定期 3 合并
const dialogShow = ref(false);
const deadLine = ref(1); // 转定期期限
const selectedRow = ref<StakingListItem>(); // 单条选中的转定期项

let symbolCount = 0;
watch(
  () => props.data,
  val => {
    selectAll.value = false;
    let count = 0;
    val.map(v => {
      v.checked = false;
      if (v.fixedType === 'NONE') {
        count++;
      }
    });
    symbolCount = count;
    tableData.value = [...val];
  },
  {
    immediate: true
  }
);

const dialogTitle = computed(() => {
  return batchType.value === 1
    ? t('staking.staking36')
    : batchType.value === 2
    ? t('staking.staking23')
    : t('staking.staking38');
});

const selectedItem = computed(() => {
  const selectItems: { amount: string; symbol: string }[] = [];
  tableData.value.map(v => {
    const item = { amount: '0', symbol: '' };
    if (v.checked) {
      const exist = selectItems.filter(item => item.symbol === v.symbol);
      if (exist.length) {
        selectItems.map(s => {
          if (s.symbol === v.symbol) {
            s.amount = Plus(s.amount, v.amount).toFixed();
          }
        });
      } else {
        item.amount = v.amount;
        item.symbol = v.symbol;
        selectItems.push(item);
      }
    }
  });
  return selectItems;
});

const deadLineList = computed(() => {
  return [
    { label: t('staking.staking6'), value: 1 },
    { label: t('staking.staking7'), value: 2 },
    { label: t('staking.staking8'), value: 3 },
    { label: t('staking.staking9'), value: 4 },
    { label: t('staking.staking10'), value: 5 },
    { label: t('staking.staking11'), value: 6 },
    { label: t('staking.staking12'), value: 7 }
  ];
});

function chooseAll() {
  const newData = [...tableData.value];
  newData.map(v => {
    v.checked = selectAll.value && v.fixedType === 'NONE';
  });
  tableData.value = newData;
}

function chooseItem() {
  const hasChoose = tableData.value.filter(v => v.checked);
  selectAll.value = symbolCount === hasChoose.length;
  tableData.value = [...tableData.value];
}

function batchHandle(type: BatchHandle) {
  const selectedItem = tableData.value.filter(v => v.checked);
  if (selectedItem.length < 2) {
    toast.warning(t('staking.staking41'));
    return;
  }
  //稳定币不能转定期
  if (type === BatchHandle.CHANGE) {
    const notStable = checkShow(selectedItem[0]);
    if (!notStable) {
      toast.warning(t('staking.staking47'));
      return;
    }
  }
  batchType.value = type;
  dialogShow.value = true;
}

// 是否能批量转定期
const canBatchChange = computed(() => {
  const selectedItem = tableData.value.filter(v => v.checked);
  if (!selectedItem.length) return true;
  const notStable = checkShow(selectedItem[0]);
  console.log(notStable, 123465789);
  return notStable;
});

function batchEmit() {
  const selectedItem = selectedRow.value
    ? [selectedRow.value]
    : tableData.value.filter(v => v.checked);
  dialogShow.value = false;
  console.log(selectedItem, 123456);
  const params = {
    type: batchType.value,
    items: selectedItem,
    deadLine: batchType.value === BatchHandle.CHANGE ? deadLine.value : null
  };
  emit('batchHandle', params);
}

//转定期
function handleChange(e: StakingListItem) {
  selectedRow.value = e;
  batchType.value = 2;
  dialogShow.value = true;
}

//退出
function handleQuit(e: StakingListItem) {
  console.log(e, 22);
  if (e.fixedType === 'NONE' && e.symbol === 'NVT') {
    ElMessageBox.confirm(t('staking.staking48'), t('staking.staking54'), {
      confirmButtonText: t('public.public9'),
      cancelButtonText: t('public.public8'),
      type: 'warning'
    })
      .then(() => {
        emit('quitStaking', e);
      })
      .catch(() => {
        //
      });
  } else {
    emit('quitStaking', e);
  }
}

function toUrl(hash: string) {
  window.open(config.explorerUrl + '/transaction/info?hash=' + hash);
}
//稳定币不显示转定期按钮
function checkShow(item: StakingListItem) {
  const symbol = props.canStakingList.filter(
    v => v.assetChainId === item.assetChainId && v.assetId === item.assetId
  )[0];
  if (symbol) return symbol.canBePeriodically;
  return false;
}
</script>

<style lang="scss">
.batch-handle-wrap {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .disabled-btn {
    cursor: not-allowed !important;
    background-image: none !important;
    background-color: #fff !important;
    border-color: #ebeef5 !important;
    color: #c0c4cc;
    &:hover {
      opacity: 1;
    }
  }
  .el-checkbox {
    margin-right: 20px;
  }

  .el-tooltip {
    &.el-button,
    &.el-button.is-disabled:focus,
    &.el-button.is-disabled:hover {
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ebeef5;
    }
  }

  .el-button {
    /*margin-right: 10px;*/
  }
}

.staking-list {
  .green {
    color: green;
  }

  .red {
    color: red;
  }
  .el-checkbox {
    height: 30px;
  }
  .divide {
    padding: 0 8px;
  }
}

.staking-list-mobile {
  display: none;
}

@media screen and (max-width: 1200px) {
  .staking-page {
    margin-bottom: 0;
  }

  .batch-handle-wrap .el-button--small,
  .el-button--small.is-round {
    padding: 6px;
  }
  .batch-handle-wrap {
    overflow: auto;
  }

  .staking-list {
    display: none;
  }

  .staking-list-mobile {
    display: block;

    .staking-item {
      display: flex;
      align-items: center;
      /*margin-bottom: 0.2rem;*/
      padding: 5px 0;
      border-bottom: 1px solid #dfe4ef;

      .el-checkbox {
        width: 25px;
      }

      .item-info {
        flex: 1;
      }

      .item-head {
        color: #333;
        font-size: 14px;

        .time {
          margin-left: 5px;
          color: #8794b1;
        }

        .link {
          font-size: 14px;
          margin-left: 8px;
        }
      }

      .item-content {
        display: flex;
        font-size: 14px;
        div {
          width: 28%;

          p {
            color: #8794b1;
            margin: 3px 0;
          }
        }

        .right {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}

.batch-handle-dialog {
  .el-dialog__body {
    padding-bottom: 10px;
  }
  .batch-info {
    padding-top: 20px;

    & > div {
      padding-bottom: 20px;
      font-size: 16px;

      .info-name {
        display: inline-block;
        width: 100px;
        color: #8794b1;
      }

      .select-items span {
        color: #5e6983;
      }

      &.tip {
        text-align: center;
        color: #fd9d2d;
        font-size: 14px;
      }
    }
  }
}
</style>
