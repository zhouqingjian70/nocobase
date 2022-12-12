import {
  CollectionManagerContext,
  registerField,
  SchemaComponentOptions,
  SchemaInitializerContext
} from '@nocobase/client';
import React, { useContext } from 'react';
import { CustomField, SnapshotBlockInitializers, SnapshotBlockProvider, useSnapshotFormBlockProps } from './components';
import { customField } from './customField';

registerField(customField.group, 'customField', customField);

export default React.memo((props) => {
  const ctx = useContext(CollectionManagerContext);
  const value = useContext(SchemaInitializerContext);
  return (
    <SchemaInitializerContext.Provider value={{ ...value, SnapshotBlockInitializers }}>
      <SchemaComponentOptions scope={{ useSnapshotFormBlockProps }} components={{ CustomField, SnapshotBlockProvider }}>
        <CollectionManagerContext.Provider value={{ ...ctx, interfaces: { ...ctx.interfaces, customField } }}>
          {props.children}
        </CollectionManagerContext.Provider>
      </SchemaComponentOptions>
    </SchemaInitializerContext.Provider>
  );
});
