import { c as createVNode, F as Fragment } from '../entry.mjs';
import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'react';
import 'react-dom/server';
/* empty css                 *//* empty css                                 */import 'phosphor-react';
/* empty css                      *//* empty css                */import 'react/jsx-runtime';
import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const html = "<ul>\n<li><img align=\"center\" style=\"margin-bottom:3px; border:none; background:none; border-radius: 0;\" width=\"14\" src=\"/img/cornell.svg\"> Student at Cornell University School of Engineering | Class of ‘23</li>\n<li>📚 Studying Information Science, Systems &#x26; Technology</li>\n<li>🇦🇷 🇺🇸 Bilingual and Bicultural</li>\n<li><img align=\"center\" style=\"margin-bottom:3px; border:none; background:none; border-radius: 0;\" width=\"14\" src=\"/img/microsoft.svg\"> SWE Intern @ Microsoft | Summer 2022</li>\n<li>🥁 Passionate about Jazz Drumming and Singing</li>\n</ul>\n<img style=\"margin:2em 0; display:block; margin-left:auto; margin-right:auto\" width=\"400\" src=\"/img/profile.jpeg\">";

				const frontmatter = {};
				const file = "/Users/marcoseiza/Repos/PersonalWebSite/src/content/about.md";
				const url = undefined;
				function rawContent() {
					return "- <img align=\"center\" style=\"margin-bottom:3px; border:none; background:none; border-radius: 0;\" width=\"14\" src=\"/img/cornell.svg\" /> Student at Cornell University School of Engineering | Class of '23\n- 📚 Studying Information Science, Systems & Technology\n- 🇦🇷 🇺🇸 Bilingual and Bicultural\n- <img align=\"center\" style=\"margin-bottom:3px; border:none; background:none; border-radius: 0;\" width=\"14\" src=\"/img/microsoft.svg\" /> SWE Intern @ Microsoft | Summer 2022\n- 🥁 Passionate about Jazz Drumming and Singing\n\n<img style=\"margin:2em 0; display:block; margin-left:auto; margin-right:auto\" width=\"400\" src=\"/img/profile.jpeg\" />";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeaders, getHeadings, rawContent, url };
