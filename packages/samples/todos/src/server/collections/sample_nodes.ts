import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'sample_nodes',
  fields: [
    {
      type: 'belongsTo',
      name: 'schema',
      target: 'uiSchemas',
      foreignKey: 'schemaId',
    },
  ],
});
