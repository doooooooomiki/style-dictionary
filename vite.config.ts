import { defineConfig } from 'vite';
import styleDictionary from './vite-plugin-style-dictionary';
import sdConfig from './style-dictionary.config';

export default defineConfig({
  plugins: [styleDictionary(sdConfig)],
});
