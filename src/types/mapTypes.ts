// Copyright 2020 @kpozdnikin

export type DbMapItemType = {
  children: string[];
  deleted?: boolean;
  level: number;
  parentId: string | null;
  value: string;
}

export type DbMapType = {
  [key: string]: DbMapItemType;
}

export type CacheMapItemType = {
  allChildren: string[];
  children: string[];
  deleted?: boolean;
  parentId: string;
}

export type CacheMapType = {
  [key: string]: CacheMapItemType;
}
