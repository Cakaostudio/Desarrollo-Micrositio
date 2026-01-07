# Testing Stacked Cards View

## Overview
This document provides testing guidelines for the new stacked cards view feature in the project detail page.

## Accessing the Feature

### Method 1: URL Parameter (Feature Flag)
Add `?view=stacked` to any project detail URL:

```
Traditional: /proyecto/PRJ-001
Stacked:     /proyecto/PRJ-001?view=stacked
```

### Method 2: Toggle Button
Click the floating "Vista de tarjetas" button in the bottom-right corner of any project detail page.

## Test Cases

### 1. Visual Appearance ✓

**Test Steps:**
1. Navigate to `/proyecto/PRJ-001?view=stacked`
2. Verify hero section displays correctly
3. Check that cards stack with increasing z-index
4. Confirm rounded corners (16px) on card tops
5. Verify subtle tab effect above each card
6. Check shadows appear on active cards

**Expected Result:**
- Cards appear layered like a folder stack
- Each card has a subtle tab at the top
- Active card has enhanced shadow
- Smooth visual hierarchy

### 2. Scroll Behavior ✓

**Test Steps:**
1. Open stacked cards view
2. Scroll down slowly
3. Scroll up slowly
4. Try scrolling quickly
5. Stop scrolling mid-section

**Expected Result:**
- Cards snap to start position
- Smooth scroll with easing
- Snap finalizes when scroll stops
- No jank or stuttering
- 60fps performance

### 3. Navigation - Progress Rail (Desktop) ✓

**Test Steps:**
1. View on desktop (≥768px width)
2. Locate vertical progress rail on right side
3. Click each dot to navigate
4. Hover over dots to see labels
5. Observe active state changes

**Expected Result:**
- Rail appears on right side at vertical center
- Dots are clearly visible
- Labels appear on hover
- Active section highlighted in orange
- Smooth scroll to clicked section

### 4. Navigation - Breadcrumb (Mobile) ✓

**Test Steps:**
1. View on mobile (<768px width)
2. Locate horizontal breadcrumb at top
3. Scroll horizontally if needed
4. Tap each section to navigate
5. Observe active state

**Expected Result:**
- Breadcrumb appears at top
- Current section highlighted
- Pills are tappable
- Horizontal scroll if overflow
- Smooth navigation

### 5. Keyboard Navigation ✓

**Test Steps:**
1. Focus on the page
2. Press `PageDown` or `ArrowDown`
3. Press `PageUp` or `ArrowUp`
4. Try navigating through all sections

**Expected Result:**
- PageDown/ArrowDown moves to next section
- PageUp/ArrowUp moves to previous section
- Smooth scroll animation
- Stops at first/last section

### 6. Section Content ✓

**Test Steps:**
1. Navigate through all 7 sections
2. Verify each section displays correctly:
   - Objective
   - Beneficiaries
   - Risk Factors
   - Methodology
   - Results
   - Evaluation
   - Footer

**Expected Result:**
- All sections present
- Content formatted correctly
- Images load properly
- Text is readable
- Spacing is appropriate

### 7. Animations ✓

**Test Steps:**
1. Scroll to trigger card entrance
2. Observe entry animation
3. Note transition timing
4. Check for smoothness

**Expected Result:**
- Cards enter with: translateY(32px→0), opacity(0→1), scale(0.98→1)
- Duration: 220-280ms
- Smooth cubic-bezier easing
- No layout shifts

### 8. Reduced Motion ✓

**Test Steps:**
1. Enable "Reduce motion" in OS settings
2. Open stacked cards view
3. Navigate between sections
4. Observe animations

**Expected Result:**
- Slide animations disabled
- Simple fade transitions only
- Scroll snap still works
- Instant navigation

### 9. Responsive Design ✓

**Test Steps:**
1. Test at 320px width (mobile)
2. Test at 768px width (tablet)
3. Test at 1024px width (desktop)
4. Test at 1920px width (large desktop)

**Expected Result:**
- Mobile: Breadcrumb, stacked layout, smaller images
- Tablet: Breadcrumb→Rail transition, adjusted spacing
- Desktop: Vertical rail, side-by-side layouts
- All: Content readable, no overflow

### 10. Performance ✓

