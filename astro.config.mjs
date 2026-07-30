import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

import GDScriptGrammar from "./src/assets/GDScript.tmLanguage.json" with { type: "json" };

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: netlify(),
  markdown: {
    shikiConfig: {
      langs: [
        {
          ...GDScriptGrammar,
          name: "GDScript",
          scopeName: "source.gdscript",
          aliases: ["gd", "gdscript"],
        },
      ],
    },
  },
});
