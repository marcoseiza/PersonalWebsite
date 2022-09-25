import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                        *//* empty css                                        */import * as $$module6 from 'phosphor-react';
import { ArrowDown, Article, House, ArrowLeft } from 'phosphor-react';
/* empty css                             *//* empty css                       */import { jsx, jsxs, Fragment as Fragment$1 } from 'react/jsx-runtime';
import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.3.0";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = [];
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts.push(part);
    } else {
      this.parts.push(stringifyChunk(result, part));
    }
  }
  toString() {
    let html = "";
    for (const part of this.parts) {
      if (ArrayBuffer.isView(part)) {
        html += decoder.decode(part);
      } else {
        html += part;
      }
    }
    return html;
  }
  toArrayBuffer() {
    this.parts.forEach((part, i) => {
      if (typeof part === "string") {
        this.parts[i] = encoder.encode(String(part));
      }
    });
    return concatUint8Arrays(this.parts);
  }
}
function concatUint8Arrays(arrays) {
  let len = 0;
  arrays.forEach((arr) => len += arr.length);
  let merged = new Uint8Array(len);
  let offset = 0;
  arrays.forEach((arr) => {
    merged.set(arr, offset);
    offset += arr.length;
  });
  return merged;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
function defineStyleVars(defs) {
  let output = "";
  let arr = !Array.isArray(defs) ? [defs] : defs;
  for (const vars of arr) {
    for (const [key, value] of Object.entries(vars)) {
      if (value || value === 0) {
        output += `--${key}: ${value};`;
      }
    }
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$d = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/layouts/html-head.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [{ type: "external", src: "https://unpkg.com/phosphor-icons" }] });
const $$Astro$e = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/layouts/html-head.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$HtmlHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$HtmlHead;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Ultra&display=swap" rel="stylesheet">
    
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body>
    ${renderSlot($$result, $$slots["default"])}
  </body></html>`;
});

const $$file$d = "/Users/marcoseiza/Repos/PersonalWebSite/src/layouts/html-head.astro";
const $$url$d = undefined;

const $$module1$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$d,
	default: $$HtmlHead,
	file: $$file$d,
	url: $$url$d
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$c = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/section.astro", { modules: [{ module: $$module6, specifier: "phosphor-react", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$d = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/section.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Section = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Section;
  const {
    className = "",
    scrollIndicator = false,
    heightPercent = 1,
    scrollTo
  } = Astro2.props;
  const $$definedVars = defineStyleVars([{ heightPercent }]);
  const STYLES = [
    { props: { "define:vars": { heightPercent }, "data-astro-id": "5JE3Z5YM" }, children: `.wrapper:where(.astro-5JE3Z5YM){height:calc(100vh * var(--heightPercent));width:100vw;display:grid;align-items:center;justify-items:center}.content:where(.astro-5JE3Z5YM){width:75%}.scroll-indicator:where(.astro-5JE3Z5YM){display:grid;align-items:center;justify-items:center;text-decoration:none}.scroll-indicator:where(.astro-5JE3Z5YM) span:where(.astro-5JE3Z5YM){font-weight:600}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`wrapper ${className} astro-5JE3Z5YM`, "class")}${addAttribute($$definedVars, "style")}>
  ${scrollIndicator && renderTemplate`<div class="astro-5JE3Z5YM"></div>`}
  <div class="content astro-5JE3Z5YM">
    ${renderSlot($$result, $$slots["default"])}
  </div>
  ${scrollIndicator && renderTemplate`<a${addAttribute(scrollTo, "href")} class="scroll-indicator astro-5JE3Z5YM">
        <span class="astro-5JE3Z5YM">Scroll Down</span>
        ${renderComponent($$result, "ArrowDown", ArrowDown, { "size": 32, "color": "var(--color-primary)", "weight": "regular", "class": "astro-5JE3Z5YM" }, { "default": () => renderTemplate`<animateTransform id="op" attributeType="XML" attributeName="transform" type="translate" dur="1s" values="0,0; 0,-2; 0,0; 0,2; 0,0; 0,-2; 0,0; 0,2; 0,0" begin="2s;op.end+2s" class="astro-5JE3Z5YM"></animateTransform>` })}
      </a>`}
</div>

