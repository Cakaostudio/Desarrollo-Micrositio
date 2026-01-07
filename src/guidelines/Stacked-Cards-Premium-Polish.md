# Stacked Cards Premium Polish Guide

## Overview

This document describes the premium visual and motion refinements applied to the stacked cards system, creating a smoother, more refined experience without changing the underlying structure or logic.

## Visual Refinements

### Card Styling

**Border Radius**: 15px (var(--radius-card))
- Softer than the original 16px for a more refined feel
- Consistent across all cards

**Inner Stroke**: 1px using color-mix
```css
border: 1px solid color-mix(in oklch, currentColor 8%, transparent);
```
- Subtle definition without harsh borders
- Adapts to light/dark modes
- Uses OKLCH color space for perceptual uniformity

**Elevation Scale**: Shadow tokens with layered depth
- **Inactive (0)**: No shadow
- **Near (1)**: Subtle definition
  ```css
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 0 0 1px rgba(0, 0, 0, 0.02)
  ```
- **Hovered (2)**: Gentle lift
  ```css
  0 2px 8px rgba(0, 0, 0, 0.04),
  0 1px 3px rgba(0, 0, 0, 0.06),
  0 0 0 1px rgba(0, 0, 0, 0.02)
  ```
- **Active (4)**: Pronounced elevation
  ```css
  0 8px 24px rgba(0, 0, 0, 0.08),
  0 4px 12px rgba(0, 0, 0, 0.06),
  0 2px 4px rgba(0, 0, 0, 0.04),
  0 0 0 1px rgba(0, 0, 0, 0.02)
  ```

**Gradient Overlays**: Subtle depth without saturation
- White sections: `165deg, rgba(255, 255, 255, 1) 0%, rgba(250, 250, 252, 1) 100%`
- Gray sections: `165deg, rgba(250, 250, 250, 1) 0%, rgba(245, 245, 247, 1) 100%`
- Soft sections: `165deg, rgba(245, 245, 245, 1) 0%, rgba(240, 240, 242, 1) 100%`
- Maintains WCAG AA contrast for all text

### Premium Tabs

**Tab Design**:
- Height: 20px (2.5 grid units)
- Padding: 16px horizontal
- Border radius: 10px (top corners only)
- Backdrop blur: 8px
- Position: -20px from card top, 32px from left

**Tab Content**:
- **Icon**: 14x14px lucide-react icon per section
- **Label**: 11px, 600 weight, 0.02em tracking, uppercase
- **Active highlight**: 2px line at bottom in oklch(0.65 0.25 30)

**Tab Colors**: Adapts to section background
- Subtle transparency with backdrop blur
- OKLCH-based color adjustments for consistency

**Section Icons**:
- Objective: FileText
- Beneficiaries: Users
- Risk Factors: AlertTriangle
- Methodology: Wrench
- Results: TrendingUp
- Evaluation: Award
- Footer: Info

### Content Layout

**Baseline Grid**: 8px (var(--grid-unit))
- All spacing uses multiples of 8px
- Vertical rhythm: 24px (3 grid units) line-height
- Consistent spacing throughout

**Line Length**: 62-70ch maximum
- Optimized for readability
- Applied via `.card-content-wrapper`
- Centered with auto margins

**Padding**:
- Top: 80px (10 grid units)
- Sides: 48px (6 grid units)
- Responsive adjustments for mobile

## Motion & Smoothness

### Easing Functions

**Enter Animation**: `cubic-bezier(0.22, 1, 0.36, 1)`
- Gentle ease-out with slight overshoot
- Duration: 280ms (medium)
- Creates confident, premium feel

**Exit Animation**: `cubic-bezier(0.2, 0, 0, 1)`
- Sharp ease-in for quick transitions
- Duration: 220ms (small)
- Efficient exit without lingering

**Interactive**: `cubic-bezier(0.4, 0, 0.2, 1)`
- Standard material design easing
- Duration: 220ms (small)
- For hover and state changes

### Standardized Durations

```css
--duration-small: 220ms   /* Quick interactions */
--duration-medium: 280ms  /* Standard transitions */
--duration-long: 360ms    /* Complex animations */
```

### Scroll-Driven Polish

**Card Activation Interpolation**:
```
translateY: 16px → 0
opacity: 0.85 → 1
scale: 0.995 → 1
shadow: level 2 → level 4
```

**Intersection Thresholds**: [0, 0.1, 0.5, 0.9, 1]
- Fine-grained detection
- Smooth state transitions
- rootMargin: `-20% 0px -20% 0px`

**Card States**:
- `inactive`: Far from view
- `near`: Approaching viewport
- `active`: In primary view (70%+ visible)
- `hovered`: Mouse over (if not active)
- `leaving`: Exiting viewport

### Parallax Effect

