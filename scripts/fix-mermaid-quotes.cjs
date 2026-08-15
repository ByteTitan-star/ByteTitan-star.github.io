const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function needsQuote(text) {
  if (!text) return false;
  if (text.startsWith('"') && text.endsWith('"')) return false;
  // special mermaid chars or non-ascii (Chinese labels)
  return /[\/()（）「」:：|&<>]|[^\x00-\x7F]/.test(text);
}

function quoteInner(text) {
  if (!needsQuote(text)) return text;
  const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '#quot;');
  return `"${escaped}"`;
}

/** Fix one mermaid diagram body */
function fixMermaid(body) {
  let out = body;

  // subgraph Chinese / spaced titles: subgraph 索引流水线 → subgraph s1["索引流水线"]
  let subgraphIdx = 0;
  out = out.replace(/^([ \t]*)subgraph[ \t]+(.+?)[ \t]*$/gm, (full, indent, title) => {
    const t = title.trim();
    if (!t || t.startsWith('"') || /[[\"]/.test(t) || /^[A-Za-z][\w-]*$/.test(t)) {
      // already id-only ASCII or quoted form like id["title"]
      if (/^[\w-]+$/.test(t) && /[^\x00-\x7F]/.test(t)) {
        // unlikely
      } else if (/^[\w-]+(\[|\s*\[)/.test(t) || (t.startsWith('"') && t.endsWith('"'))) {
        return full;
      } else if (/^[A-Za-z][\w-]*$/.test(t)) {
        return full;
      }
    }
    if (/^[A-Za-z][\w-]*\s*\[/.test(t)) return full; // id["title"] or id[title]
    if (/^["'].*["']$/.test(t)) return full;
    subgraphIdx += 1;
    const id = `sg${subgraphIdx}`;
    return `${indent}subgraph ${id}["${t.replace(/"/g, '')}"]`;
  });

  // Diamond nodes: A{text} / A{"text"}
  out = out.replace(/(\b[A-Za-z][\w]*)\{([^{}\n]+)\}/g, (full, id, inner) => {
    const t = inner.trim();
    if (t.startsWith('"') && t.endsWith('"')) return full;
    if (!needsQuote(t)) return full;
    return `${id}{${quoteInner(t)}}`;
  });

  // Cylinder: A[(text)]
  out = out.replace(/(\b[A-Za-z][\w]*)\[\(([^\]\n]+)\)\]/g, (full, id, inner) => {
    const t = inner.trim();
    if (t.startsWith('"') && t.endsWith('"')) return full;
    if (!needsQuote(t) && !/[^\x00-\x7F]/.test(t)) return full;
    return `${id}[(${quoteInner(t)})]`;
  });

  // Stadium: A([text])
  out = out.replace(/(\b[A-Za-z][\w]*)\(\[([^\]\n]+)\]\)/g, (full, id, inner) => {
    const t = inner.trim();
    if (t.startsWith('"') && t.endsWith('"')) return full;
    if (!needsQuote(t)) return full;
    return `${id}([${quoteInner(t)}])`;
  });

  // Circle: A((text))
  out = out.replace(/(\b[A-Za-z][\w]*)\(\(([^)\n]+)\)\)/g, (full, id, inner) => {
    const t = inner.trim();
    if (t.startsWith('"') && t.endsWith('"')) return full;
    if (!needsQuote(t)) return full;
    return `${id}((${quoteInner(t)}))`;
  });

  // Standard rectangle A[text] — skip already quoted and shape forms starting with ( / [[ 
  out = out.replace(/(\b[A-Za-z][\w]*)\[([^\]\n]+)\]/g, (full, id, inner) => {
    const t = inner.trim();
    if (t.startsWith('"') && t.endsWith('"')) return full;
    if (t.startsWith('(') || t.startsWith('[') || t.startsWith('/') || t.startsWith('\\')) return full;
    if (!needsQuote(t)) return full;
    return `${id}[${quoteInner(t)}]`;
  });

  return out;
}

function processFile(file) {
  const abs = path.resolve(file);
  let body = fs.readFileSync(abs, 'utf8');
  let count = 0;
  const next = body.replace(/```mermaid\r?\n([\s\S]*?)```/g, (full, code) => {
    const fixed = fixMermaid(code);
    if (fixed !== code) count += 1;
    return '```mermaid\n' + fixed.replace(/\n$/, '') + '\n```';
  });
  if (count) fs.writeFileSync(abs, next);
  return count;
}

let total = 0;
for (const f of walk('src/content')) {
  const n = processFile(f);
  if (n) {
    console.log(f, 'fixed fences', n);
    total += n;
  }
}
// also en-full drafts if any mermaid
for (const f of walk('scripts/en-full')) {
  if (!f.endsWith('.md')) continue;
  const n = processFile(f);
  if (n) {
    console.log(f, 'fixed fences', n);
    total += n;
  }
}
console.log('total fences fixed', total);