`;
});

const $$file$c = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/section.astro";
const $$url$c = undefined;

const $$module2$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$c,
	default: $$Section,
	file: $$file$c,
	url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$b = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/card.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$c = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/card.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Card;
  const { className = "", url, padding = "1em" } = Astro2.props;
  const Wrapper = url ? "a" : "div";
  const $$definedVars = defineStyleVars([{
    paddingSize: typeof padding == "string" ? padding : `${padding}px`
  }]);
  const STYLES = [
    { props: { "define:vars": {
      paddingSize: typeof padding == "string" ? padding : `${padding}px`
    }, "data-astro-id": "M3VRAEQF" }, children: `.card-wrapper:where(.astro-M3VRAEQF){padding:var(--paddingSize);background-color:var(--color-secondary);border:var(--border-width) solid var(--color-card-text);border-radius:10px;box-shadow:10px 10px 0px var(--color-card-text);margin:0 10px 10px 0;text-decoration:none}.card-wrapper:where(.astro-M3VRAEQF).clickable:hover{box-shadow:7px 7px 0px var(--color-card-text);transform:translate(3px,3px)}.card-wrapper:where(.astro-M3VRAEQF) h1,.card-wrapper:where(.astro-M3VRAEQF) h2,.card-wrapper:where(.astro-M3VRAEQF) h3,.card-wrapper:where(.astro-M3VRAEQF) h4,.card-wrapper:where(.astro-M3VRAEQF) p,.card-wrapper:where(.astro-M3VRAEQF) span{color:var(--color-card-text)}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="astro-M3VRAEQF"${addAttribute($$definedVars, "style")}>
  ${renderComponent($$result, "Wrapper", Wrapper, { "href": url, "class": `card-wrapper ${url && "clickable"} ${className} astro-M3VRAEQF` }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}
</div>

`;
});

const $$file$b = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/card.astro";
const $$url$b = undefined;

const $$module8$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$b,
	default: $$Card,
	file: $$file$b,
	url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$a = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/container.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/container.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Container = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Container;
  const { padding, id, maxWidth, className } = Astro2.props;
  const $$definedVars = defineStyleVars([{
    paddingPx: `${padding * 20}px`,
    paddingPxSmall: `${padding * 10}px`,
    maxWidth: maxWidth ? `${maxWidth}px` : "none"
  }]);
  const STYLES = [
    { props: { "define:vars": {
      paddingPx: `${padding * 20}px`,
      paddingPxSmall: `${padding * 10}px`,
      maxWidth: maxWidth ? `${maxWidth}px` : "none"
    }, "data-astro-id": "BI75QZRO" }, children: `.container:where(.astro-BI75QZRO){padding:var(--paddingPx);max-width:var(--maxWidth);margin-left:auto;margin-right:auto}@media (max-width: 500px){.container:where(.astro-BI75QZRO){padding:var(--paddingPxSmall)}}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(id, "id")}${addAttribute([["container", className], "astro-BI75QZRO"], "class:list")}${addAttribute($$definedVars, "style")}>
  ${renderSlot($$result, $$slots["default"])}
</div>

`;
});

const $$file$a = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/container.astro";
const $$url$a = undefined;

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$Container,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/separator.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/separator.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Separator = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Separator;
  const {
    parentPadding = "",
    lineHeight = 0,
    color = "black",
    showLine = false,
    marginTop = "1em",
    marginBottom = "1em"
  } = Astro2.props;
  const $$definedVars = defineStyleVars([{
    sepWidth: `calc(100% + ${parentPadding} * 2)`,
    sepOffset: `-${parentPadding}`,
    sepHeight: `${lineHeight}px`,
    sepColor: color,
    marginTop,
    marginBottom
  }]);
  const STYLES = [
    { props: { "define:vars": {
      sepWidth: `calc(100% + ${parentPadding} * 2)`,
      sepOffset: `-${parentPadding}`,
      sepHeight: `${lineHeight}px`,
      sepColor: color,
      marginTop,
      marginBottom
    }, "data-astro-id": "SWW7Y5VU" }, children: `.separator:where(.astro-SWW7Y5VU){width:var(--sepWidth);margin:0 var(--sepOffset);margin-top:var(--marginTop);margin-bottom:var(--marginBottom)}.showline:where(.astro-SWW7Y5VU){height:var(--sepHeight);background-color:var(--sepColor)}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`separator ${showLine && "showline"} astro-SWW7Y5VU`, "class")}${addAttribute($$definedVars, "style")}></div>

