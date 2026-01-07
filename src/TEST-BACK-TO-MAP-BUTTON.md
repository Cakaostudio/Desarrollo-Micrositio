# 🧪 Back to Map Button - Testing Guide

## Quick 2-Minute Test

### ✅ Basic Functionality Test
1. Open the map at `/`
2. Click any project marker
3. Project detail page opens
4. **Check:** Blue "Volver al Mapa" button appears top-left ✅
5. Click the button
6. **Check:** Returns to map view ✅

**Result:** If both checks pass, basic functionality is working! ✨

---

## Comprehensive Test Suite

### Test 1: Visual Appearance ✨

#### Desktop View
1. Open project detail page on desktop browser
2. Observe the button in top-left area

**Expected:**
- [ ] Button has deep blue background (`#0c4159`)
- [ ] White text reads "Volver al Mapa"
- [ ] Left arrow icon (←) visible
- [ ] Right map pin icon (📍) visible
- [ ] White border around button (subtle)
- [ ] Button slides in from left smoothly
- [ ] No overlap with Admin button above

#### Mobile View
1. Open project detail page on mobile device
2. Observe the button in top-left area

**Expected:**
- [ ] Button visible and accessible
- [ ] Text reads "Mapa" (shorter version)
- [ ] Both icons still visible
- [ ] Adequate size for touch (40px+ height)
- [ ] No overflow beyond viewport
- [ ] Clear spacing from edges

---

### Test 2: Animation & Interactions 🎬

#### Entrance Animation
1. Navigate to project detail page
2. Watch the button appear

**Expected:**
- [ ] Slides in from left
- [ ] Takes ~0.4 seconds
- [ ] Smooth bounce effect at end
- [ ] Opacity fades in simultaneously
- [ ] No stuttering or jank

#### Hover State (Desktop)
1. Hover cursor over button
2. Observe changes

**Expected:**
- [ ] Button scales up slightly (5%)
- [ ] Background darkens to `#0a3549`
- [ ] Blue glow appears around button
- [ ] Left arrow (←) moves left 4px
- [ ] Right map pin (📍) scales up 10%
- [ ] All transitions smooth (0.3s)
- [ ] Cursor changes to pointer

#### Click Animation
1. Click the button
2. Observe immediate feedback

**Expected:**
- [ ] Button responds instantly
- [ ] Navigation begins < 100ms
- [ ] No lag or delay
- [ ] Smooth page transition

---

### Test 3: Navigation Functionality 🧭

#### Basic Navigation
```
Test Flow:
Map View → Project Detail → Click Button → Map View
```

**Steps:**
1. Start on map at `/`
2. Click any project marker
3. Project detail opens at `/proyecto/abc123`
4. Click "Back to Map" button
5. Observe result

**Expected:**
- [ ] Returns to map view at `/`
- [ ] Map in same position/zoom
- [ ] No error messages
- [ ] Smooth transition

#### With Filters Applied
```
Test Flow:
Map View (filtered) → Project → Click Button → Map View (filters preserved)
```

**Steps:**
1. Start on map
2. Apply category filter (e.g., "Educación para la Paz")
3. URL shows: `/?categorias=Educación para la Paz`
4. Click filtered project marker
5. Project detail opens
6. Click "Back to Map" button
7. Observe URL and map state

**Expected:**
- [ ] Returns to map
- [ ] URL still has filter: `/?categorias=...`
- [ ] Map shows filtered results
- [ ] Filter dropdown reflects active filter
- [ ] Marker colors match filter

#### With Search Query
```
Test Flow:
Search → Results → Project → Click Button → Search Results Preserved
```

**Steps:**
1. Search for a project by name
2. URL shows: `/?busqueda=keyword`
3. Click search result
4. Project detail opens
5. Click "Back to Map" button
6. Observe result

**Expected:**
- [ ] Returns to map
- [ ] Search query preserved in URL
- [ ] Search input shows query
- [ ] Results still filtered
- [ ] Suggestions may be visible

#### With Multiple Filters + Search
```
Complex scenario test
```

**Steps:**
1. Apply state filter: "Jalisco"
2. Apply category filter: "Transparencia"
3. Enter search query: "gobierno"
4. URL: `/?estado=Jalisco&categorias=Transparencia&busqueda=gobierno`
5. Click filtered project
6. Project detail opens
7. Click "Back to Map" button
8. Check everything preserved

**Expected:**
- [ ] Returns to map
- [ ] URL has all parameters
- [ ] State filter active
- [ ] Category filter active
- [ ] Search query active
- [ ] Correct results shown

#### Direct URL Access
```
Test deep linking
```

**Steps:**
1. Open browser
2. Navigate directly to `/proyecto/abc123`
3. Project detail loads
4. Click "Back to Map" button
5. Observe result

