import { SchemaComponentOptions, SchemaInitializerContext } from '@nocobase/client';
import React, { useContext } from 'react';
import { AddFieldButton } from './CustomForm';
import { AddActionButton, Todos } from './Todos';
import { TodosBlockInitializer } from './TodosBlockInitializer';
import { TodosViewInitializers } from './TodosViewInitializers';

export const TodosProvider = React.memo((props: any) => {
  const items = useContext(SchemaInitializerContext);
  const children = items.BlockInitializers.items[2].children;
  children.push({
    key: 'todos',
    type: 'item',
    title: '{{t("Todo list")}}',
    component: 'TodosBlockInitializer',
  });
  return (
    <SchemaComponentOptions components={{ Todos, TodosBlockInitializer, TodosViewInitializers }}>
      <SchemaInitializerContext.Provider value={{ ...items, AddFieldButton, AddActionButton, TodosViewInitializers }}>
        {props.children}
      </SchemaInitializerContext.Provider>
    </SchemaComponentOptions>
  );
});
