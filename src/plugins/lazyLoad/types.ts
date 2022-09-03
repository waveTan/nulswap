export interface ImageManagerProps {
  el: HTMLElement;
  parent: HTMLElement | Window;
  src: string;
  loading: string;
  error: string;
  cache: Set<string>;
}

export enum State {
  loading,
  loaded,
  error
}

export interface LazyProps {
  loading?: string;
  error?: string;
}

export interface Target {
  el: HTMLElement | Window;
  ref: number;
}
