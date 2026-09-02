import { decodeHTML } from 'entities';
import { HTMLElement, NodeType, parse, type Node } from 'node-html-parser';

type MarkdownMetadata = { title?: string; description?: string; url?: string; language?: string };

const blockTags = new Set(['article', 'aside', 'blockquote', 'dd', 'details', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer', 'form', 'header', 'li', 'main', 'nav', 'ol', 'p', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul']);
const removeSelectors = ['script', 'style', 'noscript', 'template', 'svg', 'canvas', 'iframe', 'picture', 'source', 'img', 'video', 'audio', 'link', 'meta', 'button', 'input', 'select', 'textarea', '[aria-hidden="true"]', '[hidden]', '[data-nextjs-scroll-focus-boundary]', '[data-next-route-announcer]', '[data-analytics-event]', '[data-analytics-label]', '[data-analytics-payload]'];

function normalizeWhitespace(value: string) { return decodeHTML(value).replace(/\s+/g, ' ').trim(); }
function escapeMarkdown(value: string) { return value.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]'); }
function frontmatterValue(value: string) { return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' '); }
function isElement(node: Node): node is HTMLElement { return node.nodeType === NodeType.ELEMENT_NODE; }

function getMetadata(root: HTMLElement, fallbackUrl: string): MarkdownMetadata {
  const title = normalizeWhitespace(root.querySelector('title')?.textContent ?? '');
  const description = normalizeWhitespace(root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '');
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const language = root.querySelector('html')?.getAttribute('lang');
  return { ...(title ? { title } : {}), ...(description ? { description } : {}), url: canonical || fallbackUrl, ...(language ? { language } : {}) };
}

function frontmatter(metadata: MarkdownMetadata) {
  const fields = [metadata.title ? `title: "${frontmatterValue(metadata.title)}"` : '', metadata.description ? `description: "${frontmatterValue(metadata.description)}"` : '', metadata.url ? `url: "${frontmatterValue(metadata.url)}"` : '', metadata.language ? `language: "${frontmatterValue(metadata.language)}"` : ''].filter(Boolean);
  return fields.length ? `---\n${fields.join('\n')}\n---\n\n` : '';
}

function absoluteUrl(href: string, pageUrl: string) { try { return new URL(href, pageUrl).toString(); } catch { return href; } }
function cleanRoot(root: HTMLElement) { for (const selector of removeSelectors) root.querySelectorAll(selector).forEach((node) => node.remove()); root.querySelectorAll('nav, footer').forEach((node) => node.remove()); root.querySelectorAll('[role="navigation"], [role="dialog"], [role="button"]').forEach((node) => node.remove()); }

function inlineText(node: Node, pageUrl: string): string {
  if (node.nodeType === NodeType.TEXT_NODE) return normalizeWhitespace(node.rawText);
  if (!isElement(node)) return '';
  const tagName = node.tagName.toLowerCase();
  if (tagName === 'br') return '\n';
  const childText = node.childNodes.map((child) => inlineText(child, pageUrl)).filter(Boolean).join(' ');
  const text = normalizeWhitespace(childText);
  if (!text) return '';
  if (tagName === 'a') { const href = node.getAttribute('href'); return href ? `[${escapeMarkdown(text)}](${absoluteUrl(href, pageUrl)})` : text; }
  if (tagName === 'strong' || tagName === 'b') return `**${text}**`;
  if (tagName === 'em' || tagName === 'i') return `_${text}_`;
  if (tagName === 'code') return `\`${text.replace(/`/g, '\\`')}\``;
  return text;
}

function tableMarkdown(table: HTMLElement, pageUrl: string) {
  const rows = table.querySelectorAll('tr').map((row) => row.querySelectorAll('th, td').map((cell) => inlineText(cell, pageUrl).replace(/\|/g, '\\|'))).filter((row) => row.some((cell) => cell.length > 0));
  if (!rows.length) return '';
  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalizedRows = rows.map((row) => [...row, ...Array(Math.max(columnCount - row.length, 0)).fill('')]);
  return [`| ${normalizedRows[0].join(' | ')} |`, `| ${Array(columnCount).fill('---').join(' | ')} |`, ...normalizedRows.slice(1).map((row) => `| ${row.join(' | ')} |`)].join('\n');
}

function convertNode(node: Node, pageUrl: string, listDepth = 0): string {
  if (node.nodeType === NodeType.TEXT_NODE) return normalizeWhitespace(node.rawText);
  if (!isElement(node)) return '';
  const tagName = node.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tagName)) { const text = inlineText(node, pageUrl); return text ? `${'#'.repeat(Number(tagName.slice(1)))} ${text}` : ''; }
  if (tagName === 'p') return inlineText(node, pageUrl);
  if (tagName === 'blockquote') { const quote = node.childNodes.map((child) => convertNode(child, pageUrl, listDepth)).filter(Boolean).join('\n\n'); return quote ? quote.split('\n').map((line) => `> ${line}`).join('\n') : ''; }
  if (tagName === 'ul' || tagName === 'ol') { const ordered = tagName === 'ol'; return node.querySelectorAll(':scope > li').map((item, index) => { const prefix = ordered ? `${index + 1}. ` : '- '; const itemText = item.childNodes.map((child) => convertNode(child, pageUrl, listDepth + 1)).filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n'); const indent = '  '.repeat(listDepth); return itemText ? `${indent}${prefix}${itemText.replace(/\n/g, `\n${indent}  `)}` : ''; }).filter(Boolean).join('\n'); }
  if (tagName === 'table') return tableMarkdown(node, pageUrl);
  if (tagName === 'hr') return '---';
  if (tagName === 'pre') { const code = node.textContent.replace(/\n+$/g, ''); return code ? `\`\`\`\n${code}\n\`\`\`` : ''; }
  if (['a', 'strong', 'b', 'em', 'i', 'code'].includes(tagName)) return inlineText(node, pageUrl);
  return node.childNodes.map((child) => convertNode(child, pageUrl, listDepth)).filter(Boolean).join(blockTags.has(tagName) ? '\n\n' : ' ');
}

export function htmlToMarkdown(html: string, pageUrl: string) {
  const root = parse(html, { blockTextElements: { script: false, noscript: false, style: false, pre: true } });
  const metadata = getMetadata(root, pageUrl);
  const main = root.querySelector('main') ?? root.querySelector('body') ?? root;
  cleanRoot(main);
  const body = convertNode(main, metadata.url ?? pageUrl).split('\n').map((line) => line.replace(/[ \t]+$/g, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return `${frontmatter(metadata)}${body}\n`;
}
