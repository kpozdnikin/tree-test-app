// Copyright 2020 @kpozdnikin

import { DbTreeType } from 'types/treeTypes';

export const dbTree: DbTreeType = {
  attributes: {
    value: 'Root'
  },
  children: [
    {
      attributes: {
        value: 'Node1'
      },
      children: [
        {
          attributes: {
            value: 'Node2'
          },
          children: [
            {
              attributes: {
                value: 'Node4'
              },
              children: [],
              id: 'node4',
              name: 'Node4'
            }
          ],
          id: 'node2',
          name: 'Node2'
        },
        {
          attributes: {
            value: 'Node3'
          },
          children: [
            {
              attributes: {
                value: 'Node5'
              },
              children: [],
              id: 'node5',
              name: 'Node5'
            }
          ],
          id: 'node3',
          name: 'Node3'
        }
      ],
      id: 'node1',
      name: 'Node1'
    }
  ],
  id: 'root',
  name: 'Root'
};
