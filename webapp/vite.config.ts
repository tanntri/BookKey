import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith('VITE_') || ['NODE_ENV', 'HOST_ENV', 'SOURCE_VERSION'].includes(key)) {
      return {
        ...acc,
        [key]: value
      }
    }
    return acc;
  }, {})

  // Sentry auth token and source version are needed in production, so we need
  // a check to make sure they are in place when the environment is not local
  if (env.HOST_ENV !== 'local') {
    if (!env.SENTRY_AUTH_TOKEN) {
      throw new Error("SENTRY AUTH TOKEN NOT FOUND");
    }
    if (!env.SOURCE_VERSION) {
      throw new Error("SOURCE VERSION NOT FOUND");
    }
  }

  return {
    plugins: [react(), svgr(), env.SENTRY_AUTH_TOKEN ? sentryVitePlugin({
      org: 'bookkey-0ca',
      project: 'bookkey-webapp',
      authToken: env.SENTRY_AUTH_TOKEN,
      release: { name: env.SOURCE_VERSION }
    }) : undefined],
    build: {
      sourcemap: true
    },
    server: {
      port: +env.PORT
    },
    preview: {
      port: +env.PORT
    },
    define: {
      'process.env': publicEnv
    }
  }
});
