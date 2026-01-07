# Stacked Cards View - Implementation Guide

## Overview

The Stacked Cards View transforms the traditional scrolling project detail page into a modern, folder-like slide-card experience. Each section of the project stacks on top of previous sections as users scroll, creating a delightful and organized reading experience.

## Activation

### Feature Flag
The stacked cards view is controlled via a URL parameter:

```
/proyecto/:projectId?view=stacked
```

**Examples:**
- Traditional view: `/proyecto/PRJ-001`
- Stacked cards view: `/proyecto/PRJ-001?view=stacked`

### Toggle Default View
To make stacked cards the default experience, modify `/pages/ProjectDetailPage.tsx`:

```typescript
// Change this line:
const useStackedCards = searchParams.get('view') === 'stacked';

// To this:
const useStackedCards = searchParams.get('view') !== 'traditional';
```

## Architecture

### Components

#### 1. `ProjectStackedCardsView.tsx`
Main container component that orchestrates the entire stacked cards experience.

**Key Features:**
- Manages scroll-driven section visibility
- Handles keyboard navigation (PageUp/PageDown, Arrow keys)
- Coordinates with progress rail
- Implements IntersectionObserver for section tracking

#### 2. `StackedCardSection.tsx`
Individual card component representing one section.

**Props:**
- `id`: Unique identifier for the section
- `index`: Order in the stack (determines z-index and offset)
- `title`: Section heading
- `children`: Section content
- `bgColor`: Background color (defaults to white)
- `aria-label`: Accessibility label

**Styling:**
- Sticky positioning with calculated top offset
- Rounded top corners (16px) for folder effect
- Shadow effects that intensify when active
- Tab-like top edge for enhanced folder appearance

#### 3. `ProgressRail.tsx`
Navigation component that shows current position and allows direct navigation.

