<template>
  <div
    :class="['header', route.path === '/' ? 'home-header' : '']"
    @click="showMenu = false"
  >
    <div class="flex-between w1200">
      <div class="left">
        <div class="logo" @click="router.push('/home')">
          <img src="../../assets/img/logo.png" alt="" />
        </div>
        <Menu class="pc-menu" />
      </div>
      <div class="account-wrap">
        <span class="span-wrap"><img src="../../assets/img/nerveIcon.png" /> $0.20</span>
        <span class="span-wrap"><img src="../../assets/img/nerveIcon.png" /> $0.05</span>
        <span class="span-wrap  span-lanuch">Launch Dapp</span>
        <span @click="switchLang" class="click pc" style="margin-left: 10px">
          {{ lang }}
        </span>
      </div>
      <ConnectWallet
        v-model:show="showConnect"
        @changeShow="showConnectDialog"
        @connect="connectProvider"
      />
      <AccountManage
        v-model:show="manageAccount"
        :address="nerveAddress"
        @disconnect="disconnectProvider"
        :txList="accountTxs"
      />
    </div>
    <MobileMenu v-model:show="showMenu" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import Menu from '../Menu.vue';
import ConnectWallet from './ConnectWallet.vue';
import AccountManage from './AccountManage.vue';
import MobileMenu from '../MobileMenu.vue';
import SwitchChain from '@/components/SwitchChain.vue';
import useEthereum from '@/hooks/useEthereum';
import useLang from '@/hooks/useLang';
import AuthButton from '../AuthButton.vue';
import useStoreState from '@/hooks/useStoreState';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import { getTx, getTronTx } from '@/service/api';
import { superLong, getCurrentAccount } from '@/utils/util';
import { Account, TxInfo } from '@/store/types';
import storage from '@/utils/storage';
import { ETransfer } from '@/utils/api';

const store = useStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const { address, initProvider, connect, disconnect } = useEthereum();
const { nerveAddress, wrongChain, chain } = useStoreState();
initProvider();

const { lang, switchLang } = useLang();

const showSwitchChain = ref(false);

watch(
  () => address.value,
  val => {
    const currentAccount = getCurrentAccount(val);
    store.commit('setCurrentAddress', currentAccount || {});
  },
  {
    immediate: true
  }
);

const manageAccount = ref(false);
const showConnect = computed(() => store.state.showConnect);
function showConnectDialog(state: boolean) {
  store.commit('changeConnectShow', state);
}
async function connectProvider(provider: string) {
  try {
    await connect(provider);
  } catch (e) {
    // console.log(e, typeof e, e.message);
    toast.error(e.message || e);
  }
  store.commit('changeConnectShow', false);
}
function disconnectProvider() {
  disconnect();
  manageAccount.value = false;
  store.commit('setCurrentAddress', {});
}

const activeIndex = ref('');
watch(
  () => route.path,
  val => {
    activeIndex.value = val?.split('/')[1];
  }
);

/*const wrongChain = computed(() => {
  const NULSOrNERVE = address.value && isNULSOrNERVE(address.value);
  if (NULSOrNERVE) {
    return false;
  } else {
    return notL1Chain.value;
  }
});*/

// const authRef = ref<InstanceType<typeof AuthButton>>();
// async function derivedAddress() {
//   // @ts-ignore
//   const result = await authRef.value.derivedAddress();
//   if (result) {
//     toAsset();
//   }
// }

const chainLogo = computed(() => {
  const { logo } = _networkInfo[chain.value];
  return logo;
});

const showMenu = ref(false);
function toggleShowMenu() {
  showSwitchChain.value = false;
  showMenu.value = !showMenu.value;
}

let isQuery = false;
onMounted(() => {
  window.setInterval(() => {
    checkTxStatus();
  }, 5000);
  checkTxStatus();
});
const accountTxs = ref<TxInfo[]>([]);

const unConfirmedTx = computed(() => {
  return accountTxs.value.filter(tx => !tx.status).length;
});

async function checkTxStatus() {
  if (!address.value || !nerveAddress.value) return;
  const account = getCurrentAccount(address.value);
  const txs = account?.txs;
  if (txs && txs.length && !isQuery) {
    isQuery = true;
    try {
      accountTxs.value = [...txs];
      const pendingTx = txs.filter((v: TxInfo) => !v.status);
      if (pendingTx.length) {
        const newTxs = await pollingTx(pendingTx);
        newTxs.map(tx => {
          txs.map((v: TxInfo) => {
            if (tx.hash === v.hash) {
              v.status = tx.status;
            }
          });
        });
        accountTxs.value = txs;
        const accountList: Account[] = storage.get('accountList') || [];
        accountList.map(v => {
          const sameAddress = Object.values(v.address)
            .map((v: any) => v.toLowerCase())
            .includes(address.value?.toLowerCase());
          if (sameAddress) {
            v.txs = txs;
          }
        });
        storage.set('accountList', accountList);
      }
    } catch (e) {
      //
    }
    isQuery = false;
  }
}

