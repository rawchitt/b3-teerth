# 🎨 SoundChain - Visual Design Reference

## Color Palette

### Primary Colors
```
Purple Primary:    #667eea  ████████
Purple Secondary:  #764ba2  ████████
Pink Accent:       #f093fb  ████████
Red Accent:        #f5576c  ████████
```

### Background Colors
```
Dark Primary:      #0a0a0f  ████████
Dark Secondary:    #13131a  ████████
Dark Tertiary:     #1a1a24  ████████
Card Background:   rgba(26, 26, 36, 0.6)  ████████ (semi-transparent)
```

### Text Colors
```
Primary Text:      #ffffff  ████████
Secondary Text:    #a0a0b8  ████████
Muted Text:        #6b6b85  ████████
```

### Status Colors
```
Success:           #10b981  ████████
Error:             #ef4444  ████████
Warning:           #f59e0b  ████████
```

### Gradients
```css
Primary Gradient:
  linear-gradient(135deg, #667eea 0%, #764ba2 100%)

Secondary Gradient:
  linear-gradient(135deg, #f093fb 0%, #f5576c 100%)

Success Gradient:
  linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

Background Gradient:
  linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
```

---

## Typography Scale

### Font Families
- **Display/Headings:** Outfit (Google Fonts)
- **Body Text:** Inter (Google Fonts)
- **Monospace:** Courier New (system)

### Font Sizes
```
Hero Title:        clamp(2.5rem, 6vw, 4.5rem)  [40-72px]
Section Title:     2rem                         [32px]
Card Title:        1.1rem                       [17.6px]
Body Text:         1rem                         [16px]
Small Text:        0.875rem                     [14px]
Tiny Text:         0.75rem                      [12px]
```

### Font Weights
```
Light:             300
Regular:           400
Medium:            500
Semibold:          600
Bold:              700
Extrabold:         800
```

---

## Spacing System

```
XS:    0.5rem    [8px]    ████
SM:    1rem      [16px]   ████████
MD:    1.5rem    [24px]   ████████████
LG:    2rem      [32px]   ████████████████
XL:    3rem      [48px]   ████████████████████████
2XL:   4rem      [64px]   ████████████████████████████████
```

---

## Border Radius

```
Small:     8px    ████
Medium:    12px   ██████
Large:     16px   ████████
XLarge:    24px   ████████████
Full:      9999px (pill shape)
```

---

## Shadows

### Shadow Levels
```css
Small:
  0 2px 8px rgba(0, 0, 0, 0.1)

Medium:
  0 4px 16px rgba(0, 0, 0, 0.2)

Large:
  0 8px 32px rgba(0, 0, 0, 0.3)

XLarge:
  0 16px 48px rgba(0, 0, 0, 0.4)

Glass Shadow:
  0 8px 32px 0 rgba(0, 0, 0, 0.37)
```

---

## Component Specifications

### Song Card
```
Dimensions:        280px min-width
Aspect Ratio:      1:1 (cover image)
Border Radius:     16px
Border:            1px solid rgba(255, 255, 255, 0.1)
Background:        rgba(255, 255, 255, 0.05)
Backdrop Filter:   blur(12px)
Padding:           24px
Hover Transform:   translateY(-8px)
Transition:        250ms ease
```

### Play Button (Overlay)
```
Size:              64px × 64px
Border Radius:     50% (circle)
Background:        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Shadow:            0 4px 16px rgba(102, 126, 234, 0.5)
Hover Scale:       1.1
Active Scale:      0.95
```

### Wallet Button
```
Padding:           0.75rem 1.5rem [12px 24px]
Border Radius:     9999px (pill)
Background:        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Shadow:            0 4px 16px rgba(102, 126, 234, 0.3)
Font Weight:       600
Font Size:         0.95rem [15.2px]
Hover Transform:   translateY(-2px)
```

### Audio Player
```
Height:            ~100px
Position:          Fixed bottom
Background:        rgba(255, 255, 255, 0.05)
Backdrop Filter:   blur(12px)
Border Top:        1px solid rgba(255, 255, 255, 0.1)
Padding:           24px 32px
Grid Layout:       1fr 2fr 1fr
```

### Modal
```
Max Width:         400px
Width:             90%
Border Radius:     24px
Background:        #13131a
Border:            1px solid rgba(255, 255, 255, 0.1)
Padding:           48px
Shadow:            0 16px 48px rgba(0, 0, 0, 0.4)
Animation:         modalSlideIn 0.3s ease
```

---

## Animation Specifications

