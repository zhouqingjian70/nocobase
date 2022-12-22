import { ISchema, observer, Schema } from '@formily/react';
import {
  ActionContext,
  SchemaComponent,
  SchemaComponentContext,
  useActionContext,
  useSchemaComponentContext
} from '@nocobase/client';
import React from 'react';
import { TodosDesigner } from './TodosDesigner';

const collection = {
  name: 'sample_todos',
  title: '{{t("Todos")}}',
  fields: [],
};

const schema: ISchema = {
  properties: {
    drawer1: {
      'x-component': 'Action.Drawer',
      'x-component-props': {
        className: 'nb-action-popup',
      },
      type: 'void',
      title: 'Drawer Title',
      properties: {
        hello1: {
          type: 'void',
          'x-component': 'Hello',
        },
        footer1: {
          'x-component': 'Action.Drawer.Footer',
          type: 'void',
          properties: {
            close1: {
              title: 'Close',
              'x-component': 'Action',
              'x-component-props': {
                useAction: '{{ useCloseAction }}',
              },
            },
          },
        },
      },
    },
  },
};

const useCloseAction = () => {
  const { setVisible } = useActionContext();
  return {
    async run() {
      setVisible(false);
    },
  };
};

const SchemaComponentRefreshProvider = (props) => {
  const ctx = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider
      value={{
        ...ctx,
        refresh: () => {
          ctx.refresh();
          props?.onRefresh?.();
        },
      }}
    >
      {props.children}
    </SchemaComponentContext.Provider>
  );
};

const Hello = () => {
  const schema = new Schema({
    properties: {
      grid: {
        type: 'void',
        'x-component': 'Grid',
        'x-initializer': 'TodosViewInitializers',
        properties: {},
      },
    },
  });
  const ctx = useSchemaComponentContext();
  return (
    <div onClick={() => {}}>
      <SchemaComponentRefreshProvider
        onRefresh={() => {
          console.log('changed:', schema.toJSON());
        }}
      >
        {/* <RemoteSchemaComponent uid={'mcg9plxk8wi'} /> */}
        <SchemaComponent memoized schema={schema} />
      </SchemaComponentRefreshProvider>
    </div>
  );
};

export const Todos: any = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <ActionContext.Provider value={{ visible, setVisible }}>
        <a
          onClick={() => {
            setVisible(true);
          }}
        >
          Open
        </a>
        <SchemaComponent components={{ Hello }} scope={{ useCloseAction }} schema={schema} />
      </ActionContext.Provider>
    </div>
  );
};

Todos.Decorator = observer((props: any) => {
  return <div>{props.children}</div>;
});

Todos.Designer = TodosDesigner;