**Expected:**
- [ ] Returns to map at `/`
- [ ] No filters applied (clean state)
- [ ] No errors
- [ ] Normal map view

---

### Test 4: Browser Back Button Interaction 🔄

#### Test Back Button Still Works
1. Navigate: Map → Project Detail
2. Press browser back button (not our button)
3. Observe: Returns to map ✅
4. Press browser forward button
5. Observe: Returns to project detail ✅
6. Click "Back to Map" button
7. Observe: Returns to map ✅
8. Press browser forward button
9. Observe: Returns to project detail ✅

**Expected:**
- [ ] Browser history maintained
- [ ] Back/forward work correctly
- [ ] No duplicate history entries
- [ ] No navigation loops

---

### Test 5: Edge Cases & Error Handling 🔍

#### Invalid Project ID
1. Navigate to `/proyecto/invalid-id-12345`
2. Observe loading state
3. After 1.5 seconds, redirect to map
4. **Note:** Button may briefly appear, but page redirects

**Expected:**
- [ ] "Project not found" message shown
- [ ] Auto-redirect to map after delay
- [ ] No crash or error

#### Rapid Clicking
1. Open project detail
2. Rapidly click "Back to Map" button 5 times fast
3. Observe result

**Expected:**
- [ ] Only navigates once
- [ ] No multiple history entries
- [ ] No errors or crashes
- [ ] Smooth single transition

#### During Loading
1. Open project detail
2. While content loading, click "Back to Map"
3. Observe result

**Expected:**
- [ ] Navigation works immediately
- [ ] No need to wait for content
- [ ] Loading cancelled cleanly
- [ ] Returns to map smoothly

---

### Test 6: Responsive Design 📱

#### Desktop Breakpoints

**Large Desktop (1920px+)**
- [ ] Button positioned correctly
- [ ] Text fully visible
- [ ] No overflow
- [ ] Hover effects work

**Medium Desktop (1280px - 1920px)**
- [ ] Button positioned correctly
- [ ] Text fully visible
- [ ] Proportional sizing
- [ ] Hover effects work

**Small Desktop (1024px - 1280px)**
- [ ] Button positioned correctly
- [ ] Text may start to shrink
- [ ] Still fully accessible
- [ ] Hover effects work

#### Mobile Breakpoints

**Tablet (768px - 1024px)**
- [ ] Shows desktop layout
- [ ] "Volver al Mapa" text visible
- [ ] Touch-friendly size
- [ ] No overlap with content

**Large Mobile (640px - 768px)**
- [ ] Switches to mobile layout
- [ ] Shows "Mapa" text
- [ ] Adequate touch target
- [ ] Icons still visible

**Small Mobile (320px - 640px)**
- [ ] Compact layout works
- [ ] Button doesn't overflow
- [ ] Text readable
- [ ] Touch target adequate

---

### Test 7: Accessibility ♿

#### Keyboard Navigation
1. Load project detail page
2. Press Tab key repeatedly
3. Button should receive focus
4. Press Enter when focused
5. Should navigate back

**Expected:**
- [ ] Button reachable via Tab
- [ ] Clear focus outline visible
- [ ] Enter key activates button
- [ ] No keyboard traps

#### Screen Reader Test
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to project detail
3. Focus on button
4. Listen to announcement

**Expected:**
- [ ] Announces: "Volver al Mapa" or "Mapa"
- [ ] Identifies as button
- [ ] Clear actionable element
- [ ] No ambiguity

#### Color Contrast
1. Use browser DevTools
2. Check contrast ratio
3. Button: White on `#0c4159`

**Expected:**
- [ ] Contrast ratio > 4.5:1 (WCAG AA)
- [ ] Text clearly legible
- [ ] Icons distinguishable
- [ ] Border adds clarity

#### Touch Target Size (Mobile)
1. Open DevTools mobile emulation
2. Inspect button element
3. Measure height and width

**Expected:**
- [ ] Height ≥ 40px (iOS/Android minimum)
- [ ] Width ≥ 40px
- [ ] Adequate spacing around button
- [ ] No accidental taps on nearby elements

---

### Test 8: Performance ⚡

#### Load Time
1. Open DevTools Performance tab
2. Navigate to project detail
3. Record button render time

**Expected:**
- [ ] Component mounts < 1ms
- [ ] Animation starts immediately
- [ ] No layout shift
- [ ] Smooth 60 FPS animation

#### Animation Frame Rate
1. Open DevTools Performance
2. Navigate to project detail
3. Record entrance animation
4. Check FPS graph

**Expected:**
- [ ] Consistent 60 FPS
- [ ] No dropped frames
- [ ] GPU accelerated
- [ ] No layout thrashing

