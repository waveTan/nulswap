import { ElLoading } from 'element-plus';

export default function useLoading() {
  let loading: any;
  function showLoading() {
    loading = ElLoading.service({
      lock: true,
      text: ''
    });
  }
  function closeLoading() {
    loading?.close();
  }
  return {
    showLoading,
    closeLoading
  };
}
