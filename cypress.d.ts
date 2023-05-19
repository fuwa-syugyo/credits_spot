import { mount } from 'cypress/vue';
import { Router, RouterHistory, LocationQuery } from 'vue-router'

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[1] & { router?: Router, query?: LocationQuery}

declare global {
  namespace Cypress {
    interface Chainable {
      // mount: typeof mount;
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
