# 📚 True Card Stacking System - Visual Reference

## ✨ New Behavior

Cards now **physically stack on top of each other** in the same position, with new sections sliding up from the bottom to cover previous ones - exactly like stacking physical cards or file folders!

---

## 🎬 Animation Sequence

### Initial State (Scroll Position 0%)
```
┌──────┐
│Objet.│ ← Tab visible at top
└──────┘
┌─────────────────────────────────┐
│                                 │
│      OBJETIVO SECTION           │
│      (Card 0 - Visible)         │
│                                 │
└─────────────────────────────────┘
```

### Scroll Down (14% - Section 1 sliding up)
```
┌──────┐┌──────────┐
│Objet.││Benefic...│ ← Both tabs visible
└──────┘└──────────┘
┌─────────────────────────────────┐
│      OBJETIVO                   │
│      (Partially covered)        │
│   ┌─────────────────────────┐   │
│   │                         │   │ ← New card sliding up
│   │   BENEFICIARIOS        │   │    from bottom
│   │   (translateY: 50%)    │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Fully Stacked (28% - Section 1 active)
```
┌──────┐┌──────────┐
│Objet.││Benefic...│ ← Active tab highlighted
└──────┘└──────────┘
┌─────────────────────────────────┐
│                                 │
│      BENEFICIARIOS              │
│      (Fully stacked on top)     │
│      (translateY: 0%)           │
│                                 │
└─────────────────────────────────┘
        ↓ (Objetivo hidden below)
```

### Continue Scrolling (42% - Section 2 sliding)
```
┌──────┐┌──────────┐┌───────┐
│Objet.││Benefic...││Riesgos│ ← 3 tabs visible
└──────┘└──────────┘└───────┘
┌─────────────────────────────────┐
│      BENEFICIARIOS              │
│   ┌─────────────────────────┐   │
│   │                         │   │ ← Riesgos sliding up
│   │   RIESGOS              │   │
│   │   (translateY: 50%)    │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Final Stack (100% - All sections)
```
┌──────┐┌──────────┐┌───────┐┌──────────┐┌─────────┐┌──────────┐┌────────┐
│Objet.││Benefic...││Riesgos││Metodol...││Resultados││Evaluación││Contacto│
└──────┘└──────────┘└───────┘└──────────┘└─────────┘└──────────┘└────────┘
                                                                      ↑ Active
┌─────────────────────────────────┐
│                                 │
│      CONTACTO                   │
│      (Top card - z-index: 16)   │
│                                 │
└─────────────────────────────────┘
        ↓ (6 cards hidden below)
```

---

## 🏗️ Technical Architecture

### Scroll-Driven Animation

**Container Structure:**
```tsx
<div className="overflow-y-auto"> {/* Scrollable container */}
  <div style={{ height: '700vh' }}> {/* Scroll spacer (7 sections × 100vh) */}
    <div className="sticky top-0 h-screen"> {/* Sticky viewport */}
      
      {/* All cards positioned absolutely in same spot */}
      <div style={{ position: 'absolute', ...getCardStyle(0) }}>
        Card 0
      </div>
      <div style={{ position: 'absolute', ...getCardStyle(1) }}>
        Card 1
      </div>
      {/* ... more cards ... */}
      
    </div>
  </div>
</div>
```

### Card Style Calculation

```typescript
const getCardStyle = (index: number) => {
  const sectionProgress = scrollProgress * sections.length;
  const cardProgress = sectionProgress - index;
  
  // Card becomes visible when cardProgress >= 0
  const isVisible = cardProgress >= 0;
  
  // translateY: 100% → 0% as card slides up
  const translateY = isVisible 
    ? Math.max(0, (1 - cardProgress) * 100)  // Slide from bottom
    : 100;                                    // Hidden below
  
  // Opacity: 0 → 1 as card appears
  const opacity = isVisible 
    ? Math.min(1, cardProgress * 2)  // Fade in quickly
    : 0;
  
  // Scale: 0.95 → 1.0 for subtle depth
  const scale = isVisible 
    ? 0.95 + (Math.min(1, cardProgress) * 0.05)
    : 0.95;

  return {
    transform: `translateY(${translateY}%) scale(${scale})`,
    opacity,
    zIndex: 10 + index,  // Higher cards on top
    pointerEvents: isActive ? 'auto' : 'none',
  };
};
```

---

## 📊 Scroll Progress Mapping

### Scroll Position → Active Section

