import { GeneralSchemaDesigner, SchemaSettings } from '@nocobase/client';
import React from 'react';

export const TodosDesigner = () => {
  return (
    <GeneralSchemaDesigner>
      <SchemaSettings.Remove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};
