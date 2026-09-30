# Ready Margin motion

The public site uses shared values from `lib/motion-tokens.ts`. The server renders readable content; Motion enhances offscreen sections after loading. Native browser scrolling and Next navigation remain in control.

- 80 ms: immediate state feedback.
- 180 ms: hover, press, tab content, disclosure and exit feedback.
- 350 ms: menu, drawer and section entrances.
- Section stagger: 30 ms, capped at 90 ms; travel: 8 px.
- Interactive card hover: 2 px on a fine pointer. Static cards stay still.
- Menus and product drawers retain their content during exit and return focus after closing.
- Reduced motion, saved motion opt-out, data saver and low-memory devices skip section animations.
- Keyboard navigation completes active section entrances and stops later entrances.
- Filtered content is registered when it mounts. Observer and animation resources are released on route changes.

The rounded paper, ink and gold panels use the existing brand hues. Cash and workflow previews are labelled as illustrative. Provider connections and financial actions are not live in previews.
