import { State, ImageManagerProps } from './types';

export default class ImageManager {
  el: HTMLElement;
  parent: HTMLElement | Window;
  src: string;
  loadingSrc: string;
  errorSrc: string;
  cache: Set<string>;
  state: State;
  constructor(options: ImageManagerProps) {
    this.el = options.el;
    this.parent = options.parent;
    this.src = options.src;
    this.loadingSrc = options.loading;
    this.errorSrc = options.error;
    this.cache = options.cache;
    this.state = State.loading;
    this.render(this.loadingSrc);
  }

  render(src: string) {
    this.el.setAttribute('src', src);
  }
  isInView() {
    const rect = this.el.getBoundingClientRect();
    const { top, left, width, height } = rect;
    // console.log(this.el, top, left, width, height, 777, window.innerHeight, window.innerWidth);
    if (!width && !height) return false;
    return top < window.innerHeight && left < window.innerWidth;
  }
  load(cb?: () => void) {
    if (this.state > State.loading) {
      return;
    }
    if (this.cache.has(this.src)) {
      this.state = State.loaded;
      this.render(this.src);
      return;
    }
    this.renderSrc(cb);
  }
  renderSrc(cb?: () => void) {
    this.render(this.loadingSrc);
    loadImage(this.src)
      .then(() => {
        this.state = State.loaded;
        this.render(this.src);
        this.cache.add(this.src);
        cb && cb();
      })
      .catch(e => {
        console.log(e);
        this.state = State.error;
        this.render(this.errorSrc);
        // console.warn(
        //   `load failed with src image(${this.src}) and the error msg is ${e}`
        // );
        cb && cb();
      });
  }
  update(src: string) {
    const currentSrc = this.src;
    if (src !== currentSrc) {
      this.src = src;
      this.state = State.loading;
      this.renderSrc();
    }
  }
}

function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      resolve(null);
      dispose();
    };
    image.onerror = function () {
      reject();
      dispose();
    };
    image.src = src;
    function dispose() {
      image.onload = image.onerror = null;
    }
  });
}