`;
});

const $$file$9 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/separator.astro";
const $$url$9 = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Separator,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/flex.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/flex.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Flex = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Flex;
  const {
    direction = "row",
    align = "flex-start",
    justify = "flex-start",
    alignContent = "flex-start",
    justifyContent = "flex-start",
    gap = 0
  } = Astro2.props;
  const $$definedVars = defineStyleVars([{
    direction,
    align,
    justify,
    alignContent,
    justifyContent,
    gap: typeof gap == "string" ? gap : `${gap}px`
  }]);
  const STYLES = [
    { props: { "define:vars": {
      direction,
      align,
      justify,
      alignContent,
      justifyContent,
      gap: typeof gap == "string" ? gap : `${gap}px`
    }, "data-astro-id": "SL4FDLF2" }, children: `.flex-container:where(.astro-SL4FDLF2){display:flex;flex-direction:var(--direction);align-items:var(--align);justify-items:var(--justify);align-content:var(--alignContent);justify-content:var(--justifyContent);gap:var(--gap)}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="flex-container astro-SL4FDLF2"${addAttribute($$definedVars, "style")}>
  ${renderSlot($$result, $$slots["default"])}
</div>

`;
});

const $$file$8 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/flex.astro";
const $$url$8 = undefined;

const $$module3$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Flex,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/button.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/button.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    url,
    text = "",
    forceWidth,
    icon = false,
    size = "normal",
    elevation = 2,
    className = "link"
  } = Astro2.props;
  const $$definedVars = defineStyleVars([{ forceWidth: forceWidth ? `${forceWidth}px` : "auto" }]);
  const STYLES = [
    { props: { "define:vars": { forceWidth: forceWidth ? `${forceWidth}px` : "auto" }, "data-astro-id": "DELYTNBV" }, children: `a:where(.astro-DELYTNBV),a:where(.astro-DELYTNBV):link{text-decoration:none}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV){--shadow: 3px;width:var(--forceWidth);background-color:var(--color-secondary);border:var(--border-width) solid var(--color-card-text);border-radius:10px;box-shadow:var(--shadow) var(--shadow) 0px var(--color-card-text);margin:0 var(--shadow) var(--shadow) 0;transition:all 100ms ease-in-out;text-align:center;display:flex;align-items:center;gap:10px}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).elevation-1{--shadow: 2px}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).elevation-2{--shadow: 4px}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).elevation-3{--shadow: 5px}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).normal{padding:0.7em 1em}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).small{font-size:0.85em;padding:0 0.3em;gap:0.2em}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).icon{flex-direction:row;align-items:center;justify-items:center;padding:0.3em;gap:0.3em}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV).icontext{padding-right:0.5em}a:where(.astro-DELYTNBV):hover div:where(.astro-DELYTNBV){box-shadow:1px 1px 0px var(--color-card-text);transform:translate(calc(var(--shadow) - 1px),calc(var(--shadow) - 1px));cursor:pointer}a:where(.astro-DELYTNBV) div:where(.astro-DELYTNBV) h4:where(.astro-DELYTNBV){color:var(--color-card-text)}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(url, "href")}${addAttribute([[className], "astro-DELYTNBV"], "class:list")}${addAttribute($$definedVars, "style")}>
  <div${addAttribute([[
    icon && "icon",
    icon && text && "icontext",
    size,
    `elevation-${elevation}`
  ], "astro-DELYTNBV"], "class:list")}>
    ${renderSlot($$result, $$slots["default"])}
    ${text && renderTemplate`<h4 class="astro-DELYTNBV">${text}</h4>`}
  </div>
</a>

`;
});

const $$file$7 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/button.astro";
const $$url$7 = undefined;

const $$module7$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$Button,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/custom-icons/github.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/custom-icons/github.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Github = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Github;
  const { size } = Astro2.props;
  const $$definedVars = defineStyleVars([{ size: `${size}px` }]);
  const STYLES = [
    { props: { "define:vars": { size: `${size}px` }, "data-astro-id": "BUMPXFKG" }, children: `.github-icn:where(.astro-BUMPXFKG){width:var(--size);height:var(--size)}` }
  ];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<svg class="github-icn astro-BUMPXFKG" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="GitHubIcon"${addAttribute($$definedVars, "style")}><path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27" class="astro-BUMPXFKG"></path>
</svg>

`;
});