```
Scroll: 0%   → Section 0 (Objetivo)
Scroll: 14%  → Section 1 (Beneficiarios)
Scroll: 28%  → Section 2 (Riesgos)
Scroll: 42%  → Section 3 (Metodología)
Scroll: 57%  → Section 4 (Resultados)
Scroll: 71%  → Section 5 (Evaluación)
Scroll: 85%  → Section 6 (Contacto)
```

**Formula:**
```typescript
const sectionProgress = scrollProgress * sections.length;
const currentIndex = Math.floor(sectionProgress);
```

---

## 🎨 Z-Index Layering

Cards stack with progressively higher z-index:

```css
Card 0 (Objetivo):       z-index: 10
Card 1 (Beneficiarios):  z-index: 11
Card 2 (Riesgos):        z-index: 12
Card 3 (Metodología):    z-index: 13
Card 4 (Resultados):     z-index: 14
Card 5 (Evaluación):     z-index: 15
Card 6 (Contacto):       z-index: 16 ← Topmost
```

**Result:** Later cards always appear on top of earlier ones when stacked.

---

## 🎭 Animation Timeline

### Card Slide-Up Sequence (1 second)

```
Time: 0ms     → translateY(100%), opacity(0)      [Hidden below]
Time: 200ms   → translateY(80%),  opacity(0.4)    [Sliding up]
Time: 500ms   → translateY(40%),  opacity(0.8)    [Visible]
Time: 700ms   → translateY(10%),  opacity(0.95)   [Almost there]
Time: 1000ms  → translateY(0%),   opacity(1)      [Fully stacked]
```

**Timing Function:** `ease-out` (700ms duration)
**Scale Effect:** Grows from 0.95 → 1.0 during slide

---

## 🖱️ Interaction Methods

### 1. **Scroll** (Primary)
- Scroll down → Next card slides up from bottom
- Scroll up → Current card slides back down, revealing previous

### 2. **Navigation Buttons** (Bottom-left)
- **← Anterior** → Jump to previous section
- **Siguiente →** → Jump to next section
- Smooth scroll to calculated position

### 3. **Progress Rail** (Right side)
- Click any dot → Jump directly to that section
- Visual indicator of current position

### 4. **Tab Clicks** (Top)
- Click any tab → Smooth scroll to that section
- Active tab highlighted with orange accent

### 5. **Keyboard**
- `↓` / `PageDown` → Next section
- `↑` / `PageUp` → Previous section
- `Home` → First section
- `End` → Last section

---

## 📏 Scroll Spacer Calculation

To enable scroll-driven stacking, we need vertical scroll space:

```typescript
// Total scroll height = number of sections × viewport height
scrollHeight = sections.length × 100vh
             = 7 × 100vh
             = 700vh

// Each section occupies 14.28% of total scroll (100vh)
```

This creates enough scroll distance to trigger all card animations.

---

## 🎨 Visual Effects

### Slide-Up Animation
```css
transition: all 700ms ease-out;
transform: translateY(var(--progress)%);
```

### Depth Effect (Scale)
```css
/* Cards grow slightly as they come forward */
scale: 0.95 → 1.0
```

### Fade-In
```css
/* Cards fade in as they slide up */
opacity: 0 → 1 (doubled speed vs translateY)
```

### Pointer Events
```css
/* Only active card is interactive */
pointer-events: index === currentIndex ? 'auto' : 'none';
```

---

## 🏷️ Tab System Integration

### Tabs Remain Independent

The horizontal tab stacking (file folder effect) **continues to work** exactly as before:

```tsx
<div className="card-tab" style={{
  left: `calc(var(--grid-unit) * 4 + ${index * 140}px)`,
  zIndex: 100 + index,  // Separate z-index space (100+)
}}>
  {icon}
  <span>{label}</span>
</div>
```

**Tab z-index:** 100-106 (always above cards)
**Card z-index:** 10-16 (below tabs)

This ensures tabs are always visible and clickable!

---

## 📱 Responsive Behavior

### Desktop
- Full scroll spacer (700vh)
- Smooth 700ms animations
- All 7 tabs visible

### Tablet
- Same scroll mechanism
- Slightly faster animations (500ms)
- Last 1-2 tabs hidden

### Mobile
- Reduced scroll spacer (500vh)
- Quick animations (400ms)
- Only first 5 tabs visible

---

## ♿ Accessibility Features