**Desktop:**
- Vertical rail on the right side
- Dot indicators with labels
- Active section highlighted in orange (#ff8012)
- Hover tooltips for each section

**Mobile:**
- Horizontal breadcrumb at the top
- Pills showing all sections
- Active section highlighted
- Horizontal scroll for overflow

## Sections

The stacked cards view includes **7 sections** in the following order:

1. **Objective** (`objective`)
   - Main project goal and vision
   - Large typewriter text effect
   - White background

2. **Beneficiaries** (`beneficiaries`)
   - Who benefits from the project
   - Text + image layout
   - Light gray background (#fafafa)

3. **Risk Factors** (`risk-factors`)
   - Identified risks and challenges
   - Image + text layout (reversed)
   - White background

4. **Methodology** (`methodology`)
   - How the project is implemented
   - Text + image layout
   - Light gray background (#fafafa)

5. **Results** (`results`)
   - Outcomes and achievements
   - Image + text layout (reversed)
   - White background

6. **Evaluation** (`evaluation`)
   - Assessment criteria and score
   - Special metrics card
   - Soft gray background (#f5f5f5)

7. **Footer** (`footer`)
   - Contact information
   - Social media links
   - White background

## Adding or Reordering Sections

### Add a New Section

1. **Update the sections array** in `ProjectStackedCardsView.tsx`:

```typescript
const sections = [
  // ... existing sections
  { id: 'new-section', label: 'New Section' },
];
```

2. **Add the section component** in the render:

```tsx
<StackedCardSection
  id="new-section"
  index={7} // Increment from last section
  title="New Section Title"
  bgColor="bg-white" // Choose appropriate background
  aria-label="Description for screen readers"
>
  {/* Your content here */}
</StackedCardSection>
```

### Reorder Sections

Simply change the `index` prop and the order in the sections array:

```typescript
// Before
{ id: 'results', label: 'Resultados' }, // index: 4
{ id: 'evaluation', label: 'Evaluación' }, // index: 5

// After (swapped)
{ id: 'evaluation', label: 'Evaluación' }, // index: 4
{ id: 'results', label: 'Resultados' }, // index: 5
```

Update the corresponding `<StackedCardSection>` components:

```tsx
<StackedCardSection id="evaluation" index={4} ... />
<StackedCardSection id="results" index={5} ... />
```

## Behavior

### Stacking Mechanics

- **Sticky Positioning**: Each card uses `position: sticky` with increasing top offset
- **Z-Index Layering**: Higher index = higher z-index (appears on top)
- **Scroll Snap**: Cards snap to start position for clean alignment
- **Tab Offset**: Each card is offset by 8px from the previous (creates folder tabs effect)

### Animations

#### Entry Animation (220-280ms)
```css
opacity: 0 → 1
translateY: 32px → 0
scale: 0.98 → 1
```

#### Exit Animation
```css
opacity: 1 → 0
translateY: 0 → -20px
scale: 1 → 0.98
```

#### Active State
- Enhanced shadow when section is in view
- Smooth transition between states

### Scroll Behavior

- **Scroll Snap**: Mandatory Y-axis snapping
- **Smooth Scroll**: Enabled for programmatic navigation
- **Free Scroll**: Users can scroll freely; snap finalizes at rest
- **Keyboard Navigation**:
  - `PageDown` / `ArrowDown`: Next section
  - `PageUp` / `ArrowUp`: Previous section

## Accessibility

### ARIA Support

- Each section has `aria-label` for screen readers
- Progress rail has `aria-label="Navegación de secciones"`
- Active section marked with `aria-current="true"`
- Semantic HTML (`<section>`, `<h2>`, `<nav>`)

### Reduced Motion

Users with `prefers-reduced-motion` preference receive:
- No slide animations (simple fade only)
- Scroll snap still enabled
- Instant navigation transitions

### Keyboard Navigation

- Full keyboard support via arrow keys and PageUp/PageDown
- Progress rail buttons are keyboard focusable
- Smooth focus management

## Responsive Design

### Desktop (≥1024px)
- Full stacked cards with vertical progress rail
- Maximum content width: 980px
- Generous padding and spacing

### Tablet (768px - 1023px)
- Reduced padding
- Smaller images (400px instead of 500px)
- Vertical progress rail remains

### Mobile (<768px)
- Horizontal breadcrumb replaces vertical rail
- Stacked layout for text + image sections
- Reduced shadows for performance
- Smaller typography

## Performance Optimizations

### CSS Containment
```css
contain: content;
```
Isolates layout and paint for each card.

### Will-Change
```css
will-change: transform, opacity;
```
Hints to browser for GPU acceleration.

### IntersectionObserver
Efficient tracking of visible sections without scroll listeners.

### Lazy Image Loading
Images load as sections come into view.

## Styling Customization

### Colors
Section background colors can be customized via the `bgColor` prop:

```tsx
<StackedCardSection bgColor="bg-blue-50" ... />
```

### Spacing
Adjust card offset by modifying the `top` style:

```typescript
style={{
  top: `${safeTop + index * 8}px`, // Change 8px to desired offset
}}
```

### Animations
Modify animation timing in `globals.css`:

```css
@keyframes cardEnter {
  /* Adjust timing and easing here */
}
```

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Scroll Snap**: CSS Scroll Snap Module Level 1
- **Sticky Positioning**: Widely supported
- **IntersectionObserver**: Native API (polyfill available if needed)

## Troubleshooting

### Cards Not Stacking
- Check that `position: sticky` is supported
- Verify parent container doesn't have `overflow: hidden`
- Ensure z-index values are incrementing

### Scroll Snap Not Working
- Verify `scroll-snap-type: y mandatory` on container
- Check `scroll-snap-align: start` on each card
- Ensure no conflicting CSS

### Progress Rail Not Updating
- Check IntersectionObserver is initializing
- Verify `data-index` attributes are set correctly
- Inspect `rootMargin` settings

### Performance Issues
- Reduce image sizes
- Add `loading="lazy"` to images
- Check for unnecessary re-renders
- Use React DevTools Profiler

## Future Enhancements

Potential improvements for future iterations:

1. **View Transition API**: Smoother transitions between traditional/stacked views
2. **Gesture Controls**: Swipe gestures on mobile
3. **Dynamic Sections**: Load sections on demand
4. **Customization Panel**: User-controlled card order
5. **Print Styles**: Optimized layout for printing
6. **Deep Linking**: Navigate directly to specific sections via URL hash
7. **Animation Preferences**: User-selectable animation speed
8. **Theme Support**: Dark mode for stacked cards

## Support

For issues or questions:
- Check this guide first
- Review component source code
- Test with feature flag on/off
- Verify browser compatibility
- Check console for errors

---

**Version**: 1.0  
**Last Updated**: 2025-10-16  
**Maintainer**: Development Team