**Test Steps:**
1. Open DevTools Performance tab
2. Record while scrolling through all sections
3. Check frame rate
4. Monitor CPU/GPU usage
5. Check for memory leaks

**Expected Result:**
- Consistent 60fps
- No dropped frames
- Efficient CPU usage
- No memory leaks
- Smooth on mid-tier devices

### 11. Accessibility ✓

**Test Steps:**
1. Use screen reader (NVDA/JAWS/VoiceOver)
2. Navigate with keyboard only
3. Check ARIA labels
4. Verify heading hierarchy
5. Test focus management

**Expected Result:**
- All sections have proper ARIA labels
- Progress rail is keyboard accessible
- Section headings are h2 elements
- Focus visible and logical
- Screen reader announces sections

### 12. View Toggle ✓

**Test Steps:**
1. Open traditional view
2. Click "Vista de tarjetas" button
3. Verify switch to stacked view
4. Click "Vista tradicional" button
5. Verify switch back

**Expected Result:**
- Button appears in bottom-right
- Toggle switches views instantly
- URL updates correctly
- No data loss
- Smooth transition

### 13. Back Navigation ✓

**Test Steps:**
1. From map, open project in stacked view
2. Click back button in hero section
3. Verify return to map
4. Try browser back button

**Expected Result:**
- Back button visible in hero
- Returns to previous page
- Browser back works
- No errors

### 14. Share Functionality ✓

**Test Steps:**
1. Open stacked cards view
2. Click share button
3. Verify share dialog
4. Check shared URL

**Expected Result:**
- Share button visible
- Native share dialog opens
- Correct project URL shared
- Works on all platforms

### 15. Browser Compatibility ✓

**Test Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Expected Result:**
- Feature works in all browsers
- No console errors
- Scroll snap works
- Sticky positioning works
- IntersectionObserver works

## Known Issues

### Issue 1: Safari Scroll Snap
**Description:** Safari may have different scroll snap behavior
**Workaround:** Test thoroughly on Safari and adjust CSS if needed

### Issue 2: Mobile Keyboard
**Description:** Virtual keyboard may affect viewport height
**Workaround:** Use `vh` units carefully, test with keyboard open

### Issue 3: High DPI Displays
**Description:** Shadows may appear differently on retina displays
**Workaround:** Test on various pixel densities

## Performance Benchmarks

### Target Metrics
- First Paint: <1s
- Time to Interactive: <2s
- Frame Rate: 60fps
- Scroll Performance: Smooth (no jank)
- Memory Usage: <50MB increase

### Testing Tools
- Chrome DevTools Performance
- Lighthouse
- WebPageTest
- React DevTools Profiler

## Debugging Tips

### Cards Not Stacking
1. Check browser console for errors
2. Verify sticky positioning support
3. Inspect z-index values
4. Check parent overflow settings

### Scroll Snap Issues
1. Verify scroll-snap-type on container
2. Check scroll-snap-align on cards
3. Test in different browsers
4. Review CSS conflicts

### Performance Problems
1. Profile with DevTools
2. Check image sizes
3. Verify will-change usage
4. Monitor re-renders
5. Check for memory leaks

### Progress Rail Not Updating
1. Verify IntersectionObserver
2. Check data-index attributes
3. Inspect rootMargin settings
4. Review observer callback

## Success Criteria

✓ All 7 sections display correctly  
✓ Smooth 60fps scrolling  
✓ Keyboard navigation works  
✓ Progress rail functional  
✓ Mobile breadcrumb works  
✓ Animations smooth  
✓ Reduced motion respected  
✓ Responsive at all breakpoints  
✓ WCAG AA contrast maintained  
✓ Screen reader accessible  
✓ No console errors  
✓ Browser compatible  
✓ View toggle works  
✓ Back navigation works  

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Screen size / device
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots or video
6. Console errors (if any)
7. URL with feature flag

## Additional Resources

- [Stacked Cards Guide](/guidelines/Stacked-Cards-Guide.md)
- Component source: `/components/ProjectStackedCardsView.tsx`
- CSS animations: `/styles/globals.css`
- Progress rail: `/components/ProgressRail.tsx`

---

**Test Date**: 2025-10-16  
**Tester**: [Your Name]  
**Status**: ✓ Ready for QA