const $$file$6 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/custom-icons/github.astro";
const $$url$6 = undefined;

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$Github,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/action-buttons.astro", { modules: [{ module: $$module3$2, specifier: "./flex.astro", assert: {} }, { module: $$module7$1, specifier: "./button.astro", assert: {} }, { module: $$module3$1, specifier: "./custom-icons/github.astro", assert: {} }, { module: $$module6, specifier: "phosphor-react", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/action-buttons.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$ActionButtons = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ActionButtons;
  return renderTemplate`${renderComponent($$result, "Flex", $$Flex, { "direction": "row", "align": "center", "justify": "center", "gap": 10 }, { "default": () => renderTemplate`${renderComponent($$result, "Button", $$Button, { "url": "https://github.com/marcoseiza", "text": "My Work", "forceWidth": 160 }, { "default": () => renderTemplate`${renderComponent($$result, "Github", $$Github, { "size": 32 })}` })}${renderComponent($$result, "Button", $$Button, { "url": "/blog", "text": "My Blog", "forceWidth": 160, "elevation": 1 }, { "default": () => renderTemplate`${renderComponent($$result, "Article", Article, { "size": 32, "weight": "bold" })}` })}` })}`;
});

const $$file$5 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/action-buttons.astro";
const $$url$5 = undefined;

const $$module7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$ActionButtons,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/window-title-bar.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/window-title-bar.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$WindowTitleBar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$WindowTitleBar;
  const { sticky = false } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute([["title-bar", sticky ? "sticky" : "fixed"], "astro-KLLCZIIW"], "class:list")}>
  <div class="window-controls astro-KLLCZIIW">
    <div class="close astro-KLLCZIIW"></div>
    <div class="hide astro-KLLCZIIW"></div>
    <div class="fullscreen astro-KLLCZIIW"></div>
  </div>
  <div class="menu astro-KLLCZIIW">
    ${renderSlot($$result, $$slots["default"])}
  </div>
</div>

`;
});

const $$file$4 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/window-title-bar.astro";
const $$url$4 = undefined;

const $$module5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$WindowTitleBar,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const bigChecker = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEYSURBVHgB7dghDoBADADBHv//MwQPKHJrZiTUbRpI18yc82y9PDf/4/wxpASICRATICZAbH288/eyYd4GxASICRATICZA7P5i+xsJ521ATICYADEBYgLE3ILieRsQEyAmQEyAmAAxt6B43gbEBIgJEBMgJkDMLSietwExAWICxASICRBzC4rnbUBMgJgAMQFiAsTcguJ5GxATICZATICYADG3oHjeBsQEiAkQEyAmQMwtKJ63ATEBYgLEBIgJEHMLiudtQEyAmAAxAWICxNyC4nkbEBMgJkBMgJgAMbegeN4GxASICRATICZAzC0onrcBMQFiAsQEiAkQcwuK521ATICYADEBYgLE3ILieRsQEyAmQEyAmACxC/TxgKm0tngOAAAAAElFTkSuQmCC";

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: bigChecker
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/md-styling.astro", { modules: [{ module: $$module1, specifier: "../../public/img/big-checker.png", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/md-styling.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$MdStyling = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$MdStyling;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="md">
  ${renderSlot($$result, $$slots["default"])}
</div>

`;
});

const $$file$3 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/md-styling.astro";
const $$url$3 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$MdStyling,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/retro-scroll.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/retro-scroll.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$RetroScroll = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$RetroScroll;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<main${addAttribute(["retro-scroll", Astro2.props.className || ""], "class:list")}>
  ${renderSlot($$result, $$slots["default"])}
</main>

