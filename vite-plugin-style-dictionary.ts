import type { Plugin } from 'vite';
import StyleDictionary from 'style-dictionary';
import type { Config } from 'style-dictionary';

export default function styleDictionaryPlugin(config?: Config): Plugin {
  async function buildTokens() {
    const sd = new StyleDictionary(config ?? {});
    await sd.buildAllPlatforms();
  }

  return {
    name: 'vite-plugin-style-dictionary',

    async buildStart() {
      // Build tokens when Vite starts
      await buildTokens();
    },

    async handleHotUpdate({ file, server }) {
      // Rebuild tokens when token files change
      if (file.includes('src/tokens')) {
        await buildTokens();
        // Trigger full reload for CSS changes
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }
    },
  };
}
