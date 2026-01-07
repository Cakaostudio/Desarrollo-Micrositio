# 📂 Stacked Folder Tabs - Visual Reference

## ✨ Overview

The Project Detail Page now features beautiful **file folder-style stacked tabs** that appear horizontally across the top of each card section. As you scroll, each new section's tab appears to the right of the previous ones, creating a layered, tactile folder effect.

---

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────┐┌──────────┐┌────────┐┌────────────┐┌───────────┐...  │
│  │Objetivo ││Benefic...││Riesgos ││Metodología ││Resultados │     │
│  └─────────┘└──────────┘└────────┘└────────────┘└───────────┘     │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │                                                              │  │
│ │                    CARD SECTION CONTENT                      │  │
│ │                                                              │  │
│ └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 Tab Specifications

### Desktop (≥769px)
- **Width**: Max 160px per tab
- **Height**: 20px (2.5 grid units)
- **Spacing**: 140px between tab start positions
- **Position**: 32px from left edge + (index × 140px)
- **Font**: 11px, semibold, uppercase, 0.02em letter-spacing

### Tablet (481px - 768px)
- **Width**: Max 110px per tab
- **Spacing**: 100px between tabs
- **Font**: 10px
- **Hidden**: Tabs 6-7 (last sections)

### Mobile (≤480px)
- **Width**: Max 90px per tab
- **Spacing**: 75px between tabs
- **Font**: 9px
- **Hidden**: Tabs 5-7 (to prevent overflow)

---

## 🎭 States & Animations

### 1. **Default State**
```css
- Background: Soft gradient (rgba(250, 250, 252, 0.95))
- Shadow: Subtle depth (1px 3px rgba(0,0,0,0.08))
- Border: Light stroke on top/left/right
- Transform: none
```

### 2. **Active State** (current section in view)
```css
- Transform: translateY(-2px) (elevated)
- Shadow: Enhanced depth (2px 6px rgba(0,0,0,0.12))
- Bottom border: 2px orange accent line
- Animation: Subtle pulse effect
```

### 3. **Hover State**
```css
- Transform: translateY(-1px)
- Shadow: Medium depth (2px 4px rgba(0,0,0,0.1))
- Cursor: pointer
- Transition: 280ms ease
```

### 4. **Focus State** (keyboard navigation)
```css
- Outline: 2px solid orange (accessible)
- Outline offset: 2px
- Transform: translateY(-2px)
```

### 5. **Active State**
```css
- Transform: translateY(0) (press down effect)
- Transition: 50ms (instant feedback)
```

---

## 🎬 Entrance Animation

**Keyframes: `tabLabelFadeIn`**
```css
From: {
  opacity: 0
  transform: translateX(-20px) translateY(4px)
}
To: {
  opacity: 1
  transform: translateX(0) translateY(0)
}
Duration: 220ms
Easing: cubic-bezier(0.22, 1, 0.36, 1)
Delay: 110ms
```

**Effect**: Tabs slide in from the left with a fade, creating a cascading reveal as you scroll down.

---

## 🏗️ Z-Index Stacking

Each tab has progressively higher z-index based on its position:

```
Tab 0 (Objetivo):      z-index: 100
Tab 1 (Beneficiarios): z-index: 101
Tab 2 (Riesgos):       z-index: 102
Tab 3 (Metodología):   z-index: 103
Tab 4 (Resultados):    z-index: 104
Tab 5 (Evaluación):    z-index: 105
Tab 6 (Contacto):      z-index: 106
```

This ensures later tabs appear "on top" of earlier ones, mimicking physical file folders.

---

## 🎨 Visual Depth Cues

### Left Side Notch (tabs 1-6)
```css
::before pseudo-element
- Width: 8px
- Position: Left edge (-8px)
- Gradient: to left, rgba(0,0,0,0.03) → transparent
- Effect: Creates shadow/overlap effect from previous tab
```

### Border Treatment
```css
- Left/Right/Top: 1px solid rgba(12, 65, 89, 0.1)
- Bottom: Open (connects to card)
- Radius: 10px on top corners only
```

### Backdrop Filter
```css
backdrop-filter: blur(8px)
- Creates frosted glass effect
- Allows card content to show through subtly
```

---

## 🎯 Tab Content

### Structure
```tsx
<div className="card-tab">
  {icon}           // Lucide icon (14px)
  <span>{label}</span>  // Section name
</div>
```

### Labels
```typescript
'objective':     'Objetivo'
'beneficiaries': 'Beneficiarios'
'risk-factors':  'Riesgos'
'methodology':   'Metodología'
'results':       'Resultados'
'evaluation':    'Evaluación'
'footer':        'Contacto'
```

### Icons
- 📋 **Objetivo**: Target icon
- 👥 **Beneficiarios**: Users icon
- ⚠️ **Riesgos**: AlertTriangle icon
- 🔬 **Metodología**: FlaskConical icon
- 📊 **Resultados**: TrendingUp icon
- ⭐ **Evaluación**: Award icon
- 📞 **Contacto**: Mail icon

---

## ⚡ Interactivity

### Click/Tap Behavior
```typescript
onClick={() => {
  sectionRef.current?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}}
```
**Effect**: Smooth scroll to the section when tab is clicked

### Keyboard Navigation
```typescript
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    scrollToSection();
  }
}}
```
**Supports**: Enter and Space keys for accessibility

