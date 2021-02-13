import themes from '@styles/Theme';

import { Content, Image } from './api';

export type ElementNames = 'content' | 'image' | 'contentTabView' | 'menu';
export type ElementTypes<K extends ElementNames> = {
  content: {
    content: Content;
    color: string;
    size: number;
  };
  image: {
    image: Image;
    mode: 'contain' | 'center' | 'stretch' | 'cover';
    height: number;
  };
  contentTabView: {
    types: ('articles' | 'events')[];
    maxHeight?: number;
    params: {
      groups?: string[];
      users?: string[];
      tags?: string[];
      schools?: string[];
      departments?: string[];
      global?: boolean;
    };
    theme: keyof typeof themes;
  };
  menu: {
    color: string;
    height?: number;
    elements: ({
      text: string;
      mode?: 'outlined' | 'text' | 'contained';
    } & ({ type: 'external'; url: string } | { type: 'internal'; page: string }))[];
  };
}[K];
export type Element<K extends ElementNames> = {
  type: K;
  data: ElementTypes<K>;
};

export type BackgroundNames = 'image' | 'color' | 'gradient';
export type BackgroundTypes<K extends BackgroundNames> = {
  image: {
    image: Image;
    mode: 'contain' | 'center' | 'stretch' | 'cover';
  };
  color: {
    color: string;
  };
  gradient: {
    start: string;
    end: string;
    angle: number;
  };
}[K];
export type Background<K extends BackgroundNames> = {
  type: K;
  data: BackgroundTypes<K>;
  minHeight?: number;
  columns: {
    elements: Element<ElementNames>[];
    align?: 'center' | 'flex-start' | 'flex-end';
    alignVertical?: 'center' | 'flex-start' | 'flex-end';
  }[];
};

export type Page = {
  page: string;
  main: boolean;
  content: Background<BackgroundNames>[];
};
