export function debounce(fn: any, delay: number) {
  let timer: number;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn: Function, delay: number) {
  let timer: number;
  let lastRun = 0;
  return function () {
    const gap = Date.now() - lastRun;
    const args = arguments;
    const run = () => {
      lastRun = Date.now();
      timer = 0;
      // @ts-ignore
      fn.apply(this, args);
    };
    if (gap >= delay) {
      run();
    } else {
      timer = window.setTimeout(() => {
        run();
      }, delay);
    }
    if (timer) {
      clearTimeout(timer);
    }
  };
}

export function hasIntersectionObserver() {
  return true;
  // return !!window?.IntersectionObserver;
}

export function getScrollParent(el: HTMLElement): HTMLElement | Window {
  let parent = el;
  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break;
    }
    if (!parent.parentNode) {
      break;
    }
    if (/scroll|auto/.test(overflow(parent))) {
      return parent;
    }
    parent = parent.parentNode as HTMLElement;
  }
  return window;
}

const overflow = (el: HTMLElement) => {
  return (
    style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
  );
};

const style = (el: HTMLElement, prop: string) => {
  return getComputedStyle(el).getPropertyValue(prop);
};
