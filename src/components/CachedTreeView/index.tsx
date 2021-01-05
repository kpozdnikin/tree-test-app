// Copyright 2020 @kpozdnikin
import { CacheTreeType } from 'types/treeTypes';

import React, { FC, memo, useCallback, useState } from 'react';
import { Input } from 'antd';

import Tree from 'antd/lib/tree';
import Button from 'antd/lib/button';

import './styles.less';

interface CachedTreeViewProps {
  cacheData: CacheTreeType[];
}

type InfoType = {
  event: 'select';
  node: any;
  selected: boolean;
}

/*
Мы отражаем только непосредственную связь между нодами, поэтому,
поскольку мы не знаем, есть ли какая-то не непосредственная связь между нашими нодами,
мы должны перестраивать дерево каждый раз, когда мы добавляем новую ноду из базы данных.

Мы должны хранить информацию о том, какие потомки у ноды (не непосредственные) находятся так же в кэше.
 */

const CachedTreeView: FC<CachedTreeViewProps> = (props) => {
  const { cacheData } = props;
  const [selectedNode, setSelectedNode] = useState<CacheTreeType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);

  const clearSelected = useCallback(() => {
    setSelectedNode(undefined);
    setSelectedKeys([]);
    setEditMode(false);
  }, []);

  const onSelectNode = useCallback((keys: React.Key[], info: InfoType) => {
    console.log('Trigger Select', info.node);
    clearSelected();
    setSelectedNode(info.node);
    const { key } = info.node as CacheTreeType;

    setSelectedKeys([key]);
  }, [clearSelected]);

  const onValueChange = useCallback((values) => {
    console.log('onValueChange', values);
    clearSelected();
  }, [clearSelected]);

  const onToggleEditMode = useCallback(() => {
    setEditMode((prevState) => !prevState);
  }, []);

  return (
    <div className='cached-tree-view'>
      <h2>Cache</h2>
      <Tree
        defaultExpandAll
        multiple
        onSelect={onSelectNode}
        selectedKeys={selectedKeys}
        showIcon
        treeData={cacheData}
      />
      { selectedNode && editMode && (
        <form onSubmit={onValueChange}>
          <Input
            defaultValue={selectedNode.title}
            name='value'
          />
          <Button
            htmlType='submit'
          >
            Submit
          </Button>
        </form>
      )}
      <div className='button-group'>
        <Button disabled={!selectedNode}>+</Button>
        <Button disabled={!selectedNode}>-</Button>
        <Button
          disabled={!selectedNode}
          onClick={onToggleEditMode}
        >
          a
        </Button>
        <Button>Apply</Button>
        <Button>Reset</Button>
      </div>
    </div>
  );
};

export default memo(CachedTreeView);
