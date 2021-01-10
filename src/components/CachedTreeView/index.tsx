// Copyright 2020 @kpozdnikin
import { CacheTreeType } from 'types/treeTypes';

import React, { FC, memo, useCallback, useState } from 'react';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Tree from 'antd/lib/tree';
import Button from 'antd/lib/button';

import './styles.less';

interface CachedTreeViewProps {
  applyChanges: () => void;
  cacheData: CacheTreeType[];
  deleteTreeNode: (key: string) => void;
  resetChanges: () => void;
  somethingChanged: boolean;
  setSomethingChanged: (changed: boolean) => void;
  updateTreeNodeName: (key: string, value: string) => void;
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
  const { applyChanges, cacheData, deleteTreeNode, resetChanges, setSomethingChanged, somethingChanged, updateTreeNodeName } = props;
  const [selectedNode, setSelectedNode] = useState<CacheTreeType>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);

  const clearSelected = useCallback(() => {
    setSelectedNode(undefined);
    setSelectedKeys([]);
    setEditMode(false);
  }, []);

  const onSelectNode = useCallback((keys: React.Key[], info: InfoType) => {
    clearSelected();
    setSelectedNode(info.node);
    const { key } = info.node as CacheTreeType;

    setSelectedKeys([key]);
  }, [clearSelected]);

  const onValueChange = useCallback((values: { value: string }) => {
    if (selectedNode) {
      updateTreeNodeName(selectedNode.key, values.value);
    }

    clearSelected();
    setSomethingChanged(true);
  }, [clearSelected, setSomethingChanged, selectedNode, updateTreeNodeName]);

  const onToggleEditMode = useCallback(() => {
    setEditMode((prevState) => !prevState);
  }, []);

  const onDeleteTreeNode = useCallback(() => {
    if (selectedNode) {
      deleteTreeNode(selectedNode.key);
    }

    setSomethingChanged(true);
  }, [deleteTreeNode, setSomethingChanged, selectedNode]);

  const onApplyChanges = useCallback(() => {
    applyChanges();
    setSomethingChanged(false);
  }, [applyChanges, setSomethingChanged]);

  const onResetChanges = useCallback(() => {
    resetChanges();
    setSomethingChanged(false);
  }, [resetChanges, setSomethingChanged]);

  console.log('cacheData', cacheData);

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
        <Form
          initialValues={{ value: selectedNode.title }}
          name='setValue'
          onFinish={onValueChange}
        >
          <Form.Item name='value'>
            <Input />
          </Form.Item>
          <Button
            htmlType='submit'
          >
            Submit
          </Button>
        </Form>
      )}
      <div className='button-group'>
        <Button disabled={!selectedNode}>+</Button>
        <Button
          disabled={!selectedNode}
          onClick={onDeleteTreeNode}
        >
          -
        </Button>
        <Button
          disabled={!selectedNode}
          onClick={onToggleEditMode}
        >
          a
        </Button>
        <Button
          disabled={!somethingChanged}
          onClick={onApplyChanges}
        >
          Apply
        </Button>
        <Button
          disabled={!somethingChanged}
          onClick={onResetChanges}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default memo(CachedTreeView);