### ARIA Labels
```html
role="button"
tabIndex={0}
aria-label="Ir a sección: [Section Name]"
```

---

## 🎭 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .card-tab {
    animation: none;
    transition: opacity 220ms ease-out;
  }
  
  /* Simpler fade-in only */
  @keyframes tabLabelFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

---

## 📱 Responsive Behavior

### Desktop Strategy
✅ All 7 tabs visible  
✅ 140px spacing (comfortable overlap)  
✅ Full labels visible  

### Tablet Strategy
✅ Tabs 0-5 visible (6 tabs)  
❌ Last tab hidden to prevent overflow  
✅ 100px spacing (tighter)  
✅ Truncated labels with ellipsis  

### Mobile Strategy
✅ Tabs 0-4 visible (5 tabs)  
❌ Last 2-3 tabs hidden  
✅ 75px spacing (very tight)  
✅ Short labels only  

---

## 🎨 Color Tokens

### Light Mode
```css
Background: rgba(250, 250, 252, 0.95)
Text:       oklch(0.35 0.05 250) /* Deep blue-gray */
Border:     rgba(12, 65, 89, 0.1) /* Navy tint */
Active:     oklch(0.65 0.25 30)  /* Orange accent */
Shadow:     rgba(0, 0, 0, 0.08)
```

### Dark Mode
```css
Background: rgba(30, 30, 32, 0.95)
Text:       oklch(0.85 0.02 250)
Border:     rgba(255, 255, 255, 0.1)
Active:     oklch(0.65 0.25 30)
Shadow:     rgba(0, 0, 0, 0.3)
```

---

## 🔧 Technical Implementation

### Component: `StackedCardSection.tsx`
```tsx
<div 
  className="card-tab"
  data-active={isActive}
  data-index={index}
  onClick={scrollToSection}
  style={{
    left: `calc(var(--grid-unit) * 4 + ${index * 140}px)`,
    zIndex: 100 + index,
    '--data-index': index,
  }}
>
  {icon}
  <span>{label}</span>
</div>
```

### CSS Custom Properties
```css
--grid-unit: 8px
--radius-tab: 10px
--duration-small: 220ms
--duration-medium: 280ms
--ease-interactive: cubic-bezier(0.4, 0, 0.2, 1)
--ease-enter: cubic-bezier(0.22, 1, 0.36, 1)
```

---

## ✨ Visual Hierarchy

```
┌─ Level 5: Active Tab (z-index 100+, elevated, accent line)
├─ Level 4: Hovered Tab (elevated, enhanced shadow)
├─ Level 3: Later Tabs (higher z-index, overlap earlier)
├─ Level 2: Earlier Tabs (lower z-index, partially covered)
└─ Level 1: Card Content (z-index 10, below tabs)
```

---

## 🎯 User Experience Benefits

### 1. **Spatial Navigation**
Users can see which section they're in AND what's coming next

### 2. **Quick Access**
Click any tab to jump directly to that section (smooth scroll)

### 3. **Progress Indicator**
Horizontal tab accumulation shows how far through content

### 4. **Visual Delight**
Mimics familiar physical filing system - intuitive and satisfying

### 5. **Context Awareness**
See up to 7 section titles at once on desktop

---

## 🚀 Performance Optimizations

### Will-Change
```css
/* Only on active/near cards */
will-change: transform, opacity;

/* Removed from inactive cards */
.stacked-card[data-state="inactive"] {
  will-change: auto;
}
```

### Hardware Acceleration
```css
backface-visibility: hidden;
-webkit-font-smoothing: antialiased;
transform: translateZ(0); /* GPU layer */
```

### Content Visibility
```css
.stacked-card[data-state="far"] {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

---

## 🎨 Design Inspiration

The stacked folder tab design is inspired by:
- 📁 Physical file folder systems
- 🗂️ Multi-tab browser interfaces
- 📑 Document organization apps
- 🎴 Trading card layering effects

**Result**: A familiar, tactile, and delightful interaction pattern that makes complex content feel organized and accessible.

---

## 🔄 Future Enhancements

Potential improvements for v2:

1. **Tab Drag & Reorder** - Allow users to reorganize sections
2. **Tab Groups** - Collapse related tabs into dropdowns
3. **Mini Preview** - Hover on tab shows section preview thumbnail
4. **Swipe Gestures** - Mobile swipe between tabs
5. **Favorites** - Pin important sections to always show tab
6. **Custom Colors** - User-defined tab colors per project
7. **Tab Search** - Filter/search within tab labels

---

## 📊 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile Safari (iOS 14+)  
✅ Chrome Mobile (Android 8+)  

**Graceful Degradation**: Older browsers see standard tabs without advanced animations.

---

## 🎉 Summary

The stacked folder tabs transform the Project Detail Page from a simple scrolling experience into an **organized, navigable, and visually delightful interface** that honors both modern web design principles and timeless physical metaphors.

**Key Features:**
- ✅ 7 horizontally stacked tabs
- ✅ Smooth scroll-to-section on click
- ✅ Active section highlighting
- ✅ Progressive z-index layering
- ✅ Responsive overflow handling
- ✅ Full keyboard accessibility
- ✅ Reduced motion support
- ✅ Premium animations

**Visual Impact:** 🌟🌟🌟🌟🌟

Enjoy exploring your projects with the new file folder navigation! 📂✨
