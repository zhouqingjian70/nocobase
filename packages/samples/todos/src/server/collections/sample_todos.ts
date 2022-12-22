import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'sample_todos',
  fields: [
    {
      type: 'belongsTo',
      name: 'node',
      target: 'sample_nodes',
      foreignKey: 'nodeId',
    },
  ],
});
