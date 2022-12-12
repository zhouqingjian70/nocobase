import { observer, RecursionField, useFieldSchema } from '@formily/react';
import { Action, ActionContext, FormProvider, useCollection } from '@nocobase/client';
import React from 'react';
import { SnapshotContext } from './context';

export const CustomField: any = observer((props) => {
  const [visible, setVisible] = React.useState(false);
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const collectionField = React.useMemo(() => {
    return collection.getField(fieldSchema.name as any);
  }, []);
  return (
    <SnapshotContext.Provider value={{ collectionField }}>
      <ActionContext.Provider value={{ visible, setVisible, openMode: 'drawer' }}>
        <a
          onClick={() => {
            setVisible(true);
          }}
        >
          test
        </a>
        <FormProvider>
          <RecursionField
            schema={fieldSchema}
            onlyRenderProperties
            filterProperties={(s) => {
              return s['x-component'] === 'CustomField.Viewer';
            }}
          />
        </FormProvider>
      </ActionContext.Provider>
    </SnapshotContext.Provider>
  );
});

CustomField.Viewer = Action.Container;
