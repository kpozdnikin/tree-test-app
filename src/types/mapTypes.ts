// Copyright 2020 @kpozdnikin

export type minMapType = {
  id: string;
  parentId: string | null;
}

export type DbMapItemType = minMapType & {
  children: string[];
  deleted: boolean;
  level: number;
  value: string;
}

export type DbMapType = {
  [key: string]: DbMapItemType;
}

export type CacheMapItemType = DbMapItemType & {
  allChildren: string[];
}

export type CacheMapType = {
  [key: string]: CacheMapItemType;
}
