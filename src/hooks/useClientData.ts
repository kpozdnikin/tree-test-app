// Copyright 2020 @kpozdnikin
import { CacheTreeType } from 'types/treeTypes';
import { CacheMapType } from 'types/mapTypes';

import { useCallback, useEffect, useState } from 'react';

import { cacheTree } from 'mocks/cacheTree';

interface ClientDataInterface {
  cacheData: CacheTreeType[];
  cacheMap: CacheMapType;
  deleteCacheTreeNode: (key: string) => void;
  rebuilding: boolean;
  setCacheMap: (cacheMap: CacheMapType) => void;
  updateCacheTreeNodeName: (key: string, value: string) => void;
}

const useClientData = (): ClientDataInterface => {
  const [cacheData, setCacheData] = useState<CacheTreeType[]>(cacheTree);
  const [cacheMap, setCacheMap] = useState<CacheMapType>({});
  const [rebuilding, setRebuilding] = useState<boolean>(false);

  const addItemToTheThree = useCallback((cacheItemId: string, children: CacheTreeType[]) => {
    if (cacheMap[cacheItemId].deleted) {
      return;
    }

    const newCacheTreeItem: CacheTreeType = {
      children: [],
      isLeaf: true,
      key: cacheItemId,
      title: cacheMap[cacheItemId].value
    };

    if (cacheMap[cacheItemId].children.length) {
      cacheMap[cacheItemId].children.forEach((childId) => addItemToTheThree(childId, newCacheTreeItem.children));
    }

    children.push(newCacheTreeItem);
  }, [cacheMap]);

  const rebuildCacheData = useCallback(() => {
    setRebuilding(true);
    const newCacheData: CacheTreeType[] = [];

    Object.keys(cacheMap).forEach((cacheItemId) => {
      const cacheItemParent = cacheMap[cacheItemId].parentId;

      console.log('cacheMap[cacheItemId]', cacheMap[cacheItemId]);

      if (!cacheItemParent || !cacheMap[cacheItemParent]) {
        addItemToTheThree(cacheItemId, newCacheData);
      }
    });

    setCacheData(newCacheData);
    setTimeout(() => {
      setRebuilding(false);
    }, 100);
  }, [addItemToTheThree, cacheMap]);

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

  useEffect(() => {
    rebuildCacheData();
  }, [cacheMap, rebuildCacheData]);

  return {
    cacheData,
    cacheMap,
    deleteCacheTreeNode,
    rebuilding,
    setCacheMap,
    updateCacheTreeNodeName
  };
};

export default useClientData;