`;
});

const $$file$2 = "/Users/marcoseiza/Repos/PersonalWebSite/src/components/retro-scroll.astro";
const $$url$2 = undefined;

const $$module8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$RetroScroll,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/pages/index.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/html-head.astro", assert: {} }, { module: $$module2$2, specifier: "../components/section.astro", assert: {} }, { module: $$module8$1, specifier: "../components/card.astro", assert: {} }, { module: $$module2$1, specifier: "../components/container.astro", assert: {} }, { module: $$module2, specifier: "../components/separator.astro", assert: {} }, { module: $$module3$2, specifier: "../components/flex.astro", assert: {} }, { module: $$module7, specifier: "../components/action-buttons.astro", assert: {} }, { module: $$module5, specifier: "../components/window-title-bar.astro", assert: {} }, { module: $$module3, specifier: "../components/md-styling.astro", assert: {} }, { module: $$module8, specifier: "../components/retro-scroll.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/pages/index.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index;
  const about = (await Astro2.glob(/* #__PURE__ */ Object.assign({"../content/about.md": () => import('./chunks/about.f0454eab.mjs')}), () => "../content/about.md"))[0];
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "HtmlHead", $$HtmlHead, { "title": "\u{1F44B} Hello", "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "WindowTitleBar", $$WindowTitleBar, { "class": "astro-JPWAH6CL" })}${renderComponent($$result, "RetroScroll", $$RetroScroll, { "className": "scroll astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Section", $$Section, { "scrollIndicator": true, "scrollTo": "#about", "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, { "padding": 0, "maxWidth": 600, "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Flex", $$Flex, { "direction": "column", "align": "center", "gap": "2em", "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<h1 class="fancy-text showcase-content-title astro-JPWAH6CL">
              Hi! I'm Marcos Eizayaga.<br class="astro-JPWAH6CL">
              What's Up 👋!
            </h1>` })}${renderComponent($$result, "ActionButtons", $$ActionButtons, { "class": "astro-JPWAH6CL" })}` })}` })}` })}<div class="container-wrapper astro-JPWAH6CL">
      ${renderComponent($$result, "Container", $$Container, { "padding": 3, "id": "about", "maxWidth": 900, "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Flex", $$Flex, { "direction": "column", "align": "center", "gap": "2em", "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`<h2 class="fancy-text astro-JPWAH6CL">About Myself</h2>${renderComponent($$result, "Separator", $$Separator, { "parentPadding": "1em", "lineHeight": 2.5, "showLine": true, "class": "astro-JPWAH6CL" })}${renderComponent($$result, "MdStyling", $$MdStyling, { "class": "astro-JPWAH6CL" }, { "default": () => renderTemplate`${renderComponent($$result, "about.Content", about.Content, { "class": "astro-JPWAH6CL" })}` })}` })}${renderComponent($$result, "ActionButtons", $$ActionButtons, { "class": "astro-JPWAH6CL" })}` })}` })}
    </div>` })}` })}

`;
});

const $$file$1 = "/Users/marcoseiza/Repos/PersonalWebSite/src/pages/index.astro";
const $$url$1 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$Index,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/layouts/post.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/html-head.astro", assert: {} }, { module: $$module2, specifier: "../components/separator.astro", assert: {} }, { module: $$module3, specifier: "../components/md-styling.astro", assert: {} }, { module: $$module8, specifier: "../components/retro-scroll.astro", assert: {} }, { module: $$module7$1, specifier: "../components/button.astro", assert: {} }, { module: $$module6, specifier: "phosphor-react", assert: {} }, { module: $$module5, specifier: "../components/window-title-bar.astro", assert: {} }, { module: $$module8$1, specifier: "../components/card.astro", assert: {} }, { module: $$module2$1, specifier: "../components/container.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/layouts/post.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Post = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Post;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "HtmlHead", $$HtmlHead, { "title": frontmatter.title }, { "default": () => renderTemplate`${renderComponent($$result, "WindowTitleBar", $$WindowTitleBar, {}, { "default": () => renderTemplate`${renderComponent($$result, "Button", $$Button, { "text": "HOME", "url": "/", "size": "small", "elevation": 1 }, { "default": () => renderTemplate`${renderComponent($$result, "House", House, { "size": 20, "weight": "fill" })}` })}${renderComponent($$result, "Button", $$Button, { "text": "BLOG", "url": "/blog", "size": "small", "elevation": 1 }, { "default": () => renderTemplate`${renderComponent($$result, "Article", Article, { "size": 20, "weight": "fill" })}` })}` })}${renderComponent($$result, "RetroScroll", $$RetroScroll, { "className": "scroll" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, { "padding": 2, "maxWidth": 900 }, { "default": () => renderTemplate`${renderComponent($$result, "Button", $$Button, { "text": "BACK", "className": "back-button", "url": "/blog" }, { "default": () => renderTemplate`${renderComponent($$result, "ArrowLeft", ArrowLeft, { "size": 25, "weight": "bold" })}` })}${renderComponent($$result, "Separator", $$Separator, {})}${renderComponent($$result, "Card", $$Card, { "padding": "1.5em  2em" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<h4 class="fancy-text">${frontmatter.title}</h4><h4>${frontmatter.date}</h4>${renderComponent($$result, "Separator", $$Separator, { "showLine": true, "lineHeight": 3.5, "parentPadding": "2em" })}${renderComponent($$result, "MdStyling", $$MdStyling, {}, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}` })}${renderComponent($$result, "Separator", $$Separator, { "marginBottom": "2em" })}${renderComponent($$result, "Button", $$Button, { "text": "BACK", "className": "back-button", "url": "/blog" }, { "default": () => renderTemplate`${renderComponent($$result, "ArrowLeft", ArrowLeft, { "size": 25, "weight": "bold" })}` })}` })}` })}` })}

