import { DirectiveBinding } from 'vue';
import ImageManager from './ImageManager';
import { LazyProps, State, Target } from './types';
import { throttle, hasIntersectionObserver, getScrollParent } from './utils';

const defaultIcon =
  'data:image/svg+xml;base64,PHN2ZwogICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgd2lkdGg9IjI0cHgiCiAgICBoZWlnaHQ9IjI0cHgiCiAgICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgICBmaWxsPSJub25lIgogICAgc3Ryb2tlPSIjNDA5ZWZmIgogICAgc3Ryb2tlLXdpZHRoPSIyIgogICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKICAgIGNsYXNzPSJ0b2tlbi1sb2dvIgogID4KICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIj48L2NpcmNsZT4KICAgIDxwYXRoIGQ9Ik05LjA5IDlhMyAzIDAgMCAxIDUuODMgMWMwIDItMyAzLTMgMyI+PC9wYXRoPgogICAgPGxpbmUgeDE9IjEyIiB5MT0iMTciIHgyPSIxMi4wMSIgeTI9IjE3Ij48L2xpbmU+CiAgPC9zdmc+Cg==';

const throttleDelay = 300;

// const events = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove', 'transitioncancel']
const events = ['scroll'];

export default class Lazy {
  loading: string;
  error: string;
  managerQueue: ImageManager[];
  cache: Set<string>;
  observer?: IntersectionObserver;
  targetQueue?: Target[];
  throttleLazyHandler: Function;

  constructor(options?: LazyProps) {
    this.loading = options?.loading || defaultIcon;
    this.error = options?.error || defaultIcon;

    this.managerQueue = [];
    this.cache = new Set();
    this.throttleLazyHandler = throttle(
      this.lazyHandler.bind(this),
      throttleDelay
    );
    this.init();
  }

  init() {
    if (hasIntersectionObserver()) {
      // 浏览器支持IntersectionObserver
      this.initIntersectionObserver();
    } else {
      // 不支持IntersectionObserver，使用手动监听scroll事件
      this.targetQueue = [];
    }
  }

  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const manager = this.managerQueue.find(manager => {
              return manager.el === entry.target;
            });
            if (manager) {
              if (manager.state === State.loaded) {
                this.removeManager(manager);
                return;
              }
              manager.load();
            }
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0
      }
    );
  }

  lazyHandler() {
    this.managerQueue.forEach(manager => {
      if (manager.isInView()) {
        if (manager.state === State.loaded) {
          this.removeManager(manager);
          return;
        }
        manager.load();
      }
    });
  }

  add(el: HTMLElement, binding: DirectiveBinding) {
    const parent = getScrollParent(el);
    const src = binding.value;
    const manager = new ImageManager({
      el,
      parent,
      src,
      loading: this.loading,
      error: this.error,
      cache: this.cache
    });
    this.managerQueue.push(manager);

    if (hasIntersectionObserver()) {
      this.observer!.observe(el);
    } else {
      this.lazyHandler();
      this.addListenerTarget(parent);
      this.addListenerTarget(window);
      this.throttleLazyHandler();
    }
  }
  addListenerTarget(el: HTMLElement | Window) {
    let target = this.targetQueue!.find(target => {
      return target.el === el;
    });
    if (!target) {
      target = {
        el,
        ref: 1
      };
      this.targetQueue!.push(target);
      this.addListener(el);
    } else {
      target.ref++;
    }
  }
  removeListenerTarget(el: HTMLElement | Window) {
    this.targetQueue!.forEach((target, index) => {
      if (el === target.el) {
        target.ref--;
        if (!target.ref) {
          this.removeListener(el);
          this.targetQueue!.splice(index, 1);
        }
      }
    });
  }
  addListener(el: HTMLElement | Window) {
    events.forEach(event => {
      el.addEventListener(
        event,
        this.throttleLazyHandler as EventListenerOrEventListenerObject,
        { capture: false }
      );
    });
  }
  removeListener(el: HTMLElement | Window) {
    events.forEach(event => {
      el.removeEventListener(
        event,
        this.throttleLazyHandler as EventListenerOrEventListenerObject
      );
    });
  }

  update(el: HTMLElement, binding: any) {
    const src = binding.value;
    const manager = this.managerQueue.find(manager => {
      return manager.el === el;
    });
    if (manager) {
      manager.update(src);
    } else {
      // 列表中使用在加载完成后会被remove，调用update时找不到manager
      // this.add(el, binding);
    }
  }

  removeManager(manager: ImageManager) {
    const index = this.managerQueue.indexOf(manager);
    if (index > -1) {
      this.managerQueue.splice(index, 1);
    }
    if (this.observer) {
      this.observer.unobserve(manager.el);
    } else {
      this.removeListenerTarget(manager.parent);
      this.removeListenerTarget(window);
    }
  }

  remove(el: HTMLElement) {
    const manager = this.managerQueue.find(manager => {
      return manager.el === el;
    });
    if (manager) {
      this.removeManager(manager);
    }
  }
}
