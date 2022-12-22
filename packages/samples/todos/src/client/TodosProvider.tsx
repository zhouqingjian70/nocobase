import { SchemaComponentOptions, SchemaInitializerContext } from '@nocobase/client';
import React, { useContext } from 'react';
import { Todos } from './Todos';
import { TodosBlockInitializer } from './TodosBlockInitializer';
import { TodosViewInitializers } from './TodosViewInitializers';

export const TodosProvider = React.memo((props: any) => {
  const items = useContext(SchemaInitializerContext);
  const children = items.BlockInitializers.items[2].children;
  children.push({
    key: 'todosblock',
    type: 'item',
    title: '{{t("Todos")}}',
    component: 'TodosBlockInitializer',
  });
  return (
    <SchemaComponentOptions components={{ Todos, TodosBlockInitializer, TodosViewInitializers }}>
      <SchemaInitializerContext.Provider value={{ ...items, TodosViewInitializers }}>
        {props.children}
      </SchemaInitializerContext.Provider>
    </SchemaComponentOptions>
  );
});
