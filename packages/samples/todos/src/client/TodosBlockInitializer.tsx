import { TableOutlined } from '@ant-design/icons';
import { uid } from '@formily/shared';
import { SchemaInitializer } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const TodosBlockInitializer = (props) => {
  const { insert } = props;
  const { t } = useTranslation();
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<TableOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'Todos.Designer',
          'x-decorator': 'Todos.Decorator',
          'x-decorator-props': {
            params: {},
          },
          'x-component': 'CardItem',
          properties: {
            [uid()]: {
              type: 'void',
              'x-component': 'Todos',
            },
          },
        });
      }}
      title={t('Todos')}
    />
  );
};