#### Memory Usage
1. Open DevTools Memory tab
2. Navigate between map and project 10 times
3. Check memory graph

**Expected:**
- [ ] No memory leaks
- [ ] Component cleans up properly
- [ ] Stable memory usage
- [ ] No increasing trend

---

### Test 9: Multi-Device Testing 🌐

#### Desktop Browsers

**Chrome/Edge**
- [ ] Button appears correctly
- [ ] Animations smooth
- [ ] Navigation works
- [ ] Hover effects work

**Firefox**
- [ ] Button appears correctly
- [ ] Animations smooth
- [ ] Navigation works
- [ ] Hover effects work

**Safari**
- [ ] Button appears correctly
- [ ] Animations smooth
- [ ] Navigation works
- [ ] Hover effects work

#### Mobile Browsers

**iOS Safari**
- [ ] Button appears correctly
- [ ] Touch targets adequate
- [ ] Animations smooth
- [ ] Navigation works

**Chrome Mobile (Android)**
- [ ] Button appears correctly
- [ ] Touch targets adequate
- [ ] Animations smooth
- [ ] Navigation works

**Samsung Internet**
- [ ] Button appears correctly
- [ ] Touch targets adequate
- [ ] Animations smooth
- [ ] Navigation works

---

### Test 10: Integration with Other Features 🔗

#### With Admin Button
1. Open project detail
2. Observe both buttons

**Expected:**
- [ ] No overlap between buttons
- [ ] Admin button above "Back to Map"
- [ ] Both clearly visible
- [ ] No visual conflicts

#### With Share Button
1. Open project detail
2. Scroll to share button in content
3. Click "Back to Map" button

**Expected:**
- [ ] No conflicts
- [ ] Both buttons work independently
- [ ] Clear visual hierarchy
- [ ] No confusion

#### With Preview Panel
1. On map, click project marker (opens preview panel)
2. Click "Ver más" in preview
3. Project detail opens with "Back to Map" button
4. Click "Back to Map"

**Expected:**
- [ ] Returns to map
- [ ] Preview panel may reopen or close
- [ ] Smooth transition
- [ ] No weird state

---

## Acceptance Criteria Summary

### Must Pass ✅

**Visual**
- ✅ Button visible on all project detail pages
- ✅ Correct position (top-left, below Admin button)
- ✅ Proper colors (blue theme)
- ✅ Responsive design works

**Functional**
- ✅ Navigates back to map
- ✅ Preserves URL filters/search
- ✅ Works with browser back/forward
- ✅ No errors or crashes

**Performance**
- ✅ Smooth 60 FPS animation
- ✅ Fast component load (< 1ms)
- ✅ No memory leaks
- ✅ No jank

**Accessibility**
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Adequate contrast
- ✅ Touch-friendly size

---

## Bug Report Template

If you find an issue, report it with this format:

```markdown
### Bug: [Short Description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 14, Desktop]
- Screen Size: [e.g., 1920x1080]
- OS: [e.g., macOS, Windows, iOS]

**Screenshots/Video:**
[Attach if possible]

**Console Errors:**
[Any errors from browser console]
```

---

## Test Results Template

```
Test Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

Visual Appearance:           [ PASS / FAIL ]
Animation & Interactions:    [ PASS / FAIL ]
Navigation Functionality:    [ PASS / FAIL ]
Browser Back Button:         [ PASS / FAIL ]
Edge Cases:                  [ PASS / FAIL ]
Responsive Design:           [ PASS / FAIL ]
Accessibility:               [ PASS / FAIL ]
Performance:                 [ PASS / FAIL ]
Multi-Device:                [ PASS / FAIL ]
Integration:                 [ PASS / FAIL ]

Overall Status:              [ APPROVED / NEEDS FIXES ]

Notes:
_________________________________
_________________________________
_________________________________

Issues Found:
1. ____________________________
2. ____________________________
3. ____________________________
```

---

## Automated Test Ideas

### Unit Tests
```typescript
describe('BackToMapButton', () => {
  it('renders correctly', () => {});
  it('navigates on click', () => {});
  it('preserves URL state', () => {});
  it('shows correct text on mobile', () => {});
});
```

### Integration Tests
```typescript
describe('Project Detail Navigation', () => {
  it('navigates from map to detail and back', () => {});
  it('preserves filters during navigation', () => {});
  it('works with direct URLs', () => {});
});
```

### E2E Tests
```typescript
describe('User Navigation Flow', () => {
  it('complete user journey with back button', () => {});
  it('handles edge cases gracefully', () => {});
});
```

---

**Status:** Ready for Testing 🧪

**Estimated Test Time:** 15-20 minutes for full suite
**Quick Test Time:** 2 minutes for smoke test

**All tests passing?** ✅ **Ready for Production!**
