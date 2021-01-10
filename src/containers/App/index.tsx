// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { CacheMapType, CacheMapItemType, DbMapItemType, minMapType } from 'types/mapTypes';
import { TreeNodeDatum } from 'react-d3-tree/lib/types/common';

import React, { FC, memo, useCallback, useState } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';
import useClientData from 'hooks/useClientData';
import useServerData from 'hooks/useServerData';

import './styles.less';

const App: FC = () => {
  const { dbData, dbMap } = useServerData();
  const { cacheData, cacheMap, deleteCacheTreeNode, rebuilding, setCacheMap, updateCacheTreeNodeName } = useClientData();
  const [somethingChanged, setSomethingChanged] = useState<boolean>(false);

  // console.log('cacheMap', cacheMap);

  const findNodeInParents = useCallback((dbMapNode: DbMapItemType, cacheMapNode: CacheMapItemType): number | null => {
    let difference = 0;

    if (dbMapNode.level > cacheMapNode.level) {
      difference = dbMapNode.level - cacheMapNode.level;
      const targetNumber = isParent(cacheMapNode, dbMapNode, 1);

      return targetNumber === null ? targetNumber : -targetNumber;
    } else if (dbMapNode.level < cacheMapNode.level) {
      difference = cacheMapNode.level - dbMapNode.level;

      return isParent(dbMapNode, cacheMapNode, 1);
    }

    return null;

    function isParent (highNode: minMapType, lowNode: minMapType, index: number): number | null {
      if (lowNode.parentId === highNode.id) {
        return index;
      }

      if (index > difference) {
        return null;
      }

      if (lowNode.parentId && dbMap[lowNode.parentId]) {
        return isParent(highNode, dbMap[lowNode.parentId], index + 1);
      }

      return null;
    }
  }, [dbMap]);

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
    const newCacheMap: CacheMapType = { ...cacheMap };

    if (Object.values(cacheMap).length) {
      Object.keys(cacheMap).forEach((cacheMapId) => {
        const status = findNodeInParents(dbMapNode, newCacheMap[cacheMapId]);

        if (status !== null) {
          if (status > 0) {
            allChildren.push(cacheMapId);

            if (status === 1) {
              children.push(cacheMapId);
            }
          } else {
            newCacheMap[cacheMapId].allChildren.push(id);

            if (status === -1) {
              newCacheMap[cacheMapId].children.push(id);
            }
          }
        }
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
    setSomethingChanged(true);
  }, [cacheMap, dbMap, findNodeInParents, setCacheMap, setSomethingChanged]);

  const applyChangesToDb = useCallback(() => {
    console.log('applyChangesToDb');
  }, []);

  const resetChangesFromDb = useCallback(() => {
    console.log('resetChangesFromDb');
    setCacheMap({});
  }, [setCacheMap]);

  // console.log('cacheData', cacheData, 'rebuilding', rebuilding);

  return (
    <div className='App'>
      <h1>You can scroll to zoom left (DB) tree by mouse wheel or drug it</h1>
      <div className='content'>
        <DBTreeView
          addNodeToCache={addNodeToCache}
          dbData={dbData}
        />
        <CachedTreeView
          applyChanges={applyChangesToDb}
          cacheData={cacheData}
          deleteTreeNode={deleteCacheTreeNode}
          resetChanges={resetChangesFromDb}
          setSomethingChanged={setSomethingChanged}
          somethingChanged={somethingChanged}
          updateTreeNodeName={updateCacheTreeNodeName}
        />
      </div>
    </div>
  );
};

export default memo(App);
