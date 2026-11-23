import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import { h } from "hastscript";

function generate(title, children, hint) {
  const indicators = [];

  if (hint) {
    indicators.push({
      type: "html",
      value: hint,
    });
  }

  const titleNode = fromMarkdown(title).children[0];
  if (titleNode.type === "paragraph") {
    titleNode.data = {
      hName: "div",
      hProperties: { className: ["callout-title"] },
    };
  } else {
    titleNode.data = {
      hProperties: { className: ["callout-title"] },
    };
  }
  indicators.push(titleNode);

  return [
    {
      type: "paragraph",
      data: {
        hName: "div",
        hProperties: { className: ["callout-indicator"] },
      },
      children: indicators,
    },
    {
      type: "paragraph",
      data: {
        hName: "div",
        hProperties: { className: ["callout-content"] },
      },
      children,
    },
  ];
}

function lucideIcon(nodes) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true">${nodes}</svg>`;
}

const callouts = {
  note: {
    title: "Note",
    hint: lucideIcon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  },
  success: {
    title: "Success",
    hint: lucideIcon('<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>'),
  },
  warn: {
    title: "Warning",
    hint: lucideIcon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  },
  danger: {
    title: "Danger",
    hint: lucideIcon('<path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/>'),
  },
  tip: {
    title: "Tip",
    hint: lucideIcon('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  },
};

/**
 * adds callouts/admonitions
 * ```
 * :::warn{title="example"}
 * example warning
 * :::
 * ```
 *
 * supports: warn, note, success, danger, tip
 * @see {@link callouts} to edit icons
 */
export default function remarkCalloutDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "containerDirective") {
        if (!callouts[node.name]) {
          return;
        }
        const callout = callouts[node.name];
        const data = node.data || (node.data = {});
        const { title, ...attributes } = node.attributes;

        node.attributes = {
          ...attributes,
          class:
            "class" in attributes
              ? `callout callout-${node.name} ${attributes.class}`
              : `callout callout-${node.name}`,
        };

        node.children = generate(
          title || callout.title,
          node.children,
          callout.hint
        );

        const tagName = callout.tagName || "aside";
        const hast = h(tagName, node.attributes);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
