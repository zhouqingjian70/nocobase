import { FormOutlined } from '@ant-design/icons';
import { ISchema } from '@formily/react';
import { uid } from '@formily/shared';
import { SchemaInitializer } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const gridRowColWrap = (schema: ISchema) => {
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [schema.name || uid()]: schema,
        },
      },
    },
  };
};

export const createSnapshotBlockSchema = (options) => {
  const { formItemInitializers = 'ReadPrettyFormItemInitializers', collection, resource } = options;
  const schema: ISchema = {
    type: 'void',
    'x-decorator': 'SnapshotBlockProvider',
    'x-decorator-props': {},
    'x-designer': 'FormV2.ReadPrettyDesigner',
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-read-pretty': true,
        'x-component-props': {
          useProps: '{{ useSnapshotFormBlockProps }}',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': formItemInitializers,
            properties: {},
          },
        },
      },
    },
  };
  return schema;
};

export const SnapshotFormBlockInitializer = (props) => {
  const { insert, icon = true, ...others } = props;

  return (
    <SchemaInitializer.Item
      icon={icon && <FormOutlined />}
      {...others}
      onClick={async ({ item }) => {
        insert(createSnapshotBlockSchema({}));
      }}
    />
  );
};

export const SnapshotBlockInitializers = (props: any) => {
  const { t } = useTranslation();
  const { insertPosition, component } = props;
  return (
    <SchemaInitializer.Button
      wrap={gridRowColWrap}
      insertPosition={insertPosition}
      component={component}
      title={component ? null : (t('Add block') as any)}
      icon={'PlusOutlined'}
      items={[
        {
          type: 'itemGroup',
          title: '{{t("Current record blocks")}}',
          children: [
            {
              key: 'details',
              type: 'item',
              title: '{{t("Details")}}',
              component: SnapshotFormBlockInitializer,
            },
          ],
        },
        {
          type: 'itemGroup',
          title: '{{t("Other blocks")}}',
          children: [
            {
              key: 'markdown',
              type: 'item',
              title: '{{t("Markdown")}}',
              component: 'MarkdownBlockInitializer',
            },
          ],
        },
      ]}
    />
  );
};
