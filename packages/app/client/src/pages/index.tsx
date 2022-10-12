import { Application } from '@nocobase/client';
import { CustomSignupPageProvider } from '../plugins/custom-signup-page';

export const app = new Application({
  apiClient: {
    baseURL: process.env.API_BASE_URL,
  },
  plugins: [
    require('@nocobase/plugin-china-region/client').default,
    require('@nocobase/plugin-export/client').default,
    require('@nocobase/plugin-audit-logs/client').default,
    require('@nocobase/plugin-workflow/client').default,
  ],
});

app.use(CustomSignupPageProvider);

export default app.render();
