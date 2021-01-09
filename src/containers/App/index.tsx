// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { CacheMapType } from 'types/mapTypes';
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

  console.log('cacheData', cacheData);

  /*
  При добавлении ноды в кэш нужно проверить другие ноды, уже содержащиеся в кэше,
  являются ли они родителями или потомками новой ноды.
  Непосредственную связь мы отразим в дизайне, а дальнюю связь просто запомним.
   */
  const addNodeToCache = useCallback((node: TreeNodeDatum) => {
    console.log('addNodeToCache', node);
    const { id } = node as unknown as DbTreeType;

    if (Object.values(cacheMap).length) {
      console.log('check');
    } else {
      const newCacheMap: CacheMapType = {};

      newCacheMap[id] = {
        allChildren: [],
        children: [],
        deleted: node.attributes && node.attributes.deleted === 'true',
        parentId: null
      };
      setCacheMap(newCacheMap);
    }
  }, [cacheMap, setCacheMap]);

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
