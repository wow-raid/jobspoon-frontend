import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'path';

export default defineNuxtModule({
  meta: {
    name: 'membership',
    configKey: 'membership',
  },

  setup(moduleOptions, nuxt) {
    const themeDir = resolve(__dirname, '..');

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'MembershipPlans',
        path: '/membership/plans',
        file: resolve(themeDir, 'membership/pages/plans.vue'), // ✅ 소문자
      });

      pages.push({
        name: 'MembershipStatus',
        path: '/membership/status',
        file: resolve(themeDir, 'membership/pages/status.vue'), // ✅ 소문자
      });
    });

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(__dirname, 'stores'));
    });
  },
});
