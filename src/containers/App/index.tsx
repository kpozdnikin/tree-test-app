// Copyright 2020 @kpozdnikin
import { DbTreeType, CacheTreeType } from 'types/treeTypes';
import { dbTree } from 'mocks/dbTree';
import { cacheTree } from 'mocks/cacheTree';

import React, { FC, memo, useState } from 'react';

import DBTreeView from 'components/DBTreeView';
import CachedTreeView from 'components/CachedTreeView';

import './styles.less';

const App: FC = () => {
  const [dbData] = useState<DbTreeType>(dbTree);
  const [cacheData] = useState<CacheTreeType[]>(cacheTree);

  return (
    <div className='App'>
      <h1>You can scroll to zoom left (DB) tree by mouse wheel or drug it</h1>
      <div className='content'>
        <DBTreeView dbData={dbData} />
        <CachedTreeView cacheData={cacheData} />
      </div>
    </div>
  );
};

export default memo(App);
