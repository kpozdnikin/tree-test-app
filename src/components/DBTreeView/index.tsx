// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';

import React, { FC, memo, useCallback } from 'react';
import Tree from 'react-d3-tree';

import './styles.less';

interface DbTreeViewProps {
  dbData: DbTreeType;
}

const DBTreeView: FC<DbTreeViewProps> = (props) => {
  const { dbData } = props;

  const onNodeClick = useCallback(() => {
    console.log('onNodeClick');
  }, []);

  return (
    <div
      className='tree-wrapper'
      id='treeWrapper'
    >
      <h2>DB. Click on node to add it to the cache</h2>
      <Tree
        branchNodeClassName={'tree-node'}
        collapsible={false}
        data={dbData}
        leafNodeClassName={'tree-node'}
        onNodeClick={onNodeClick}
        orientation={'vertical'}
        pathFunc={'step'}
        rootNodeClassName={'tree-node'}
        translate={{ x: 400, y: 50 }}
      />
    </div>
  );
};

export default memo(DBTreeView);
