import { createForm } from '@formily/core';
import {
  CollectionManagerContext, registerField,
  SchemaComponentOptions,
  SchemaInitializerContext
} from '@nocobase/client';
import React, { useContext } from 'react';
import { CustomField, SnapshotBlockInitializers, SnapshotBlockProvider } from './components';
import { customField } from './customField';

const useSnapshotFormBlockProps = () => {
  const form = React.useMemo(
    () =>
      createForm({
        readPretty: true,
        initialValues: {
          id: 1111,
        },
      }),
    [],
  );
  return {
    form,
  };
};

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
