import type { Plugin } from 'vite';
import StyleDictionary from 'style-dictionary';
import type { Config } from 'style-dictionary';
import { propertyFormatNames } from 'style-dictionary/enums';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

export default function styleDictionaryPlugin(config?: Config): Plugin {
  // https://github.com/style-dictionary/style-dictionary/blob/61bc3129524ead09ea6c3ea4622b49c5b94a1a66/lib/common/formats.js#L175
  StyleDictionary.registerFormat({
    name: 'tailwind-theme-variables',
    format: async ({ dictionary, file, options }) => {
      const { outputReferences, usesDtcg } = options;
      const header = await fileHeader({ file });
      const variables = formattedVariables({
        format: propertyFormatNames.css,
        dictionary,
        outputReferences,
        usesDtcg,
      });

      return header + '@theme {\n' + variables + '\n}\n';
    },
  });

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
