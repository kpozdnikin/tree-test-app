// Copyright 2020 @kpozdnikin
import { DbTreeType, CacheTreeType } from 'types/treeTypes';
import { dbTree } from 'mocks/dbTree';
import { cacheTree } from 'mocks/cacheTree';

import React, { FC, memo, useCallback, useState } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';

import './styles.less';

const App: FC = () => {
  const [dbData] = useState<DbTreeType>(dbTree);
  const [cacheData, setCacheData] = useState<CacheTreeType[]>(cacheTree);

  const setNodeValue = useCallback((list: CacheTreeType[], key: string, value: string): CacheTreeType[] => {
    return list.map((node) => {
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
      } else {
        return {
          ...node
        };
      }
    });
  }, []);

  const updateTreeData = useCallback((key: string, value: string) => {
    setCacheData(setNodeValue(cacheData, key, value));
  }, [cacheData, setNodeValue]);

  return (
    <div className='App'>
      <h1>You can scroll to zoom left (DB) tree by mouse wheel or drug it</h1>
      <div className='content'>
        <DBTreeView dbData={dbData} />
        <CachedTreeView
          cacheData={cacheData}
          updateTreeData={updateTreeData}
        />
      </div>
    </div>
  );
};

export default memo(App);
