# Interface Generation Prompt Contract

When asked to design or implement a Refrain-style interface, produce decisions in
this order:

1. main product loop
2. chosen surface archetype
3. token plan
4. typography plan
5. surface and layout plan
6. control plan
7. state plan
8. one product-specific detail
9. real-surface verification plan

Keep the answer concrete. Name the controls, panes, states, and routes the next
agent should build. Do not return a generic style manifesto.

## Minimal Prompt

```txt
Use Refrain interface design. Start from the real workflow, choose the smallest
operational surface, define tokens and states, then implement one verified
vertical slice.
```