<style>
  body {
    background-color: var(--color-background);
  }

  main {
    --box-shadow: 3px 3px 0 black;
    --box-shadow-hover: 1px 1px 0 black;
  }

  .scroll {
    height: 100vh;
    padding-top: 3em;
  }

  .back-button {
    display: inline-block;
  }
</style>`;
});

const html = "<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" checked disabled> Write the press release</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" disabled> Update the website</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" disabled> Contact the media</li>\n</ul>\n<h1 id=\"h1-test\">h1 Test</h1>\n<h2 id=\"h2-test\">h2 Test</h2>\n<h3 id=\"h3-test\">h3 Test</h3>\n<h4 id=\"h4-test\">h4 Test</h4>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Syntax</th><th>Description</th></tr></thead><tbody><tr><td>Header</td><td>Title</td></tr><tr><td>Paragraph</td><td>Text</td></tr></tbody></table>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">{</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"firstName\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"John\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"lastName\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #A5D6FF\">\"Smith\"</span><span style=\"color: #C9D1D9\">,</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">  </span><span style=\"color: #7EE787\">\"age\"</span><span style=\"color: #C9D1D9\">: </span><span style=\"color: #79C0FF\">25</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">}</span></span></code></pre>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #FF7B72\">int</span><span style=\"color: #C9D1D9\"> i </span><span style=\"color: #FF7B72\">=</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #79C0FF\">0</span><span style=\"color: #C9D1D9\">;</span></span>\n<span class=\"line\"><span style=\"color: #FFA657\">std</span><span style=\"color: #C9D1D9\">::</span><span style=\"color: #D2A8FF\">sort</span><span style=\"color: #C9D1D9\">(variable)</span></span></code></pre>\n<p>p Test Lorem Ipsum AHHHH</p>\n<p>Hello text <a href=\"https://youtube.com\">https://youtube.com</a>\nfeafeagf</p>\n<p><img src=\"/img/goose.gif\" alt=\"checker\">\n<img src=\"/img/goose.gif\" alt=\"checker\"></p>\n<p><a href=\"/blog\"><img src=\"/img/goose.gif\" alt=\"checker\"></a></p>\n<p><strong>BOLD</strong></p>\n<p><em>Italics</em></p>\n<p>Here’s a sentence with a footnote. <sup><a href=\"#user-content-fn-1\" id=\"user-content-fnref-1\" data-footnote-ref=\"\" aria-describedby=\"footnote-label\">1</a></sup></p>\n<section data-footnotes=\"\" class=\"footnotes\"><h2 class=\"sr-only\" id=\"footnote-label\">Footnotes</h2>\n<ol>\n<li id=\"user-content-fn-1\">\n<p>This is the footnote. <a href=\"#user-content-fnref-1\" data-footnote-backref=\"\" class=\"data-footnote-backref\" aria-label=\"Back to content\">↩</a></p>\n</li>\n</ol>\n</section>";

				const frontmatter = {"layout":"../../layouts/post.astro","title":"Test Markdown","date":"23 Sep 2022 10:57 AM","excerpt":"This is a test markdown for styling and parsing."};
				const file = "/Users/marcoseiza/Repos/PersonalWebSite/src/pages/posts/test.md";
				const url = "/posts/test";
				function rawContent() {
					return "\n- [x] Write the press release\n- [ ] Update the website\n- [ ] Contact the media\n\n# h1 Test\n## h2 Test\n### h3 Test\n#### h4 Test\n\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |\n\n```json\n{\n  \"firstName\": \"John\",\n  \"lastName\": \"Smith\",\n  \"age\": 25\n}\n```\n\n```cpp\nint i = 0;\nstd::sort(variable)\n```\n\np Test Lorem Ipsum AHHHH\n\nHello text [https://youtube.com](https://youtube.com)\nfeafeagf\n\n![checker](/img/goose.gif)\n![checker](/img/goose.gif)\n\n[![checker](/img/goose.gif)](/blog)\n\n**BOLD**\n\n*Italics*\n\nHere's a sentence with a footnote. [^1]\n\n[^1]: This is the footnote.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"h1-test","text":"h1 Test"},{"depth":2,"slug":"h2-test","text":"h2 Test"},{"depth":3,"slug":"h3-test","text":"h3 Test"},{"depth":4,"slug":"h4-test","text":"h4 Test"},{"depth":2,"slug":"footnote-label","text":"Footnotes"}];
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
					return createVNode($$Post, {
									file,
									url,
									content,
									frontmatter: content,
									headings: getHeadings(),
									rawContent,
									compiledContent,
									'server:root': true,
									children: contentFragment
								});
				}
				Content[Symbol.for('astro.needsHeadRendering')] = false;

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

