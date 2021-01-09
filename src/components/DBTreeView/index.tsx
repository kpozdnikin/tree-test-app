// Copyright 2020 @kpozdnikin
import { DbTreeType } from 'types/treeTypes';
import { CustomNodeElementProps, TreeNodeDatum } from 'react-d3-tree/lib/types/common';

import React, { FC, memo, useCallback } from 'react';
import Tree from 'react-d3-tree';

import './styles.less';

interface DbTreeViewProps {
  addNodeToCache: (node: TreeNodeDatum) => void;
  dbData: DbTreeType;
}

const DBTreeView: FC<DbTreeViewProps> = (props) => {
  const { addNodeToCache, dbData } = props;

  const onNodeClick = useCallback((node: TreeNodeDatum) => {
    if (node.attributes && node.attributes.deleted === 'true') {
      if (confirm('Вы хотите добавить удаленную ноду? Ее нельзя будет изменить.')) {
        addNodeToCache(node);
      }
    } else {
      addNodeToCache(node);
    }
  }, [addNodeToCache]);

  const renderRectSvgNode = useCallback(({ nodeDatum }: CustomNodeElementProps) => (
    <g
      className={nodeDatum.attributes && nodeDatum.attributes.deleted === 'true' ? 'tree-node disabled' : 'tree-node'}
      onClick={onNodeClick.bind(null, nodeDatum)}
    >
      <circle
        r='15'
      />
      <g className='rd3t-label'>
        <text
          className='rd3t-label__title'
          textAnchor='start'
          x='40'
        >
          {nodeDatum.name}
        </text>
        <text className='rd3t-label__attributes'>
          <tspan dy='1.2em'
            x='40'>value: {nodeDatum.attributes?.value}</tspan>
        </text>
      </g>
    </g>
  ), [onNodeClick]);

  return (
    <div
      className='tree-wrapper'
      id='treeWrapper'
    >
      <h2>DB. Click on node to add it to the cache</h2>
      <Tree
        collapsible={false}
        data={dbData}
        onNodeClick={onNodeClick}
        orientation={'vertical'}
        pathFunc={'step'}
        renderCustomNodeElement={renderRectSvgNode}
        translate={{ x: 400, y: 50 }}
      />
    </div>
  );
};

export default memo(DBTreeView);
