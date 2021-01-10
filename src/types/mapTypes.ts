// Copyright 2020 @kpozdnikin

export type minMapType = {
  id: string;
  parentId: string | null;
}

export interface DbMapItemType extends minMapType {
  children: string[];
  deleted?: boolean;
  level: number;
  value: string;
}

export type minDbMapType = {
  [key: string]: minMapType;
}

export type DbMapType = {
  [key: string]: DbMapItemType;
}

export interface CacheMapItemType extends DbMapItemType {
  allChildren: string[];
}

export type CacheMapType = {
  [key: string]: CacheMapItemType;
}