### Floating Orbs
```css
Animation:         float 20s ease-in-out infinite
Keyframes:
  0%, 100%  → translate(0, 0) scale(1)
  33%       → translate(100px, -100px) scale(1.1)
  66%       → translate(-50px, 100px) scale(0.9)

Orb 1:             500px × 500px, delay: 0s
Orb 2:             400px × 400px, delay: 7s
Orb 3:             600px × 600px, delay: 14s
```

### Fade In Up
```css
Animation:         fadeInUp 0.8s ease
Keyframes:
  from → opacity: 0, translateY(30px)
  to   → opacity: 1, translateY(0)
```

### Spinner
```css
Animation:         spin 1s linear infinite
Keyframes:
  from → rotate(0deg)
  to   → rotate(360deg)
```

### Button Shine
```css
Animation:         Shine effect on hover
Pseudo-element:    ::before
Effect:            Gradient sweep from left to right
Duration:          0.5s
```

---

## Responsive Breakpoints

### Mobile Small
```
Max Width:         480px
Grid Columns:      1
Font Scale:        0.9x
Spacing Scale:     0.8x
```

### Mobile Large / Tablet
```
Range:             481px - 768px
Grid Columns:      2
Font Scale:        0.95x
Spacing Scale:     0.9x
```

### Tablet / Small Desktop
```
Range:             769px - 1024px
Grid Columns:      3
Font Scale:        1x
Spacing Scale:     1x
```

### Desktop
```
Min Width:         1025px
Grid Columns:      4-5 (auto-fill)
Font Scale:        1x
Spacing Scale:     1x
Max Container:     1400px
```

---

## Glassmorphism Effect

### Standard Glass
```css
background:        rgba(255, 255, 255, 0.05)
backdrop-filter:   blur(12px)
border:            1px solid rgba(255, 255, 255, 0.1)
box-shadow:        0 8px 32px 0 rgba(0, 0, 0, 0.37)
```

### Intense Glass (Header)
```css
background:        rgba(255, 255, 255, 0.05)
backdrop-filter:   blur(12px)
-webkit-backdrop-filter: blur(12px)
border-bottom:     1px solid rgba(255, 255, 255, 0.1)
```

---

## Icon Specifications

### Logo Icon
```
Size:              40px × 40px
Stroke Width:      2px
Fill:              Gradient (primary)
```

### Navigation Icons
```
Size:              20px × 20px
Stroke Width:      1.5px
Color:             currentColor
```

### Play Icons
```
Small (card):      16px × 16px
Medium (overlay):  28px × 28px
Large (player):    28px × 28px
```

---

## State Variations

### Hover States
```
Cards:             translateY(-8px), border glow
Buttons:           translateY(-2px), shadow increase
Links:             color change, underline scale
```

### Active States
```
Buttons:           translateY(0), scale(0.98)
Play Button:       scale(0.95)
```

### Disabled States
```
Opacity:           0.5
Cursor:            not-allowed
Pointer Events:    none
```

### Loading States
```
Spinner:           Rotating gradient circle
Opacity:           0.7
Cursor:            wait
```

---

## Grid Layouts

### Song Grid
```css
display:           grid
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
gap:               32px
```

### Player Grid
```css
display:           grid
grid-template-columns: 1fr 2fr 1fr
gap:               32px
align-items:       center
```

### Stats Grid
```css
display:           flex
justify-content:   center
gap:               32px
flex-wrap:         wrap
```

---

## Accessibility

### Focus States
```css
outline:           2px solid #667eea
outline-offset:    2px
border-radius:     inherit
```

### Contrast Ratios
```
Primary Text:      21:1 (AAA)
Secondary Text:    7:1 (AA)
Muted Text:        4.5:1 (AA)
```

### Touch Targets
```
Minimum Size:      44px × 44px
Recommended:       48px × 48px
```

---

## Performance Targets

### Load Times
```
First Paint:       < 1 second
Interactive:       < 2 seconds
Full Load:         < 3 seconds
```

### Animation Performance
```
Frame Rate:        60fps
GPU Acceleration:  transform, opacity
Avoid:             width, height, top, left
```

---

## Design Principles

1. **Glassmorphism First** - Every card uses frosted glass effect
2. **Gradient Accents** - Purple-to-pink gradient for emphasis
3. **Smooth Animations** - 250ms default, 400ms for complex
4. **Dark Theme** - Deep backgrounds with vibrant accents
5. **Micro-interactions** - Every interaction has feedback
6. **Responsive** - Mobile-first, scales beautifully
7. **Premium Feel** - High-quality visuals that impress

---

## Quick Copy-Paste

### Primary Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Glass Effect
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
```

### Smooth Transition
```css
transition: all 250ms ease;
```

### Hover Lift
```css
transform: translateY(-8px);
```

---

**Use this reference when customizing or extending the design!** 🎨
