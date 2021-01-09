// Copyright 2020 @kpozdnikin

import { useCallback, useState } from 'react';
import { CacheTreeType } from 'types/treeTypes';
import { CacheMapItemType } from 'types/mapTypes';
import { cacheTree } from '../mocks/cacheTree';

interface ClientDataInterface {
  cacheData: CacheTreeType[];
  cacheMap: CacheMapType;
  deleteCacheTreeNode: (key: string) => void;
  setCacheMap: (cacheMap: CacheMapType) => void;
  updateCacheTreeNodeName: (key: string, value: string) => void;
}

type CacheMapType = {
  [key: string]: CacheMapItemType;
}

const useClientData = (): ClientDataInterface => {
  const [cacheData, setCacheData] = useState<CacheTreeType[]>(cacheTree);
  const [cacheMap, setCacheMap] = useState<CacheMapType>({});

  const rebuildCacheData = useCallback(() => {
    console.log('rebuildCacheData');
  }, []);

  const setNodeValue = useCallback((list: CacheTreeType[], key: string, value: string): CacheTreeType[] => {
    return list.map((node: CacheTreeType) => {
      if (node.key === key) {
        return {
          ...node,
          title: value
        };
      } else if (node.children) {
        return {
          ...node,
          children: setNodeValue(node.children, key, value)
        };
      } else return node;
    });
  }, []);

  const deleteNode = useCallback((list: CacheTreeType[], key: string): CacheTreeType[] => {
    const newList = list.filter((node: CacheTreeType) => {
      if (node.key !== key) {
        if (node.children) {
          return {
            ...node,
            children: deleteNode(node.children, key)
          };
        } else return node;
      }
    });

    console.log('newList', newList, 'list', list);

    return newList;
  }, []);

  const updateCacheTreeNodeName = useCallback((key: string, value: string) => {
    setCacheData(setNodeValue(cacheData, key, value));
  }, [cacheData, setNodeValue]);

  const deleteCacheTreeNode = useCallback((key: string) => {
    console.log('deleteCacheTreeNode', key);
    setCacheData(deleteNode(cacheData, key));
  }, [cacheData, deleteNode]);

  return {
    cacheData,
    cacheMap,
    deleteCacheTreeNode,
    setCacheMap,
    updateCacheTreeNodeName
  };
};

export default useClientData;
