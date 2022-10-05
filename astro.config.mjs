import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import netlify from "@astrojs/netlify/functions";

import GDScriptGrammar from "./src/assets/GDScript.tmLanguage.json"

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: netlify(),
  markdown: {
    shikiConfig: {
      langs: [
        {
          id: "GDScript",
          scopeName: "source.gdscript",
          aliases: ["gd", "gdscript"],
          grammar: GDScriptGrammar
        }
      ]
    }
  }
});