//! Prints nested rule text as the flat rules the Lynx template encoder keeps.
//!
//! The encoder drops every nested style rule, so a nested selector moves into its own rule
//! with `&` replaced by the enclosing selector, and a nested at-rule wraps the rule instead of
//! sitting inside it. Declarations keep their authored order across the resulting rules.

/// One parsed piece of a block body.
enum Node<'a> {
    /// A nested block and its prelude.
    Block { body: &'a str, prelude: &'a str },
    /// Declarations between blocks, each ending in `;`.
    Declarations(&'a str),
}

/// Appends `css`, a sequence of rules that may nest, to `output` as flat rules on one line.
pub fn write(output: &mut String, css: &str) {
    walk(output, &parse(css), &[], &[]);
}

fn walk(output: &mut String, nodes: &[Node<'_>], selectors: &[String], at_rules: &[&str]) {
    let mut declarations = String::new();

    for node in nodes {
        match node {
            Node::Declarations(text) => declarations.push_str(text),
            Node::Block { body, prelude } => {
                rule(output, selectors, at_rules, &declarations);
                declarations.clear();

                if prelude.starts_with('@') {
                    let mut nested = at_rules.to_vec();

                    nested.push(prelude);
                    walk(output, &parse(body), selectors, &nested);
                } else {
                    walk(output, &parse(body), &compose(selectors, prelude), at_rules);
                }
            }
        }
    }

    rule(output, selectors, at_rules, &declarations);
}

fn rule(output: &mut String, selectors: &[String], at_rules: &[&str], declarations: &str) {
    if selectors.is_empty() || crate::js::trim(declarations).is_empty() {
        return;
    }

    for at_rule in at_rules {
        output.push_str(at_rule);
        output.push('{');
    }

    for (index, selector) in selectors.iter().enumerate() {
        if index > 0 {
            output.push(',');
        }

        output.push_str(selector);
    }

    output.push('{');
    output.push_str(declarations);
    output.push('}');

    for _ in at_rules {
        output.push('}');
    }
}

/// Resolves each item of a nested selector list against every enclosing selector.
fn compose(parents: &[String], prelude: &str) -> Vec<String> {
    let items = split(prelude);

    if parents.is_empty() {
        return items.iter().map(|item| (*item).to_owned()).collect();
    }

    let mut selectors = Vec::with_capacity(items.len() * parents.len());

    for item in items {
        for parent in parents {
            selectors.push(substitute(item, parent));
        }
    }

    selectors
}

/// Replaces each unquoted `&` in a selector with `parent`. A selector without `&` is a
/// descendant of the parent, as in CSS nesting.
fn substitute(selector: &str, parent: &str) -> String {
    let mut output = String::with_capacity(selector.len() + parent.len());
    let mut replaced = false;
    let mut start = 0;

    scan(selector, |index, byte| {
        if byte == b'&' {
            output.push_str(selector.get(start..index).unwrap_or_default());
            output.push_str(parent);
            start = index + 1;
            replaced = true;
        }
    });
    output.push_str(selector.get(start..).unwrap_or_default());

    if !replaced {
        output.clear();
        output.push_str(parent);
        output.push(' ');
        output.push_str(selector);
    }

    output
}

/// Splits a selector list at its top-level commas.
fn split(list: &str) -> Vec<&str> {
    let mut items = Vec::new();
    let mut depth = 0_u32;
    let mut start = 0;

    scan(list, |index, byte| match byte {
        b'(' | b'[' => depth += 1,
        b')' | b']' => depth = depth.saturating_sub(1),
        b',' if depth == 0 => {
            items.push(crate::js::trim(list.get(start..index).unwrap_or_default()));
            start = index + 1;
        }
        _ => {}
    });
    items.push(crate::js::trim(list.get(start..).unwrap_or_default()));
    items
}

/// Splits a block body into declarations and nested blocks in authored order.
fn parse(css: &str) -> Vec<Node<'_>> {
    let mut nodes = Vec::new();
    let mut depth = 0_u32;
    // Start of the text since the last declaration or block ended.
    let mut segment = 0;
    // Start of the declarations not yet recorded.
    let mut pending = 0;
    let mut prelude = 0;
    let mut opened = 0;

    scan(css, |index, byte| match byte {
        b'{' => {
            if depth == 0 {
                if segment > pending {
                    nodes.push(Node::Declarations(
                        css.get(pending..segment).unwrap_or_default(),
                    ));
                }

                prelude = segment;
                opened = index;
            }

            depth += 1;
        }
        b'}' => {
            depth = depth.saturating_sub(1);

            if depth == 0 {
                nodes.push(Node::Block {
                    body: css.get(opened + 1..index).unwrap_or_default(),
                    prelude: crate::js::trim(css.get(prelude..opened).unwrap_or_default()),
                });
                segment = index + 1;
                pending = segment;
            }
        }
        b';' if depth == 0 => segment = index + 1,
        _ => {}
    });

    let rest = css.get(pending..).unwrap_or_default();

    if !crate::js::trim(rest).is_empty() {
        nodes.push(Node::Declarations(rest));
    }

    nodes
}

/// Visits each byte outside strings, comments, and escapes.
fn scan(text: &str, mut visit: impl FnMut(usize, u8)) {
    let bytes = text.as_bytes();
    let mut index = 0;
    let mut quote = None;

    while let Some(&byte) = bytes.get(index) {
        if byte == b'\\' {
            index += 2;
            continue;
        }

        if let Some(open) = quote {
            if byte == open {
                quote = None;
            }

            index += 1;
            continue;
        }

        if matches!(byte, b'"' | b'\'') {
            quote = Some(byte);
        } else if byte == b'/' && bytes.get(index + 1) == Some(&b'*') {
            index = memchr::memmem::find(bytes.get(index + 2..).unwrap_or_default(), b"*/")
                .map_or(bytes.len(), |end| index + 2 + end + 2);
            continue;
        } else {
            visit(index, byte);
        }

        index += 1;
    }
}
