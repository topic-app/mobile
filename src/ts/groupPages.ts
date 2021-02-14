import themes from '@styles/Theme';

import { Content, Image } from './api';

export type MenuItem = {
  id: string;
  text: string;
  radius?: number;
  color?: string;
  dark?: boolean;
  icon?: string;
  mode?: 'outlined' | 'text' | 'contained';
} & (
  | { type: 'external'; url: string }
  | { type: 'internal'; page: string }
  | { type: 'menu'; items: MenuItem[] }
);

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
    title?: string;
    max?: number;
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
    color?: string;
    height?: number;
    elements: MenuItem[];
  };
}[K];
export type Element<K extends ElementNames> = {
  id: string;
  type: K;
  data: ElementTypes<K>;
  align?: 'center' | 'flex-start' | 'flex-end';
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
  id: string;
  type: K;
  data: BackgroundTypes<K>;
  minHeight?: number;
  columns: {
    id: string;
    elements: Element<ElementNames>[];
    size?: number;
    align?: 'center' | 'flex-start' | 'flex-end';
    alignVertical?: 'center' | 'flex-start' | 'flex-end';
  }[];
};

export type Page = {
  page: string;
  main: boolean;
  header: Background<BackgroundNames>[];
  content: Background<BackgroundNames>[];
  footer: Background<BackgroundNames>[];
};
