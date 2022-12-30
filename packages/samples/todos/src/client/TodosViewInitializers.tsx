import { uid } from '@formily/shared';
import { SchemaInitializer } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

const gridRowColWrap = (schema) => {
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

export const TodosViewInitializers = (props: any) => {
  const { t } = useTranslation();
  const { insertPosition, component } = props;
  return (
    <SchemaInitializer.Button
      insertPosition={insertPosition}
      wrap={gridRowColWrap}
      icon={'PlusOutlined'}
      items={[
        {
          type: 'itemGroup',
          title: t('Data blocks'),
          children: [
            {
              key: 'markdown1',
              type: 'item',
              title: '{{t("Trigger record")}}',
              component: 'MarkdownBlockInitializer',
            },
            {
              key: 'markdown2',
              type: 'item',
              title: '{{t("Node #1")}}',
              component: 'MarkdownBlockInitializer',
            },
            {
              key: 'markdown3',
              type: 'item',
              title: '{{t("Node #2")}}',
              component: 'MarkdownBlockInitializer',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          key: 'media',
          type: 'itemGroup',
          title: '{{t("Other blocks")}}',
          children: [
            {
              key: 'markdown5',
              type: 'item',
              title: '{{t("Custom form")}}',
              component: 'MarkdownBlockInitializer',
            },
            {
              key: 'markdown6',
              type: 'item',
              title: '{{t("Markdown")}}',
              component: 'MarkdownBlockInitializer',
            },
          ],
        },
      ]}
      component={component}
      title={component ? undefined : t('Add block')}
    />
  );
};