**Implementation**: 2-4px range, clamped
- Applied to background layer only
- Calculated from intersection ratio
- Max offset: 3px
- Formula: `(scrollProgress - 0.5) * maxParallax * 2`

**Respects Reduced Motion**: Disabled if `prefers-reduced-motion` is set

### Scroll Snap Hysteresis

**Settings**:
```css
scroll-snap-type: y mandatory;
scroll-padding-top: 60px;
scroll-padding-bottom: 60px;
```

**Margin**: 40-60px effective hysteresis
- Cards commit confidently to snap points
- Prevents jittery snapping
- Natural feel for scrolling

## Performance Optimizations

### Transform & Opacity Only

All animations use GPU-accelerated properties:
- ✅ `transform` (translateY, scale)
- ✅ `opacity`
- ❌ No `box-shadow` animation (uses state-based tokens)
- ❌ No layout properties (width, height, padding in animations)

### Will-Change Strategy

```css
/* Active + next cards only */
.stacked-card[data-state="active"],
.stacked-card[data-state="near"] {
  will-change: transform, opacity;
}

/* Remove from others */
.stacked-card[data-state="inactive"],
.stacked-card[data-state="far"] {
  will-change: auto;
}
```

### Content Visibility

```css
.stacked-card[data-state="far"] {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```
- Browser skips rendering off-screen cards
- Precomputed height prevents layout shift
- Major performance boost on long pages

### Additional Optimizations

```css
backface-visibility: hidden;
-webkit-font-smoothing: antialiased;
contain: content;
```

## Accessibility Features

### Keyboard Navigation

**Standard Keys**:
- `PageDown` / `ArrowDown`: Next section
- `PageUp` / `ArrowUp`: Previous section
- `Home`: Jump to first section
- `End`: Jump to last section

**Smart Detection**: Skips navigation when user is typing in inputs

### Skip Controls

Floating buttons (bottom-left):
- "← Anterior" (Previous)
- "Siguiente →" (Next)
- Focus rings with 2px offset
- Disabled state when at boundaries
- ARIA labels for screen readers

### Live Regions

```html
<div 
  id="section-live-region"
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  Sección activa: [Section Name]
</div>
```

Announces current section to screen readers without interrupting.

### Tab Order

1. Back button (hero section)
2. Share button (hero section)
3. Skip controls (Anterior/Siguiente)
4. Progress rail dots (desktop)
5. Card content (within each section)

### Reduced Motion

Full support for `prefers-reduced-motion`:
- ✅ Animations reduced to simple fades
- ✅ No parallax
- ✅ No micro-settle
- ✅ Scroll snap still works
- ✅ All functionality preserved

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .card-inner-stroke {
    border-width: 2px;
    border-color: currentColor;
  }
  
  .card-tab[data-active="true"]::after {
    height: 3px;
  }
}
```

## Progress Rail Enhancements

### Numbered Dots

**Design**:
- Size: 12px diameter
- Number: 8px, 700 weight, centered
- Number opacity: 0 (visible on active/hover)

**States**:
- Inactive: `oklch(0.75 0.01 250)` (neutral gray)
- Active: `oklch(0.65 0.25 30)` (warm orange)
- Active ring: `0 0 0 4px oklch(0.65 0.25 30 / 0.15)`

**Animation**: `progressPulse` on active dot
```css
@keyframes progressPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}
```

### Mobile Breadcrumb

- Horizontal scroll
- Pill-style indicators
- Touch-optimized targets (48px minimum)
- Active section highlighted

## Feature Flag System

### Enabling Premium Polish

The `polished` prop controls premium features:

```tsx
<StackedCardSection
  id="objective"
  index={0}
  title="Objetivo Principal"
  bgColor="bg-white"
  aria-label="Objetivo principal del proyecto"
  polished={true} // Enable premium features
>
```

### What the Flag Controls

**When `polished={true}`**:
- ✅ Premium tab with icon and label
- ✅ Inner stroke border
- ✅ Gradient background overlay
- ✅ Parallax effect
- ✅ Enhanced elevation shadows
- ✅ Numbered progress dots
- ✅ Intersection observer states
- ✅ 70ch line-length cap

**When `polished={false}`**:
- ✅ Original implementation
- ✅ Section heading visible
- ✅ Standard styling
- ✅ No tabs or parallax
- ✅ Basic shadows

### Global Toggle

To toggle polish for all cards:

```tsx
// In ProjectStackedCardsView.tsx
const ENABLE_POLISH = true; // or get from context/props

<StackedCardSection
  polished={ENABLE_POLISH}
  ...
/>
```

## Token System

### CSS Custom Properties

All tokens defined in `:root`:

```css
/* Motion */
--ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
--ease-exit: cubic-bezier(0.2, 0, 0, 1);
--ease-interactive: cubic-bezier(0.4, 0, 0.2, 1);

/* Durations */
--duration-small: 220ms;
--duration-medium: 280ms;
--duration-long: 360ms;

