// Copyright 2020 @kpozdnikin

import React, { FC, memo } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';
import useClientData from 'hooks/useClientData';
import useServerData from 'hooks/useServerData';

import './styles.less';

const App: FC = () => {
  const { dbData } = useServerData();
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
