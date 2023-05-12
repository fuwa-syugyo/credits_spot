import { mount } from 'cypress/vue';
import { Router } from 'vue-router'

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[1] & { router?: Router }

declare global {
  namespace Cypress {
    interface Chainable {
      // mount: typeof mount;
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
