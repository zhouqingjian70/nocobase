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
      items={[
        {
          type: 'itemGroup',
          title: t('Enable actions'),
          children: [],
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
              key: 'markdown',
              type: 'item',
              title: '{{t("Markdown")}}',
              component: 'MarkdownBlockInitializer',
            },
          ],
        },
      ]}
      title={'Add block'}
      component={component}
      title={component ? null : t('Add block')}
    />
  );
};
