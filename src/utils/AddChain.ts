import storage from '@/utils/storage';
import { generateTronAddress } from '@/utils/tronLink';

// 添加已有账户波场地址
export default function AddChain() {
  const accountList = storage.get('accountList') || [];
  if (accountList.length) {
    if (!accountList[0].address.TRON) {
      accountList.map((account: any) => {
        account.address.EVM = account.address.Ethereum;
        account.address.TRON = generateTronAddress(account.pub);
        delete account.address.Ethereum;
      });
      storage.set('accountList', accountList);
    }
  }
}
