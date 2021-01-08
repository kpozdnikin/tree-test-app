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

export interface DbTreeTypeAdditional extends DbTreeType {
  level: number;
  parentId: string | null;
}
