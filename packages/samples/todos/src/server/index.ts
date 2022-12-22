import { Plugin } from '@nocobase/server';
import path from 'path';

export default class extends Plugin {
  async beforeLoad() {}

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    this.app.acl.allow('sample_nodes', '*');
  }

  async install(options?: any) {
    const r = this.db.getRepository('sample_nodes');
    await r.createMany({
      records: [
        {
          schema: {
            'x-uid': 'mcg9plxk8wi',
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'TodosViewInitializers',
            properties: {},
          }
        },
      ],
    });
  }
}