### Screen Reader Announcements
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  Sección activa: {currentSection.label}
</div>
```

### Keyboard Navigation
- Full keyboard control (arrows, Page Up/Down, Home/End)
- Focus management on navigation
- Skip links for section jumping

### Pointer Events Management
```typescript
// Only active card receives interaction
pointerEvents: isActive ? 'auto' : 'none'
```

Prevents users from accidentally interacting with hidden cards.

---

## 🎯 User Experience Benefits

### 1. **Physical Metaphor**
Mimics real-world file folder stacking - intuitive and familiar

### 2. **Context Awareness**
Tabs show all sections at once - users know what's available

### 3. **Smooth Progression**
Scroll-driven animation feels natural and responsive

### 4. **Multiple Navigation Paths**
- Scroll (primary)
- Tabs (quick jump)
- Buttons (step-by-step)
- Rail (visual navigation)
- Keyboard (power users)

### 5. **Visual Delight**
Beautiful slide-up animation with depth and polish

---

## 🔄 State Management

### Scroll State
```typescript
const [scrollProgress, setScrollProgress] = useState(0); // 0-1
const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // 0-6
```

### Update on Scroll
```typescript
useEffect(() => {
  const handleScroll = () => {
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(progress);
    
    const newIndex = Math.floor(progress * sections.length);
    setCurrentSectionIndex(newIndex);
  };
  
  container.addEventListener('scroll', handleScroll);
}, []);
```

---

## 🎬 Complete Animation Breakdown

### Section 0 → Section 1 Transition

**Scroll from 0% to 20%:**

```
0%:   Card 1 hidden (translateY: 100%, opacity: 0)
      Card 0 visible (translateY: 0%, opacity: 1)

5%:   Card 1 appears (translateY: 90%, opacity: 0.1)
      Card 0 visible  (translateY: 0%, opacity: 1)

10%:  Card 1 sliding (translateY: 70%, opacity: 0.4)
      Card 0 visible  (translateY: 0%, opacity: 1)

15%:  Card 1 rising  (translateY: 40%, opacity: 0.8)
      Card 0 visible  (translateY: 0%, opacity: 1)

20%:  Card 1 stacked (translateY: 0%, opacity: 1)    ← NEW ACTIVE
      Card 0 hidden  (translateY: 0%, opacity: 1)    ← COVERED
```

**Z-Index ensures Card 1 appears above Card 0!**

---

## 🚀 Performance Optimizations

### 1. **Hardware Acceleration**
```css
transform: translateY() scale();  /* GPU accelerated */
will-change: transform, opacity;  /* Hint to browser */
```

### 2. **Pointer Events Management**
```typescript
pointerEvents: isActive ? 'auto' : 'none'
```
Inactive cards don't block interactions or trigger reflows.

### 3. **Transition Duration**
```css
transition: all 700ms ease-out;
```
Smooth enough to feel premium, fast enough to feel responsive.

### 4. **Sticky Positioning**
```tsx
<div className="sticky top-0 h-screen">
```
Efficient scroll performance - no JavaScript repositioning needed!

---

## 💡 Pro Tips

### Smooth Scrolling
- Use `smooth` scroll behavior for programmatic navigation
- Native browser smooth scrolling performs best

### Section Spacing
- Each section gets equal scroll space (100vh)
- Adjust by changing scroll spacer height

### Animation Tuning
- Increase duration for more dramatic effect
- Decrease for snappier transitions
- Adjust opacity multiplier for faster/slower fades

### Custom Progress Curves
```typescript
// Current: Linear
const translateY = (1 - cardProgress) * 100;

// Alternative: Ease-out curve
const translateY = Math.pow(1 - cardProgress, 2) * 100;
```

---

## 🎉 Summary

The new **true card stacking system** creates a beautiful, intuitive interface where:

✅ **All cards stack in the same position** (absolute positioning)
✅ **New sections slide up from bottom** (translateY animation)
✅ **Tabs remain horizontally stacked** (file folder effect preserved)
✅ **Scroll-driven progression** (natural, responsive)
✅ **Multiple navigation methods** (scroll, tabs, buttons, keyboard, rail)
✅ **Smooth 700ms animations** (polished, premium feel)
✅ **Proper z-index layering** (later cards on top)
✅ **Fully accessible** (keyboard, screen readers, focus management)

**It's like flipping through a beautiful deck of cards or file folders - intuitive, elegant, and delightful!** 📚✨
