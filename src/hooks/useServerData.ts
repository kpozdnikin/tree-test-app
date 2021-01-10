// Copyright 2020 @kpozdnikin
import { DbTreeType, DbTreeTypeAdditional } from 'types/treeTypes';
import { DbMapItemType, DbMapType } from 'types/mapTypes';

import { useCallback, useEffect, useState } from 'react';
import { dbTree } from 'mocks/dbTree';

interface ClientDataInterface {
  dbData: DbTreeType;
  dbMap: DbMapType;
}

const useServerData = (): ClientDataInterface => {
  const [dbData] = useState<DbTreeType>(dbTree);
  const [dbMap, setDbMap] = useState<DbMapType>({});

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

    bfs((item) => {
      newCacheMap[item.id] = newItem(item);
    });

    // @todo - если дерево широкое - используем обход в глубину
    /* dfs((item) => {
      newCacheMap[item.id] = newItem(item);
    }); */

    setDbMap(newCacheMap);
  }, [bfs, newItem]);

  useEffect(() => {
    rebuildCacheData();
  }, [rebuildCacheData]);

  // console.log('dbMap', dbMap);

  return {
    dbData,
    dbMap
  };
};

export default useServerData;
