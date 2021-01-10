// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { CacheMapType, CacheMapItemType, DbMapItemType, minDbMapType, minMapType } from 'types/mapTypes';
import { TreeNodeDatum } from 'react-d3-tree/lib/types/common';

import React, { FC, memo, useCallback } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';
import useClientData from 'hooks/useClientData';
import useServerData from 'hooks/useServerData';

import './styles.less';

const App: FC = () => {
  const { dbData, dbMap } = useServerData();
  const { cacheData, cacheMap, deleteCacheTreeNode, setCacheMap, updateCacheTreeNodeName } = useClientData();

  console.log('cacheMap', cacheMap);

  const findNodeInParents = useCallback((dbMapNode: DbMapItemType, cacheMapNode: CacheMapItemType): number | null => {
    let difference = 0;

    if (dbMapNode.level > cacheMapNode.level) {
      difference = dbMapNode.level - cacheMapNode.level;
      const targetNumber = isParent(cacheMapNode, dbMapNode, cacheMap, dbMap, 0);

      return targetNumber === null ? targetNumber : -targetNumber;
    } else if (dbMapNode.level < cacheMapNode.level) {
      difference = cacheMapNode.level - dbMapNode.level;

      return isParent(dbMapNode, cacheMapNode, dbMap, cacheMap, 0);
    }

    return null;

    function isParent (highNode: minMapType, lowNode: minMapType, highDb: minDbMapType, lowDb: minDbMapType, index: number): number | null {
      if (lowNode.parentId === highNode.id) {
        return index;
      }

      if (index > difference) {
        return null;
      }

      if (lowNode.parentId && lowDb[lowNode.parentId]) {
        return isParent(highNode, lowDb[lowNode.parentId], highDb, lowDb, index + 1);
      }

      return null;
    }
  }, [cacheMap, dbMap]);

  /*
    При добавлении ноды в кэш нужно проверить другие ноды, уже содержащиеся в кэше,
    являются ли они родителями или потомками новой ноды.
    Непосредственную связь мы отразим в дизайне, а дальнюю связь просто запомним.
     */
  const addNodeToCache = useCallback((node: TreeNodeDatum) => {
    const { id } = node as unknown as DbTreeType;
    const dbMapNode = dbMap[id];
    const allChildren: string[] = [];
    const children: string[] = [];

    console.log('dbMapNode', dbMapNode, 'node', node);
    const newCacheMap: CacheMapType = { ...cacheMap };

    if (Object.values(cacheMap).length) {
      console.log('check');
      Object.keys(cacheMap).forEach((cacheMapId) => {
        const status = findNodeInParents(dbMapNode, newCacheMap[cacheMapId]);

        console.log('status', status);
        /* if (status !== null) {
          if (status > 0) {
            newCacheMap[cacheMapId].allChildren.push(id);
          } else {
            newCacheMap[cacheMapId].allChildren.push(id);
          }
        } */
      });
    }

    newCacheMap[id] = {
      allChildren,
      children,
      deleted: dbMapNode.deleted,
      id,
      level: dbMapNode.level,
      parentId: dbMapNode.parentId,
      value: dbMapNode.value
    };

    setCacheMap(newCacheMap);
  }, [cacheMap, dbMap, findNodeInParents, setCacheMap]);

  return (
    <div className='App'>
      <h1>You can scroll to zoom left (DB) tree by mouse wheel or drug it</h1>
      <div className='content'>
        <DBTreeView
          addNodeToCache={addNodeToCache}
          dbData={dbData}
        />
        <CachedTreeView
          cacheData={cacheData}
          deleteTreeNode={deleteCacheTreeNode}
          updateTreeNodeName={updateCacheTreeNodeName}
        />
      </div>
    </div>
  );
};

export default memo(App);
