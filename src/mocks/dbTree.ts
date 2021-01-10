// Copyright 2020 @kpozdnikin

import { DbTreeType } from 'types/treeTypes';

export const dbTree: DbTreeType = {
  attributes: {
    deleted: 'false',
    value: 'Root'
  },
  children: [
    {
      attributes: {
        deleted: 'false',
        value: 'Node1'
      },
      children: [
        {
          attributes: {
            deleted: 'false',
            value: 'Node2'
          },
          children: [
            {
              attributes: {
                deleted: 'false',
                value: 'Node4'
              },
              children: [
                {
                  attributes: {
                    deleted: 'false',
                    value: 'Node7'
                  },
                  children: [
                    {
                      attributes: {
                        deleted: 'false',
                        value: 'Node9'
                      },
                      children: [],
                      id: 'node9',
                      name: 'Node9'
                    }
                  ],
                  id: 'node7',
                  name: 'Node7'
                },
                {
                  attributes: {
                    deleted: 'false',
                    value: 'Node8'
                  },
                  children: [
                    {
                      attributes: {
                        deleted: 'false',
                        value: 'Node10'
                      },
                      children: [],
                      id: 'node10',
                      name: 'Node10'
                    }
                  ],
                  id: 'node8',
                  name: 'Node8'
                }
              ],
              id: 'node4',
              name: 'Node4'
            }
          ],
          id: 'node2',
          name: 'Node2'
        },
        {
          attributes: {
            deleted: 'false',
            value: 'Node3'
          },
          children: [
            {
              attributes: {
                deleted: 'false',
                value: 'Node5'
              },
              children: [
                {
                  attributes: {
                    deleted: 'false',
                    value: 'Node6'
                  },
                  children: [
                    {
                      attributes: {
                        deleted: 'false',
                        value: 'Node15'
                      },
                      children: [],
                      id: 'node15',
                      name: 'Node15'
                    }
                  ],
                  id: 'node6',
                  name: 'Node6'
                }
              ],
              id: 'node5',
              name: 'Node5'
            }
          ],
          id: 'node3',
          name: 'Node3'
        },
        {
          attributes: {
            deleted: 'false',
            value: 'Node11'
          },
          children: [
            {
              attributes: {
                deleted: 'false',
                value: 'Node12'
              },
              children: [
                {
                  attributes: {
                    deleted: 'false',
                    value: 'Node13'
                  },
                  children: [
                    {
                      attributes: {
                        deleted: 'false',
                        value: 'Node14'
                      },
                      children: [],
                      id: 'node14',
                      name: 'Node14'
                    }
                  ],
                  id: 'node13',
                  name: 'Node13'
                }
              ],
              id: 'node12',
              name: 'Node12'
            }
          ],
          id: 'node11',
          name: 'Node11'
        }
      ],
      id: 'node1',
      name: 'Node1'
    }
  ],
  id: 'root',
  name: 'Root'
};
