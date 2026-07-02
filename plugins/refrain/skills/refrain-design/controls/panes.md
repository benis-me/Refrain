# Panes

Use panes when the user compares, inspects, or keeps runtime context visible.

## Defaults

- sidebar for global areas
- primary work plane for the main object
- resizable inspection panes for preview, files, conversation, quality, history,
  versions, or logs
- thin visual handle with generous hit target
- persisted size only when returning to a task benefits from memory

## States

Panes need designed empty, loading, disconnected, and populated states. A blank
pane should never look like a rendering failure.

## Reject

- decorative split layouts with no inspection purpose
- panes that hide the primary command at common widths
- resize handles that break app drag regions or focus
