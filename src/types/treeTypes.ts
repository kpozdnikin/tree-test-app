// Copyright 2020 @kpozdnikin
import { ReactNode } from 'react';

export type DbTreeType = {
  attributes: {
    value: string;
  };
  children: DbTreeType[];
  id: string;
  name: string;
}

export type CacheTreeType = {
  children: CacheTreeType[];
  icon?: ReactNode;
  isLeaf: boolean;
  key: string;
  title: string;
}
