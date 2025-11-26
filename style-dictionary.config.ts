import { formats, transformGroups } from 'style-dictionary/enums';

export default {
  source: ['src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      files: [
        {
          format: formats.cssVariables,
          destination: 'src/styles/_root.css',
          options: {
            outputReferences: true,
            fileHeader: async (defaultMessages: string[] | undefined) => {
              return [
                ...(defaultMessages ?? []),
                'Do not edit please',
                'Auto-generated on...',
                `${new Date().toISOString()}`,
              ];
            },
          },
        },
      ],
    },
  },
};
