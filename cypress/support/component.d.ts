import { RouteRecordRaw } from "vue-router";

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module Cypress {
  interface Chainable {
    mount(
      component: unknown,
      options?: any
    ): Cypress.Chainable<JQuery<HTMLElement>>;
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

declare module "cypress/vue" {
  export function mount(
    component: unknown,
    options?: {
      [key: string]: unknown;
      router?: {
        routes: RouteRecordRaw[];
        history?: unknown;
      };
    }
  ): Cypress.Chainable<JQuery<HTMLElement>>;
}
