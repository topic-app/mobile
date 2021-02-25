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
  | { type: 'internal'; page: string; push?: boolean }
  | { type: 'menu'; items: MenuItem[] }
);

export type ElementNames = 'content' | 'image' | 'contentTabView' | 'menu' | 'title' | 'spacer';
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
    color: string;
    height?: number;
    elements: MenuItem[];
  };
  title: {
    title: string;
    subtitle?: string;
    titleColor: string;
    subtitleColor?: string;
    titleSize?: number;
    subtitleSize?: number;
    textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify';
  };
  spacer: {
    height: string;
  };
}[K];
export type Element<K extends ElementNames> = {
  id: string;
  type: K;
  data: ElementTypes<K>;
  align?: 'center' | 'flex-start' | 'flex-end';
  maxWidth?: number; // Is hidden if currentWidth > maxWidth
  minWidth?: number; // Is hidder if currentWidth <= minWidth
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  margin?: number;
};

export type BackgroundNames = 'image' | 'color' | 'gradient' | 'loader';
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
  loader: {
    type: 'bar' | 'spinner' | 'paper';
    color?: string;
    backgroundColor?: string;
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
  group: string;
  main: boolean;
  content: Background<BackgroundNames>[];
};

export type Header = {
  group: string;
  content: Background<BackgroundNames>[];
};

export type Footer = {
  group: string;
  content: Background<BackgroundNames>[];
};
