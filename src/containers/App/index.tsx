// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { CacheMapType, CacheMapItemType, DbMapItemType, minMapType } from 'types/mapTypes';
import { TreeNodeDatum } from 'react-d3-tree/lib/types/common';

import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';
import useClientData from 'hooks/useClientData';
import useServerData from 'hooks/useServerData';
import { dbTree } from 'mocks/dbTree';

import './styles.less';

const App: FC = () => {
  const { dbData, dbMap, maxKey } = useServerData(dbTree);
  const { cacheData, cacheMap, deleteCacheTreeNode, rebuilding, setCacheMap, updateCacheTreeNodeName } = useClientData();
  const [somethingChanged, setSomethingChanged] = useState<boolean>(false);
  const [cacheMaxKey, setCacheMaxKey] = useState<number>(0);

  console.log('cacheMap', cacheMap);

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

  const addNewNodeToCache = useCallback((key: string) => {
    console.log('addNewNodeToCache');
    // 1. Generate new key
    const newKey = `node${cacheMaxKey + 1}`;
    // 2. add new key to children of parent where adding new element
    // 3. Add new element
    const newCacheMap = { ...cacheMap };

    newCacheMap[key].allChildren = [...newCacheMap[key].allChildren, newKey];
    newCacheMap[key].children = [...newCacheMap[key].children, newKey];
    newCacheMap[newKey] = {
      allChildren: [],
      children: [],
      deleted: false,
      id: newKey,
      level: cacheMap[key].level + 1,
      parentId: key,
      value: `Node${cacheMaxKey + 1}`
    };

    setCacheMap(newCacheMap);
    // 4. Save new key index
    setCacheMaxKey(cacheMaxKey + 1);
  }, [cacheMap, cacheMaxKey, setCacheMap]);

  useEffect(() => {
    setCacheMaxKey(maxKey);
  }, [maxKey]);

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
          addNewItem={addNewNodeToCache}
          applyChanges={applyChangesToDb}
          cacheData={cacheData}
          deleteTreeNode={deleteCacheTreeNode}
          rebuilding={rebuilding}
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
