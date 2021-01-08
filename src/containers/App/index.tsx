// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { dbTree } from 'mocks/dbTree';

import React, { FC, memo, useState } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';
import useClientData from 'hooks/useClientData';

import './styles.less';

const App: FC = () => {
  const [dbData] = useState<DbTreeType>(dbTree);
  const { cacheData, deleteCacheTreeNode, updateCacheTreeNodeName } = useClientData();

  console.log('cacheData', cacheData);

  return (
    <div className='App'>
      <h1>You can scroll to zoom left (DB) tree by mouse wheel or drug it</h1>
      <div className='content'>
        <DBTreeView dbData={dbData} />
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
