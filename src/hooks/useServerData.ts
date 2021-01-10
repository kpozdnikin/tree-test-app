// Copyright 2020 @kpozdnikin
import { DbTreeType, DbTreeTypeAdditional } from 'types/treeTypes';
import { DbMapItemType, DbMapType } from 'types/mapTypes';

import { useCallback, useEffect, useState } from 'react';

interface ClientDataInterface {
  dbData: DbTreeType;
  dbMap: DbMapType;
  maxKey: number;
  rebuildDbTreeByDbMap: (dbMap: DbMapType) => void;
  setDbMap: (dbMap: DbMapType) => void;
}

const useServerData = (dbTree: DbTreeType): ClientDataInterface => {
  const [dbData, setDbData] = useState<DbTreeType>(dbTree);
  const [dbMap, setDbMap] = useState<DbMapType>({});
  const [maxKey, setMaxKey] = useState<number>(0);
  const [rootKey] = useState<string>(dbTree.id);

  const newItem = useCallback((dbItem: DbTreeTypeAdditional): DbMapItemType => {
    return {
      children: dbItem.children.map((child: DbTreeType) => child.id),
      deleted: dbItem.attributes.deleted === 'true',
      id: dbItem.id,
      level: dbItem.level,
      parentId: dbItem.parentId,
      value: dbItem.attributes.value
    };
  }, []);

  // обход в глубину
  /* const dfs = useCallback((callback: (item: DbTreeTypeAdditional) => void) => {
    recursion({
      ...dbData,
      level: 0,
      parentId: null
    });

    function recursion (node: DbTreeTypeAdditional) {
      for (let i = 0; i < node.children.length; i++) {
        recursion({
          ...node.children[i],
          level: node.level + 1,
          parentId: node.id
        });
      }

      callback(node);
    }
  }, [dbData]); */

  // обход в ширину
  const bfs = useCallback((callback: (item: DbTreeTypeAdditional) => void) => {
    const queue: Array<DbTreeTypeAdditional> = [];

    queue.push({
      ...dbData,
      level: 0,
      parentId: null
    });

    let currentTree: DbTreeTypeAdditional | undefined = queue.shift();

    while (currentTree) {
      for (let i = 0; i < currentTree.children.length; i++) {
        queue.push({
          ...currentTree.children[i],
          level: currentTree.level + 1,
          parentId: currentTree.id
        });
      }

      callback(currentTree);

      currentTree = queue.shift();
    }
  }, [dbData]);

  const rebuildCacheData = useCallback(() => {
    const newCacheMap: DbMapType = {};
    let newMaxKey = maxKey;
    let prevMaxKey = maxKey;
    // если дерево глубокое - используем обход в ширину

    bfs((item) => {
      newMaxKey = parseInt(item.id.replace('node', ''), 10);

      if (newMaxKey > prevMaxKey) {
        prevMaxKey = newMaxKey;
      }

      newCacheMap[item.id] = newItem(item);
    });

    // @todo - если дерево широкое - используем обход в глубину
    /* dfs((item) => {
      newCacheMap[item.id] = newItem(item);
    }); */

    setMaxKey(prevMaxKey);

    setDbMap(newCacheMap);
  }, [bfs, maxKey, newItem]);

  const fillDbByMap = useCallback((newDbMap: DbMapType, key: string): DbTreeType => {
    return {
      attributes: {
        deleted: newDbMap[key].deleted.toString(),
        value: newDbMap[key].value
      },
      children: newDbMap[key].children.map((childId: string) => fillDbByMap(newDbMap, childId)),
      id: key,
      name: newDbMap[key].value
    };
  }, []);

  const rebuildDbTreeByDbMap = useCallback((newDbMap: DbMapType) => {
    const newDbData: DbTreeType = fillDbByMap(newDbMap, rootKey);

    setDbData(newDbData);
  }, [fillDbByMap, rootKey]);

  useEffect(() => {
    rebuildCacheData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dbData,
    dbMap,
    maxKey,
    rebuildDbTreeByDbMap,
    setDbMap
  };
};

export default useServerData;
