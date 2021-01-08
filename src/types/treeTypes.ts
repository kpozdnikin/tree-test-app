// Copyright 2020 @kpozdnikin

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
  isLeaf: boolean;
  key: string;
  title: string;
}

export type CacheMapItemType = {
  allChildren: string[];
  children: string[];
  parentId: string;
}
