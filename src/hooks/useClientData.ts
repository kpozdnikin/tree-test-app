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
  const [rebuilding, setRebuilding] = useState<boolean>(true);

  const addItemToTheThree = useCallback((cacheItemId: string, children: CacheTreeType[], alreadyAdded: {[key: string]: boolean}) => {
    if (cacheMap[cacheItemId].deleted || alreadyAdded[cacheItemId]) {
      return;
    }

    const newCacheTreeItem: CacheTreeType = {
      children: [],
      isLeaf: true,
      key: cacheItemId,
      title: cacheMap[cacheItemId].value
    };

    if (cacheMap[cacheItemId].children.length) {
      cacheMap[cacheItemId].children.forEach((childId) => addItemToTheThree(childId, newCacheTreeItem.children, alreadyAdded));
    }

    children.push(newCacheTreeItem);
    alreadyAdded[cacheItemId] = true;
  }, [cacheMap]);

  const rebuildCacheData = useCallback(() => {
    setRebuilding(true);
    const newCacheData: CacheTreeType[] = [];
    const alreadyAdded: {[key: string]: boolean} = {};

    Object.keys(cacheMap).forEach((cacheItemId) => {
      const cacheItemParent = cacheMap[cacheItemId].parentId;

      if (!cacheItemParent || !cacheMap[cacheItemParent]) {
        addItemToTheThree(cacheItemId, newCacheData, alreadyAdded);
      }
    });
    setCacheData(newCacheData);
    setTimeout(() => {
      setRebuilding(false);
    });
  }, [addItemToTheThree, cacheMap]);

  const updateCacheTreeNodeName = useCallback((key: string, value: string) => {
    setCacheMap((prevCacheMap) => ({
      ...prevCacheMap,
      [key]: {
        ...prevCacheMap[key],
        value
      }
    }));
  }, []);

  const deleteCacheTreeNode = useCallback((key: string) => {
    setCacheMap((prevCacheMap) => {
      const newCacheMap = { ...prevCacheMap };

      newCacheMap[key].deleted = true;
      newCacheMap[key].allChildren.forEach((childId) => {
        newCacheMap[childId].deleted = true;
      });

      return newCacheMap;
    });
  }, []);

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
