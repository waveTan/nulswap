<template>
  <div class="node-info box_wrapper">
    <div class="head flex-between">
      <div class="left">
        <span class="tx-uppercase font18">ID: {{ nodeInfo.agentId }}</span>
        <template v-if="props.address === nodeInfo.agentAddress">
          &nbsp;|&nbsp;
          <span class="click font14" style="color: #f1313c" @click="stopNode">
            {{ $t('nodeDetail.nodeDetail1') }}
          </span>
        </template>
      </div>
      <div class="right">
        <span class="font14 link" @click="openExplorer('consensus', '')">
          {{ $t('nodeDetail.nodeDetail2') }}
        </span>
        &nbsp;|&nbsp;
        <span :class="[nodeInfo.status === 1 ? 'resolve' : 'yellow']">
          {{
            nodeInfo.status === 1
              ? $t('nodeDetail.nodeDetail3')
              : $t('nodeDetail.nodeDetail4')
          }}
        </span>
      </div>
    </div>
    <div class="body clear">
      <div class="left-part">
        <p>
          {{ $t('createNode.createNode5') }}
          <label>
            {{ nodeInfo.deposit }}
            <span class="fCN">NVT</span>
          </label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail5') }}
          <label>
            {{ nodeInfo.reward }}
            <span class="fCN">NVT</span>
          </label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail6') }}
          <label>{{ nodeInfo.interestRate }}%</label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail7') }}
          <label>{{ nodeInfo.creditValue }}</label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail9') }}
          <label class="yellow-card link">
            <span @click="openExplorer('consensusInfo', nodeInfo.txHash)">
              {{ nodeInfo.yellowCardCount }}
              {{ $t('nodeDetail.nodeDetail12') }}
            </span>
          </label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail11') }}
          <label>{{ nodeInfo.agentAlias ? nodeInfo.agentAlias : '-' }}</label>
        </p>
      </div>
      <div class="right-part">
        <p>
          {{ $t('createNode.createNode2') }}
          <label
            class="link"
            @click="openExplorer('address', nodeInfo.agentAddress)"
          >
            {{ superLong(nodeInfo.agentAddress) }}
          </label>
        </p>
        <p>
          {{ $t('createNode.createNode3') }}
          <label
            class="link"
            @click="openExplorer('address', nodeInfo.rewardAddress)"
          >
            {{ superLong(nodeInfo.rewardAddress) }}
          </label>
        </p>
        <p>
          {{ $t('createNode.createNode4') }}
          <label
            class="link"
            @click="openExplorer('address', nodeInfo.packingAddress)"
          >
            {{ superLong(nodeInfo.packingAddress) }}
          </label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail8') }}
          <label>
            {{ judgeNodeType(nodeInfo.bankNode, nodeInfo.status) }}
          </label>
        </p>
        <p>
          {{ $t('nodeDetail.nodeDetail10') }}
          <label>{{ nodeInfo.createTime }}</label>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NodeInfo } from '@/views/node/types';
import { useI18n } from 'vue-i18n';
import { openExplorer, superLong } from '@/utils/util';

const props = defineProps<{
  address: string;
  nodeInfo: NodeInfo;
}>();
const emit = defineEmits(['stopNode']);

const { t } = useI18n();

//判断节点类型
function judgeNodeType(bankNode: boolean, isConsensus: number) {
  if (bankNode) {
    return t('nodeStatus.2');
  } else if (isConsensus) {
    return t('nodeStatus.1');
  } else {
    return t('nodeStatus.3');
  }
}

// 注销节点
function stopNode() {
  emit('stopNode');
}
</script>

<style lang="scss">
.node-info {
  padding: 0 30px 20px;

  .head {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #dfe4ef;

    .right span {
      font-size: 14px;

      &.resolve {
        color: #4ade5f;
      }

      &.yellow {
        color: #fd9d2d;
      }

      &.link {
        border-bottom: 1px solid #608fff;
      }
    }
  }

  .body {
    display: flex;

    .left-part,
    .right-part {
      width: 48.5%;

      p {
        height: 40px;
        line-height: 40px;
        padding: 0 30px;
        font-size: 14px;
        color: #8794b1;

        label {
          float: right;
          color: #475472;

          &.link {
            color: #608fff;
          }

          &.yellow-card span {
            border-bottom: 1px solid #608fff;
          }
        }

        &:nth-of-type(2n) {
          background-color: #f3f6fd;
        }
      }
    }

    .right-part {
      margin-left: 3%;
    }
  }
  @media screen and (max-width: 1200px) {
    padding: 15px 20px 20px;

    .head {
      height: auto;
      line-height: 28px;
      border-bottom: none;
      flex-direction: column;
      align-items: flex-start;
      .left {
        display: flex;
        align-items: center;
      }
      .right span {
        font-size: 14px;

        &.resolve {
          color: #4ade5f;
        }

        &.yellow {
          color: #fd9d2d;
        }

        &.link {
          border-bottom: 1px solid #608fff;
        }
      }
    }

    .body {
      flex-wrap: wrap;
      .left-part,
      .right-part {
        width: 100%;

        p {
          height: 36px;
          line-height: 36px;
          padding: 0 10px;
        }
      }

      .right-part {
        margin-left: 0;
      }
    }
  }
}
</style>