async function pollingTx(txs: TxInfo[]) {
  const txsQuery = txs.map(v => {
    if (!v.L1Chain) {
      if (v.type === 43) {
        // 提现，目标链未确认前显示追加手续费按钮
        return handleWithdrawalTx(v);
      } else {
        return getTx(v.hash);
      }
    } else if (v.L1Chain === 'TRON') {
      return getTronTx(v.hash);
    } else {
      const transfer = new ETransfer(v.L1Chain);
      return transfer.provider.getTransactionReceipt(v.hash);
    }
  });
  const res = await Promise.all(txsQuery);
  res.map(v => {
    if (!v) return;
    txs.map(tx => {
      if (tx.hash === v.hash || tx.hash === v.transactionHash) {
        tx.status = v.status;
      }
    });
  });
  return txs;
}

async function handleWithdrawalTx(tx: TxInfo) {
  const txState = { status: 0, hash: tx.hash };
  const res = await getTx(tx.hash);
  if (res) {
    if (res.txData?.state !== 'Unconfirmed') {
      return res;
    }
  }
  return txState;
}
</script>

<style lang="scss">
@import '../../assets/css/style.scss';
.header {
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
  .w1200 {
    height: 80px;
  }
  &.home-header {
    box-shadow: none;
    background: transparent;
  }
  background-color: #fff;
  .left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .logo {
    // width: 160px;
    width: 180px;
    cursor: pointer;
    margin-right: 30px;
    img {
      width: 100%;
    }
  }
  .account-wrap {
    display: flex;
    align-items: center;
    .span-wrap{
      width:120px;
      font-size: 16px;
      img{
        width:25px;
        float: left;
        margin-right: 10px;
      }
    }
    .span-lanuch{
      border-radius: 18px;
      background-color: #eef2fc;
      line-height: 35px;
      text-align: center;
      width:160px;
      margin-right: 10px;
      cursor: pointer;
    }
    .asset-icon {
      height: 30px;
      width: 32.5px;
      img {
        cursor: pointer;
        height: 100%;
        width: 100%;
      }
    }
  }
  .account {
    min-width: 170px;
    height: 36px;
    margin-left: 10px;
    //background: #fff;
    //background-color: #eef2fc;
    //border-radius: 18px;
    font-size: 15px;
    cursor: pointer;
    color: $txColor;
    line-height: 36px;
    text-align: center;
    .connection {
      color: $linkColor;
    }
    .auth-button {
      height: 100%;
      .el-button {
        width: 100%;
        height: 100%;
        border-radius: 18px;
        min-height: auto;
        padding: 0 20px;
      }
    }
    .wrong-chain {
      color: #f56c6c;
    }
    .chain-wrap {
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      background-color: #eef2fc;
      border-radius: 18px;
      margin-left: 10px;
      img {
        width: 25px;
        margin-right: 5px;
      }
      span {
        color: #475472;
      }
      .l1-chain {
        margin-right: 5px;
        color: #c2cadb;
        display: flex;
        align-items: center;
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin-right: 0;
        }
      }
    }
    .address-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 5px;
      height: 100%;
      //line-height: 1;
      position: relative;
      .switch-chain-wrapper {
        width: 100%;
      }
      .wrong-chain {
        color: red;
        font-size: 14px;
      }
      .chain-wrap {
        display: flex;
        align-items: center;
        position: relative;
        span {
          color: #475472;
        }
      }
      img {
        width: 28px;
        cursor: pointer;
      }
      span {
        cursor: pointer;
        font-size: 14px;
        height: 100%;
        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .w1200 {
      height: 60px;
    }
    .logo {
      width: 96px;
      margin-right: 0;
    }
    .logo img {
      margin-right: 0;
    }
    .pc-menu {
      display: none;
    }
    .menu-icon {
      margin-left: 10px;
    }
    .account .chain-wrap {
      margin-left: 0;
      line-height: 32px;
    }
  }
  @media screen and (max-width: 375px) {
    .w1200 {
      height: 50px;
      padding: 0 16px 0 12px;
    }
    .logo {
      width: 86px;
    }
    .account {
      margin-left: 2px;
      line-height: 32px;
      height: 32px;
    }
    .logo img {
      margin-right: 0;
    }
    .pc-menu {
      display: none;
    }
    .menu-icon {
      margin-left: 10px;
    }
    .account .chain-wrap {
      margin-left: 0;
      line-height: 32px;
    }
  }
}

.el-popup-parent--hidden {
  padding: 0 !important;
}

@media screen and (max-width: 610px) {
  .header .account-wrap .asset-icon i {
    font-size: 20px;
  }
}
</style>
