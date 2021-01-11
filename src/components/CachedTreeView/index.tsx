// Copyright 2020 @kpozdnikin
import { CacheTreeType } from 'types/treeTypes';
import { CacheMapType } from 'types/mapTypes';

import React, { FC, memo, useCallback, useState } from 'react';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';

import './styles.less';

interface CachedTreeViewProps {
  addNewItem: (key: string) => void;
  applyChanges: () => void;
  cacheData: CacheTreeType[];
  cacheMap: CacheMapType;
  deleteTreeNode: (key: string) => void;
  resetChanges: () => void;
  somethingChanged: boolean;
  setSomethingChanged: (changed: boolean) => void;
  updateTreeNodeName: (key: string, value: string) => void;
}

/*
Мы отражаем только непосредственную связь между нодами, поэтому,
поскольку мы не знаем, есть ли какая-то не непосредственная связь между нашими нодами,
мы должны перестраивать дерево каждый раз, когда мы добавляем новую ноду из базы данных.

Мы должны хранить информацию о том, какие потомки у ноды (не непосредственные) находятся так же в кэше.
 */

const CachedTreeView: FC<CachedTreeViewProps> = (props) => {
  const {
    addNewItem,
    applyChanges,
    cacheData,
    cacheMap,
    deleteTreeNode,
    resetChanges,
    setSomethingChanged,
    somethingChanged,
    updateTreeNodeName
  } = props;
  const [selectedNode, setSelectedNode] = useState<CacheTreeType>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const clearSelected = useCallback(() => {
    setSelectedNode(undefined);
    setEditMode(false);
  }, []);

  const onSelectNode = useCallback((node: CacheTreeType, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    clearSelected();
    setSelectedNode(node);
  }, [clearSelected]);

  const onValueChange = useCallback((values: { value: string }) => {
    selectedNode && updateTreeNodeName(selectedNode.key, values.value);
    clearSelected();
    setSomethingChanged(true);
  }, [clearSelected, setSomethingChanged, selectedNode, updateTreeNodeName]);

  const onToggleEditMode = useCallback(() => {
    setEditMode((prevState) => !prevState);
  }, []);

  const onDeleteTreeNode = useCallback(() => {
    selectedNode && deleteTreeNode(selectedNode.key);
    setSomethingChanged(true);
  }, [deleteTreeNode, setSomethingChanged, selectedNode]);

  const onApplyChanges = useCallback(() => {
    applyChanges();
    setSomethingChanged(false);
    clearSelected();
  }, [applyChanges, clearSelected, setSomethingChanged]);

  const onResetChanges = useCallback(() => {
    resetChanges();
    setSomethingChanged(false);
    clearSelected();
  }, [clearSelected, resetChanges, setSomethingChanged]);

  const onAddNewItem = useCallback(() => {
    selectedNode && addNewItem(selectedNode.key);
    setSomethingChanged(true);
  }, [addNewItem, selectedNode, setSomethingChanged]);

  const renderChild = useCallback((items: CacheTreeType[]) => {
    return (
      <>
        { items.map((item) => (
          <div
            className={`${cacheMap[item.key] && cacheMap[item.key].deleted ? 'tree-node disabled' : selectedNode && item.key === selectedNode.key ? 'tree-node selected' : 'tree-node'}`}
            key={item.key}
            onClick={(e) => onSelectNode(item, e)}
          >
            {item.title}
            { item.children.length > 0 && (
              renderChild(item.children)
            )}
          </div>
        ))}
      </>
    );
  }, [cacheMap, onSelectNode, selectedNode]);

  return (
    <div className='cached-tree-view'>
      <h2>Cache</h2>
      {renderChild(cacheData)}
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
        <Button
          disabled={!selectedNode || !Object.keys(cacheData).length}
          onClick={onAddNewItem}
        >
          +
        </Button>
        <Button
          disabled={!selectedNode || !Object.keys(cacheData).length}
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
          onClick={onResetChanges}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default memo(CachedTreeView);