function Skeleton() {
  return /* @__PURE__ */ jsx("span", {
    className: "react-loading-skeleton",
    children: "\u200C"
  });
}
__astro_tag_component__(Skeleton, "@astrojs/react");

function Post({
  post
}) {
  return /* @__PURE__ */ jsx("li", {
    children: /* @__PURE__ */ jsxs("a", {
      className: "react-card",
      href: post?.url,
      children: [/* @__PURE__ */ jsxs("div", {
        className: "react-flex row alignFlexStart",
        children: [/* @__PURE__ */ jsx(Article, {
          size: 32,
          weight: "bold",
          color: "var(--color-card-text)",
          style: {
            marginRight: "1em",
            marginTop: "0.15em",
            flexShrink: 0
          }
        }), /* @__PURE__ */ jsx("h2", {
          className: "fancy-text react-article-title",
          children: post?.frontmatter.title || /* @__PURE__ */ jsx(Skeleton, {})
        })]
      }), /* @__PURE__ */ jsx("h4", {
        className: "react-article-date",
        children: post?.frontmatter.date || /* @__PURE__ */ jsx(Skeleton, {})
      })]
    })
  });
}
__astro_tag_component__(Post, "@astrojs/react");

function PlaceHolderPosts() {
  return /* @__PURE__ */ jsxs(Fragment$1, {
    children: [/* @__PURE__ */ jsx(Post, {}, 0), /* @__PURE__ */ jsx(Post, {}, 1), /* @__PURE__ */ jsx(Post, {}, 2)]
  });
}
__astro_tag_component__(PlaceHolderPosts, "@astrojs/react");

