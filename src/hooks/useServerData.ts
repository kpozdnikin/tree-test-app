// Copyright 2020 @kpozdnikin
import { DbTreeType, DbTreeTypeAdditional } from 'types/treeTypes';
import { DbMapItemType, DbMapType } from 'types/mapTypes';

import { useCallback, useEffect, useState } from 'react';
import { dbTree } from 'mocks/dbTree';

interface ClientDataInterface {
  dbData: DbTreeType;
}

const useServerData = (): ClientDataInterface => {
  const [dbData] = useState<DbTreeType>(dbTree);
  const [cacheMap, setCacheMap] = useState<DbMapType>({});

  const newItem = useCallback((dbItem: DbTreeTypeAdditional): DbMapItemType => {
    return {
      children: dbItem.children.map((child: DbTreeType) => child.id),
      level: dbItem.level,
      parentId: dbItem.parentId,
      value: dbItem.attributes.value
    };
  }, []);

  // обход в глубину
  const dfs = useCallback((callback: (item: DbTreeTypeAdditional) => void) => {
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
  }, [dbData]);

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
    // если дерево глубокое - используем обход в ширину
    // @todo - если дерево широкое - используем обход в глубину

    bfs((item) => {
      newCacheMap[item.id] = newItem(item);
    });

    /* dfs((item) => {
      newCacheMap[item.id] = newItem(item);
    }); */

    setCacheMap(newCacheMap);
  }, [bfs, newItem]);

  useEffect(() => {
    rebuildCacheData();
  }, [rebuildCacheData]);

  console.log('cacheMap', cacheMap);

  return {
    dbData
  };
};

export default useServerData;
