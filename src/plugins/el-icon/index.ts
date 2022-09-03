import { App } from 'vue';
import {
  CaretBottom,
  ArrowDown,
  ArrowDownBold,
  ArrowRight,
  Loading,
  Minus,
  Plus,
  Back,
  CaretRight,
  CircleCheck,
  Search
} from '@element-plus/icons-vue';

// 全局注册@element-plus icon
const components = [
  CaretBottom,
  ArrowDown,
  ArrowDownBold,
  ArrowRight,
  Loading,
  Minus,
  Plus,
  Back,
  CaretRight,
  CircleCheck,
  Search
];
export function useElIcon(app: App) {
  components.forEach(component => {
    app.component(component.name, component);
  });
}
