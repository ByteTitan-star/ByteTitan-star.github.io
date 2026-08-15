/**
 * Split markdown at `<!-- i18n:en -->` into zh/en panels for site language toggle.
 * Without the marker, content is shown for both languages (legacy fallback).
 */
export function remarkI18nSplit() {
  return (tree) => {
    const children = tree.children ?? [];
    const splitIndex = children.findIndex(
      (node) => node?.type === 'html' && /<!--\s*i18n:en\s*-->/i.test(String(node.value || ''))
    );

    const wrap = (lang, nodes) => [
      { type: 'html', value: `<div class="article-panel" data-lang-panel="${lang}">` },
      ...nodes,
      { type: 'html', value: '</div>' }
    ];

    if (splitIndex === -1) {
      tree.children = [...wrap('zh', children), ...wrap('en', children)];
      return;
    }

    const zhNodes = children.slice(0, splitIndex);
    const enNodes = children.slice(splitIndex + 1);
    tree.children = [...wrap('zh', zhNodes), ...wrap('en', enNodes)];
  };
}