/* Shadows */
--shadow-0 through --shadow-4

/* Radii */
--radius-card: 15px;
--radius-tab: 10px;

/* Grid */
--grid-unit: 8px;

/* Gradients */
--gradient-white
--gradient-gray
--gradient-soft
```

### Using Tokens

In components:
```tsx
style={{
  borderRadius: 'var(--radius-card)',
  transition: 'transform var(--duration-small) var(--ease-interactive)',
  boxShadow: 'var(--shadow-4)',
}}
```

In CSS:
```css
.my-element {
  animation: myAnim var(--duration-medium) var(--ease-enter);
  padding: calc(var(--grid-unit) * 3);
}
```

## Tuning Per Section

### Adjust Gradient

```tsx
const customGradients = {
  'objective': 'linear-gradient(165deg, ...)',
  'beneficiaries': 'linear-gradient(165deg, ...)',
  // ...
};

<StackedCardSection
  style={{
    '--card-gradient': customGradients[id]
  }}
/>
```

### Adjust Parallax Strength

In `StackedCardSection.tsx`:
```tsx
const maxParallax = 3; // Increase for more parallax
```

### Adjust Shadow Intensity

Modify tokens in `globals.css`:
```css
--shadow-4: 
  0 12px 32px rgba(0, 0, 0, 0.10), /* Increase alpha */
  0 6px 16px rgba(0, 0, 0, 0.08),
  0 3px 6px rgba(0, 0, 0, 0.06),
  0 0 0 1px rgba(0, 0, 0, 0.02);
```

### Adjust Animation Timing

```css
--duration-medium: 320ms; /* Slower for more luxurious feel */
--ease-enter: cubic-bezier(0.19, 1, 0.22, 1); /* Stronger overshoot */
```

## Browser Support

**Full Support**:
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Features Used**:
- CSS Custom Properties
- IntersectionObserver
- color-mix() function
- backdrop-filter
- content-visibility
- OKLCH color space (with fallbacks)

**Graceful Degradation**:
- No color-mix: Falls back to solid borders
- No backdrop-filter: Solid tab backgrounds
- No content-visibility: All cards rendered (slower)
- Older browsers: Standard stacked layout still works

## Testing Checklist

### Visual Quality
- [ ] Inner strokes visible but subtle
- [ ] Shadows match elevation hierarchy
- [ ] Tabs align correctly
- [ ] Gradients smooth and subtle
- [ ] Numbers in progress dots readable
- [ ] Text contrast meets WCAG AA

### Motion Feel
- [ ] Enter animations smooth and confident
- [ ] No jank during scroll
- [ ] Parallax subtle and pleasant
- [ ] Snap feels natural, not forced
- [ ] 60fps maintained on mid-tier devices

### Accessibility
- [ ] Keyboard nav works (all keys)
- [ ] Skip controls functional
- [ ] Live region announces sections
- [ ] Tab order logical
- [ ] Reduced motion respected
- [ ] High contrast mode works

### Performance
- [ ] No CLS (Cumulative Layout Shift)
- [ ] will-change only on active cards
- [ ] Off-screen cards use content-visibility
- [ ] No memory leaks
- [ ] Images lazy-load

## Troubleshooting

### Tabs Not Appearing
- Check `polished={true}` prop
- Verify section ID matches icon mapping
- Check z-index stacking

### Shadows Not Animating
- Shadows use state-based tokens (intentional)
- Check `data-state` attribute changes
- Verify IntersectionObserver firing

### Parallax Not Working
- Check `prefers-reduced-motion` setting
- Verify `polished={true}`
- Check console for errors in calculation

### Performance Issues
- Profile with React DevTools
- Check will-change on inactive cards (should be auto)
- Verify content-visibility on far cards
- Reduce parallax or disable

### Keyboard Nav Broken
- Check event listeners attached
- Verify section IDs correct
- Check for event.preventDefault() conflicts

## Future Enhancements

Potential improvements:

1. **Spring Physics**: Use a physics library for micro-settle
2. **View Transitions API**: Smoother state changes
3. **Scroll-Driven Animations**: Browser-native scroll timeline
4. **Gesture Support**: Swipe navigation on mobile
5. **Adaptive Performance**: Auto-disable parallax on low-end devices
6. **Theme Variants**: Multiple color schemes per section
7. **Custom Tab Positions**: Per-section tab placement
8. **Sound Design**: Subtle audio feedback on snap

## Support

For questions or issues:
1. Check this guide
2. Review token definitions in `globals.css`
3. Inspect component props in `StackedCardSection.tsx`
4. Test with feature flag off to isolate issues
5. Check browser console for errors

---

**Version**: 2.0 (Premium Polish)  
**Last Updated**: October 16, 2025  
**Maintainer**: Development Team  
**Related**: [Stacked Cards Guide](./Stacked-Cards-Guide.md)
