// Copyright 2020 @kpozdnikin
import { CacheTreeType } from 'types/treeTypes';
import React from 'react';

import { StopOutlined } from '@ant-design/icons';

export const cacheTree: CacheTreeType[] = [
  {
    children: [
      {
        children: [],
        icon: <StopOutlined />,
        isLeaf: true,
        key: '0-0-0',
        title: 'leaf 0-0'
      },
      {
        children: [],
        isLeaf: true,
        key: '0-0-1',
        title: 'leaf 0-1'
      }
    ],
    isLeaf: true,
    key: 'node1',
    title: 'Node1'
  },
  {
    children: [
      {
        children: [],
        isLeaf: true,
        key: '0-1-0',
        title: 'leaf 1-0'
      },
      {
        children: [],
        isLeaf: true,
        key: '0-1-1',
        title: 'leaf 1-1'
      }
    ],
    isLeaf: true,
    key: 'node2',
    title: 'Node1'
  }
];
