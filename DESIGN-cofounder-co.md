# Design System Inspired by Cofounder

> Auto-extracted from `https://cofounder.co/` on 2026-09-20

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "Cofounder lets you run an entire company with AI".

**Key Characteristics:**
- neoris as the heading font (custom web font loaded via @font-face)
- neoris as the body font for all running text
- Heading weight 400
- Light/white background (#f5f5f2) as the primary canvas
- Primary accent `#dae9fb` used for CTAs and brand highlights
- 8 shadow level(s) detected — tinted shadows
- Rounded corners (0.3px+) creating a friendly, approachable feel
- Tags: light, rounded, monochrome, monospace, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#dae9fb`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Background** (`#f5f5f2`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#e8e7e6`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#171717`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#666666`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#fafaf7`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#f5f5f2` | `--palette-1` | button | large | text-dark |
| 2 | `#e8e7e6` | `--palette-2` | section | large | text-dark |
| 3 | `#ffffff` | `--palette-3` | button | large | text-dark |
| 4 | `#202020` | `--palette-4` | button | medium | text-light |
| 5 | `#dae9fb` | `--palette-5` | badge | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `neoris` (web font)
- **Body Font:** `neoris` (web font)

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | neoris | 46px | 400 | 49.68px | normal |
| H2 | neoris | 40px | 400 | 46px | normal |
| H3 | neoris | 36px | 400 | 40.32px | 0.32px |
| Body | TT Neoris Trial Variable | 16px | 460 | 22.4px | 0.15px |
| Code | neoris | 16px | 400 | 24px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `46px` | headings |
| H1 | `40px` | headings |
| H2 | `36px` | headings |
| H3 | `32px` | headings |
| H4 | `26px` | headings |
| Body L | `20px` | body / supporting text |
| Body | `19px` | body / supporting text |
| Small | `17px` | body / supporting text |
| XS | `16px` | body / supporting text |
| Caption | `15px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #fbfbf8;
  border-radius: 0px;
  padding: 0px 6px;
  font-size: 15px;
  font-weight: 410;
  border: none;
  cursor: pointer;
}
```

### Outline Button

```css
.btn-outline {
  background: transparent;
  color: #171717;
  border-radius: 8px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid rgb(56, 56, 56);
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #f1f1ee;
  color: #171717;
  border-radius: 8px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid rgba(32, 32, 32, 0.1);
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #e7e7e1;
  color: #171717;
  border-radius: 8px;
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid rgba(32, 32, 32, 0.1);
  cursor: pointer;
}
```

### Filled Button 3

```css
.btn-filled-3 {
  background: #f5f5f2;
  color: #171717;
  border-radius: 8px;
  padding: 0px 12px;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid rgba(32, 32, 32, 0.1);
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #ffffff;
  border-radius: 8px;
  padding: 0px 12px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #f3f3f0;
  border-radius: 10px;
  padding: 28px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.12) 1px 1px 4px 0px inset, rgba(255, 255, 255, 0.7) -2px -2px 3px 0px inset;
}
```

## 5. Layout Principles

- **Base spacing unit:** `2px` — use multiples (4px, 6px, 8px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `2px` | element |
| spacing-2 | `12px` | element |
| spacing-3 | `6px` | element |
| spacing-4 | `8px` | element |
| spacing-5 | `2.8px` | element |
| spacing-6 | `3px` | element |
| spacing-7 | `9px` | element |
| spacing-8 | `10px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-subtle | `0.3px` | subtle |
| radius-button | `8px` | button |
| radius-subtle | `4px` | subtle |
| radius-subtle | `3px` | subtle |
| radius-card | `50px` | card |
| radius-button | `10px` | button |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgb(255, 255, 255) 0px 0px 0px 0.829px inset, rgba(0, 0, 0, 0.08) 0px 0px 0px 0....` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1.469px 0px 0px inse...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0.12) 0px -1px 0px 0px inset, rgba(0, 0, 0, 0.1) 0px -1px 2px 0px ...` | Cards, subtle elevation |
| Low | `rgb(255, 255, 255) 0px 0.577px 0px 0px` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#f5f5f2` as the primary background color
- Use `neoris` for all headings and `neoris` for body text
- Use `#dae9fb` as the single dominant accent/CTA color
- Maintain `2px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`0.3px`+) consistently for all interactive elements
- Stick to grayscale + `#dae9fb` accent — avoid color overload
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 400 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute neoris/neoris with generic alternatives
- Don't use irregular spacing — stick to 2px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't add additional saturated colors beyond the primary accent
- Don't use pure black (#000000) for text — use `#171717` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 2px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #f5f5f2
Text:        #171717
Accent:      #dae9fb
Border:      #fafaf7
```

### Example Prompts

1. "Build a hero section with a `#f5f5f2` background, `neoris` heading in `#171717`, and a `#dae9fb` CTA button with 8px radius."
2. "Create a pricing card using background `#e8e7e6`, border `#fafaf7`, `neoris` for text, and 6px padding."
3. "Design a navigation bar — `#f5f5f2` background, `#171717` links, `#dae9fb` for active state."
4. "Build a feature grid with 3 columns, 6px gap, each card using the card component style."
5. "Create a footer with `#171717` background, `#f5f5f2` text, and 4px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 2 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--background` | `#f5f5f2` |
| `--foreground` | `#171717` |
