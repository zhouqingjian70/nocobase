import { ISchema } from '@formily/react';
import {
  IField,
  interfacesProperties
} from '@nocobase/client';

export const customField: IField = {
  name: 'customField',
  type: 'object',
  group: 'advanced',
  order: 4,
  title: '{{t("Custom field")}}',
  default: {
    type: 'json',
    // name,
    uiSchema: {
      type: 'object',
      // title,
      'x-component': 'CustomField',
      'x-component-props': {},
      properties: {},
    },
  },
  properties: {
    ...interfacesProperties.defaultProps,
  },
  schemaInitialize(schema: ISchema, { readPretty }) {
    if (readPretty) {
      schema['properties'] = {
        viewer: {
          type: 'void',
          title: '{{ t("View record") }}',
          'x-component': 'CustomField.Viewer',
          'x-component-props': {
            className: 'nb-action-popup',
          },
          properties: {
            tabs: {
              type: 'void',
              'x-component': 'Tabs',
              'x-component-props': {},
              'x-initializer': 'TabPaneInitializers',
              properties: {
                tab1: {
                  type: 'void',
                  title: '{{t("Details")}}',
                  'x-component': 'Tabs.TabPane',
                  'x-designer': 'Tabs.Designer',
                  'x-component-props': {},
                  properties: {
                    grid: {
                      type: 'void',
                      'x-component': 'Grid',
                      'x-initializer': 'SnapshotBlockInitializers',
                      properties: {},
                    },
                  },
                },
              },
            },
          },
        },
      };
    } else {
      // schema['properties'] = {
      //   selector: cloneDeep(recordPickerSelector),
      // }
    }
  },
};
