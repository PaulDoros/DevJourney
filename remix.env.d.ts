/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
import '@remix-run/node';

declare module '@remix-run/node' {
  interface AppLoadContext {
    // your context types here
  }
}
