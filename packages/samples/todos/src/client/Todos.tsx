import { FormLayout } from '@formily/antd';
import { createForm } from '@formily/core';
import { FormContext, observer, Schema } from '@formily/react';
import {
  ActionContext,
  CollectionProvider,
  SchemaComponent,
  SchemaComponentContext,
  SchemaInitializer,
  useActionContext,
  useSchemaComponentContext
} from '@nocobase/client';
import React from 'react';
import { TodosDesigner } from './TodosDesigner';

export const AddActionButton = (props: any) => {
  const { insertPosition, component } = props;
  return (
    <SchemaInitializer.Button
      insertPosition={insertPosition}
      style={
        {
          // marginLeft: 8
        }
      }
      items={[
        {
          key: 'media',
          type: 'itemGroup',
          title: 'Enable actions',
          children: [
            {
              type: 'item',
              title: '{{t("Pass")}}',
              component: 'ActionInitializer',
              schema: {
                title: 'Pass',
                'x-designer': 'Action.Designer',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                },
                'x-action': 'pass', // x-action，按钮的唯一标识（在 action bar 里）
                'x-align': 'right', // 左边、右边
              },
            },
            {
              type: 'item',
              title: '{{t("Reject")}}',
              component: 'ActionInitializer',
              schema: {
                title: 'Reject',
                'x-designer': 'Action.Designer',
                'x-component': 'Action',
                'x-component-props': {
                  danger: true,
                },
                'x-action': 'reject',
                'x-align': 'right',
              },
            },
            {
              type: 'item',
              title: '{{t("Save")}}',
              component: 'ActionInitializer',
              schema: {
                title: 'Save',
                'x-designer': 'Action.Designer',
                'x-component': 'Action',
                'x-action': 'save',
                'x-align': 'right',
              },
            },
          ],
        },
      ]}
      component={component}
      title={component ? undefined : 'Configure actions'}
    />
  );
};

const collection = {
  name: 'sample_todos',
  title: '{{t("Todos")}}',
  fields: [],
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

const CustomFormProvider = (props) => {
  const collection = {
    name: 'tests',
    fields: [],
  };
  const form = React.useMemo(
    () =>
      createForm({
        readPretty: false,
      }),
    [],
  );
  return (
    <FormContext.Provider value={form}>
      <FormLayout layout={'vertical'}>
        <CollectionProvider collection={collection}>{props.children}</CollectionProvider>
      </FormLayout>
    </FormContext.Provider>
  );
};

export const Todos: any = () => {
  const [visible, setVisible] = React.useState(false);

  const schema = new Schema({
    properties: {
      drawer1: {
        'x-component': 'Action.Drawer',
        'x-component-props': {
          className: 'nb-action-popup',
        },
        type: 'void',
        title: 'View todo',
        properties: {
          tabs1: {
            type: 'void',
            'x-component': 'Tabs',
            'x-initializer': 'TabPaneInitializers',
            'x-component-props': {},
            properties: {
              tab1: {
                type: 'void',
                title: 'Tab1',
                'x-component': 'Tabs.TabPane',
                'x-component-props': {
                  tab: 'Tab1',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'TodosViewInitializers',
                    properties: {
                      row: {
                        type: 'void',
                        'x-component': 'Grid.Row',
                        properties: {
                          col: {
                            type: 'void',
                            'x-component': 'Grid.Col',
                            properties: {
                              block1: {
                                type: 'void',
                                'x-component': 'CardItem',
                                'x-read-pretty': false,
                                'x-decorator': 'CustomFormProvider',
                                properties: {
                                  grid: {
                                    type: 'void',
                                    'x-component': 'Grid',
                                    // 'x-read-pretty': true,
                                    'x-initializer': 'AddFieldButton',
                                    properties: {},
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              tab2: {
                type: 'void',
                title: 'Tab2',
                'x-component': 'Tabs.TabPane',
                'x-component-props': {
                  tab: 'Tab2',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    'x-initializer': 'TodosViewInitializers',
                    properties: {},
                  },
                },
              },
            },
          },
          footer1: {
            'x-component': 'Action.Drawer.Footer',
            'x-component-props': {
              style: {
                background: '#fff',
              },
            },
            type: 'void',
            properties: {
              actions: {
                type: 'void',
                'x-component': 'ActionBar',
                'x-initializer': 'AddActionButton',
                'x-component-props': {
                  layout: 'one-column',
                },
                properties: {
                  save: {
                    title: 'Save',
                    'x-designer': 'Action.Designer',
                    'x-component': 'Action',
                    'x-action': 'save',
                    'x-align': 'right',
                  },
                },
              },
            },
          },
        },
      },
    },
  });

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
        <SchemaComponentRefreshProvider
          onRefresh={() => {
            console.log('changed:', schema.toJSON());
          }}
        >
          <SchemaComponent memoized components={{ CustomFormProvider }} scope={{ useCloseAction }} schema={schema} />
        </SchemaComponentRefreshProvider>
      </ActionContext.Provider>
    </div>
  );
};

Todos.Decorator = observer((props: any) => {
  return <div>{props.children}</div>;
});

Todos.Designer = TodosDesigner;