const postComparator = (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
function LoadPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    Object.values(/* #__PURE__ */ Object.assign({"../../pages/posts/test.md": () => Promise.resolve().then(() => _page1)})).map((v) => v().then((post) => {
      return new Promise((r) => setTimeout(() => r(post), 200));
    }).then((post) => {
      setPosts((curPosts) => curPosts.concat(post));
    }));
  }, []);
  return /* @__PURE__ */ jsx("ul", {
    className: "react-article-list",
    children: posts.length > 0 ? posts.sort(postComparator).map((p, i) => !p.frontmatter.draft && /* @__PURE__ */ jsx(Post, {
      post: p
    }, i)) : /* @__PURE__ */ jsx(PlaceHolderPosts, {})
  });
}
__astro_tag_component__(LoadPosts, "@astrojs/react");

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: LoadPosts
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/pages/blog.astro", { modules: [{ module: $$module1$1, specifier: "../layouts/html-head.astro", assert: {} }, { module: $$module2$1, specifier: "../components/container.astro", assert: {} }, { module: $$module3$2, specifier: "../components/flex.astro", assert: {} }, { module: $$module4, specifier: "../components/react-components/load-posts", assert: {} }, { module: $$module5, specifier: "../components/window-title-bar.astro", assert: {} }, { module: $$module6, specifier: "phosphor-react", assert: {} }, { module: $$module7$1, specifier: "../components/button.astro", assert: {} }, { module: $$module8, specifier: "../components/retro-scroll.astro", assert: {} }], hydratedComponents: [LoadPosts], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set(["idle"]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/pages/blog.astro", "", "file:///Users/marcoseiza/Repos/PersonalWebSite/");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "HtmlHead", $$HtmlHead, { "title": "\u{1F468}\u200D\u{1F4BB} My Blog", "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "WindowTitleBar", $$WindowTitleBar, { "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "Button", $$Button, { "text": "HOME", "url": "/", "size": "small", "elevation": 1, "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "House", House, { "size": 20, "weight": "fill", "class": "astro-Z52ZSSOH" })}` })}${renderComponent($$result, "Button", $$Button, { "text": "BLOG", "url": "/blog", "size": "small", "elevation": 1, "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "Article", Article, { "size": 20, "weight": "fill", "class": "astro-Z52ZSSOH" })}` })}` })}${renderComponent($$result, "RetroScroll", $$RetroScroll, { "className": "scroll astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, { "padding": 2, "maxWidth": 900, "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "Flex", $$Flex, { "direction": "column", "align": "stretch", "justify": "flex-start", "gap": 10, "class": "astro-Z52ZSSOH" }, { "default": () => renderTemplate`${renderComponent($$result, "LoadPosts", LoadPosts, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/react-components/load-posts", "client:component-export": "default", "class": "astro-Z52ZSSOH" })}` })}` })}` })}` })}

`;
});

const $$file = "/Users/marcoseiza/Repos/PersonalWebSite/src/pages/blog.astro";
const $$url = "/blog";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$Blog,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/posts/test.md', _page1],['src/pages/blog.astro', _page2],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/index.56753f26.css","assets/blog-index-posts-test.f8de311f.css","assets/blog-index.3af70659.css"],"scripts":[{"type":"external","value":"hoisted.0d4e2078.js"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog-index-posts-test.f8de311f.css"],"scripts":[{"type":"external","value":"hoisted.0d4e2078.js"}],"routeData":{"route":"/posts/test","type":"page","pattern":"^\\/posts\\/test\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/posts/test.md","pathname":"/posts/test","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.7f5f0f89.css","assets/blog-index.3af70659.css","assets/blog-index-posts-test.f8de311f.css"],"scripts":[{"type":"external","value":"hoisted.0d4e2078.js"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/Users/marcoseiza/Repos/PersonalWebSite/src/content/about.md":"chunks/about.f0454eab.mjs","@astrojs/react/client.js":"client.5eb191a4.js","/astro/hoisted.js?q=0":"hoisted.0d4e2078.js","/@fs/Users/marcoseiza/Repos/PersonalWebSite/src/components/react-components/load-posts":"load-posts.63c16cd7.js","/Users/marcoseiza/Repos/PersonalWebSite/src/pages/posts/test.md":"chunks/test.75a5f2cc.js","astro:scripts/before-hydration.js":""},"assets":["/assets/blog.7f5f0f89.css","/assets/blog-index.3af70659.css","/assets/blog-index-posts-test.f8de311f.css","/assets/index.56753f26.css","/client.5eb191a4.js","/hoisted.0d4e2078.js","/load-posts.63c16cd7.js","/chunks/index.304fda30.js","/chunks/load-posts.87566c9b.js","/chunks/test.75a5f2cc.js","/img/big-checker.png","/img/checker.png","/img/cornell.svg","/img/goose.gif","/img/microsoft.svg","/img/noise.png","/img/profile.jpeg","/img/site-preview.png"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { Fragment as F, createVNode as c, handler };