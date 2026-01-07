# 🧪 Loading Skeletons - Testing Guide

## Quick 1-Minute Test

### ✅ Basic Functionality Test
1. Open the map at `/`
2. Click any project marker
3. **Check:** See skeleton layout instead of spinner ✅
4. Wait for project to load
5. **Check:** Smooth transition from skeleton to content ✅

**Result:** If you see a shimmer effect and smooth content transition, it's working! ✨

---

## Comprehensive Test Suite

### Test 1: Project Detail Page Skeleton 📄

#### Desktop View
1. Open project detail page
2. Observe loading state

**Expected:**
- [ ] Skeleton appears immediately (< 16ms)
- [ ] Layout matches final content structure
- [ ] Shimmer effect sweeps left to right
- [ ] Pulse animation subtle and smooth
- [ ] Header section visible
- [ ] Image placeholder shows
- [ ] Three-column metrics section
- [ ] Multiple content sections
- [ ] Footer area present

#### Mobile View
1. Open on mobile device
2. Observe skeleton

**Expected:**
- [ ] Responsive layout (single column)
- [ ] Proper spacing maintained
- [ ] Touch-friendly elements
- [ ] No horizontal overflow
- [ ] Shimmer animation smooth

#### Content Transition
1. Watch skeleton → content transition

**Expected:**
- [ ] No layout shift (CLS = 0)
- [ ] Smooth fade-in
- [ ] Elements appear in place
- [ ] No jumping or repositioning
- [ ] Duration feels natural (200-300ms)

---

### Test 2: Animation Quality 🎬

#### Shimmer Effect
1. Focus on a skeleton element
2. Watch shimmer animation

**Expected:**
- [ ] Light sweeps from left to right
- [ ] 2-second loop duration
- [ ] Smooth continuous motion
- [ ] Subtle, not distracting
- [ ] 60 FPS (no stuttering)

**Visual Check:**
```
0s:  [■░░░░░░░░░]  ← Light on left
1s:  [░░░░■░░░░░]  ← Light center
2s:  [░░░░░░░░■░]  ← Light right
0s:  [■░░░░░░░░░]  ← Loop restarts
```

#### Pulse Animation
1. Observe overall skeleton
2. Notice subtle opacity changes

**Expected:**
- [ ] Gentle breathing effect
- [ ] Opacity: 100% → 50% → 100%
- [ ] 2-second cycle
- [ ] Synchronized across elements
- [ ] Not too aggressive

---

### Test 3: Layout Matching 📐

#### Header Section
```
Skeleton:        Real Content:
[────────]       Project Title Here
[──────]         Organization Name
```

**Check:**
- [ ] Title height matches
- [ ] Subtitle height matches
- [ ] Spacing identical
- [ ] Alignment same

#### Image Section
```
Skeleton:        Real Content:
┌──────────┐     ┌──────────┐
│          │     │  IMAGE   │
│ [IMAGE]  │  =  │  HERE    │
│          │     │          │
└──────────┘     └──────────┘
```

**Check:**
- [ ] Same width
- [ ] Same height
- [ ] Same border radius
- [ ] Same position

#### Content Sections
```
Skeleton:        Real Content:
[────────]       Section Title
[──────]         Description text here
[─────────]      More description
[────────]       Continued text
```

**Check:**
- [ ] Paragraph spacing matches
- [ ] Line heights similar
- [ ] Varying widths look natural
- [ ] Overall structure identical

---

### Test 4: Performance ⚡

#### Render Performance
1. Open DevTools Performance tab
2. Navigate to project detail
3. Record skeleton rendering

**Target Metrics:**
- [ ] First paint < 16ms
- [ ] Animation 60 FPS
- [ ] No long tasks (> 50ms)
- [ ] Main thread mostly idle

#### Animation Performance
1. Record 5 seconds of skeleton
2. Check FPS graph

**Expected:**
- [ ] Consistent 60 FPS
- [ ] No dropped frames
- [ ] GPU accelerated
- [ ] Low CPU usage (< 20%)

#### Memory Usage
1. Open Memory profiler
2. Load skeleton 10 times
3. Check memory graph

**Expected:**
- [ ] No memory leaks
- [ ] Stable memory usage
- [ ] Cleanup on unmount
- [ ] No increasing trend

---

### Test 5: Responsive Behavior 📱

#### Breakpoint Tests

**Desktop (1920px)**
```
Layout: 3-column metrics, full width content
Expected:
- [ ] Three columns visible
- [ ] Wide layout utilized
- [ ] Shimmer covers full width
- [ ] No wasted space
```

**Tablet (768px)**
```
Layout: 2-column or stacked
Expected:
- [ ] Proper column collapse
- [ ] Readable proportions
- [ ] Smooth shimmer
- [ ] Touch-friendly
```

**Mobile (375px)**
```
Layout: Single column
Expected:
- [ ] Full width elements
- [ ] Vertical stacking
- [ ] No horizontal scroll
- [ ] Compact but clear
```

---

### Test 6: Edge Cases 🔍

#### Rapid Navigation
1. Click project marker
2. Immediately click back
3. Repeat 5 times quickly

**Expected:**
- [ ] Skeleton appears each time
- [ ] No memory buildup
- [ ] Clean unmounting
- [ ] No errors in console

#### Slow Network
1. Throttle network to Slow 3G
2. Load project detail

**Expected:**
- [ ] Skeleton shows immediately
- [ ] Animation continues smoothly
- [ ] No timeout errors
- [ ] Eventually loads content

#### Direct URL
1. Navigate directly to `/proyecto/abc123`
2. Cold start (no cache)

**Expected:**
- [ ] Skeleton appears instantly
- [ ] Even without project data
- [ ] Proper fallback
- [ ] Loads or redirects

#### Project Not Found
1. Navigate to `/proyecto/invalid-id`
2. Observe behavior

**Expected:**
- [ ] Skeleton shows briefly
- [ ] Auto-redirect after 1.5s
- [ ] No crash
- [ ] Graceful handling

---

### Test 7: Visual Consistency 🎨

#### Color Matching
```
Skeleton:   Light gray (#f3f3f5 area)
Shimmer:    White overlay (40% opacity)
```

**Check:**
- [ ] Matches design system
- [ ] Consistent across all skeletons
- [ ] Subtle, not distracting
- [ ] Good contrast

#### Border Radius
```
Skeleton:   6px default
Images:     8px
Buttons:    6px
Cards:      8px
```

**Check:**
- [ ] Matches real components
- [ ] Consistent rounding
- [ ] Looks polished

#### Spacing
```
Sections:   48px gap (space-y-12)
Paragraphs: 12px gap (space-y-3)
Lines:      8px gap (space-y-2)
```

**Check:**
- [ ] Spacing identical to content
- [ ] No layout shift
- [ ] Natural rhythm

---

### Test 8: Accessibility ♿

#### Screen Reader
1. Enable screen reader
2. Navigate to loading page

**Expected:**
- [ ] Announces loading state
- [ ] Provides context
- [ ] Not overwhelming
- [ ] Updates when loaded

#### Reduced Motion
1. Enable "Prefer Reduced Motion"
2. Load project detail

**Expected:**
- [ ] Animations respect preference
- [ ] Still shows skeleton
- [ ] No jarring effects
- [ ] Accessible alternative

#### Keyboard Navigation
1. Tab through loading page

**Expected:**
- [ ] Skip links work
- [ ] No focus traps
- [ ] Logical flow
- [ ] Back button accessible

---

### Test 9: Browser Compatibility 🌐

#### Modern Browsers

**Chrome/Edge**
- [ ] Shimmer works
- [ ] Pulse works
- [ ] Smooth animations
- [ ] Proper rendering

**Firefox**
- [ ] Shimmer works
- [ ] Pulse works
- [ ] GPU acceleration
- [ ] No artifacts

**Safari**
- [ ] Shimmer works
- [ ] Pulse works
- [ ] iOS compatibility
- [ ] No flickering

#### Mobile Browsers

**iOS Safari**
- [ ] Animations smooth
- [ ] No performance issues
- [ ] Proper spacing
- [ ] Touch-friendly

**Chrome Mobile**
- [ ] Animations work
- [ ] Good performance
- [ ] Responsive layout
- [ ] No lag

---

### Test 10: User Experience 👥

#### Perceived Performance
```
Test: Ask users "How long did this feel?"
Actual: 2 seconds
Goal: Feels < 1.5 seconds
```

**Metrics:**
- [ ] Users feel it's fast
- [ ] Less frustration than spinner
- [ ] Professional appearance
- [ ] Trustworthy feel

#### Loading Context
```
Test: Do users understand what's loading?
```

**Check:**
- [ ] Layout hints at content
- [ ] Clear it's loading state
- [ ] Not confusing
- [ ] Sets expectations

#### Engagement
```
Test: Do users stay on page?
```

**Metrics:**
- [ ] Lower bounce rate
- [ ] Users wait for content
- [ ] Don't immediately leave
- [ ] Positive experience

---

## Comparison Tests

### Before: Spinner ❌
```
User sees:
┌──────────────┐
│              │
│      ⟳      │  ← Spinning icon
│  Cargando... │
│              │
└──────────────┘

Issues:
- No context
- Feels slow
- Boring
- Jarring transition
```

### After: Skeleton ✅
```
User sees:
┌──────────────┐
│ [────────]   │  ← Title placeholder
│ [──────]     │  ← Subtitle
│ ┌─────────┐  │
│ │ [IMAGE] │  │  ← Image area
│ └─────────┘  │
│ [──] [──]    │  ← Content hints
└──────────────┘

Benefits:
- Shows structure
- Feels faster
- Professional
- Smooth transition
```

---

## Performance Benchmarks

### Target Metrics
```
Metric                    Target      Actual
─────────────────────────────────────────────
First Paint               < 16ms      _____ms
Animation FPS             60 FPS      _____fps
Skeleton → Content        < 300ms     _____ms
Layout Shift (CLS)        0           _____
Memory Usage              < 5MB       _____MB
CPU Usage                 < 20%       _____%
```

### Fill in during testing ✏️

---

## Issue Tracking

### Common Issues & Solutions

**Issue: Shimmer too fast/slow**
```
Solution: Adjust animation duration in globals.css
animation: shimmer 2s linear infinite;
                   ↑ Change to 1.5s or 3s
```

**Issue: Layout shift on load**
```
Solution: Match skeleton heights exactly
<Skeleton className="h-8" />  ← Must match real h-8
```

**Issue: Too many skeletons**
```
Solution: Reduce count
<ProjectListSkeleton count={5} />  ← Use 3-5, not 20
```

**Issue: Performance lag**
```
Solution: Check for:
- Too many DOM elements
- Heavy animations
- Large skeleton components
```

---

## Acceptance Criteria

### Must Pass ✅

**Visual:**
- ✅ Skeleton matches content layout
- ✅ Smooth shimmer animation
- ✅ Subtle pulse effect
- ✅ No layout shift on load

**Performance:**
- ✅ 60 FPS animations
- ✅ Fast first paint (< 16ms)
- ✅ No memory leaks
- ✅ Low CPU usage

**UX:**
- ✅ Feels faster than spinner
- ✅ Professional appearance
- ✅ Clear loading context
- ✅ Smooth content transition

**Responsive:**
- ✅ Works on all devices
- ✅ Proper breakpoints
- ✅ Touch-friendly
- ✅ No overflow

---

## Test Results Template

```
Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

Project Detail Skeleton:     [ PASS / FAIL ]
Animation Quality:           [ PASS / FAIL ]
Layout Matching:             [ PASS / FAIL ]
Performance:                 [ PASS / FAIL ]
Responsive Behavior:         [ PASS / FAIL ]
Edge Cases:                  [ PASS / FAIL ]
Visual Consistency:          [ PASS / FAIL ]
Accessibility:               [ PASS / FAIL ]
Browser Compatibility:       [ PASS / FAIL ]
User Experience:             [ PASS / FAIL ]

Overall Status:              [ APPROVED / NEEDS FIXES ]

Notes:
_________________________________
_________________________________

Issues Found:
1. ____________________________
2. ____________________________
```

---

## Quick Debug Checklist

If something looks wrong:

1. **No shimmer showing?**
   - Check `shimmer={true}` prop
   - Verify animation in globals.css
   - Check for CSS conflicts

2. **Layout shift on load?**
   - Match skeleton heights to content
   - Use same spacing classes
   - Check responsive classes

3. **Animations janky?**
   - Open DevTools Performance
   - Check for 60 FPS
   - Look for long tasks
   - Verify GPU acceleration

4. **Wrong colors?**
   - Check CSS variables
   - Verify `bg-accent` class
   - Look at theme settings

5. **Too slow/fast?**
   - Adjust animation durations
   - Check easing functions
   - Test on target devices

---

**Status:** Ready for Testing 🧪

**Estimated Test Time:** 
- Quick Test: 1 minute
- Full Suite: 20-25 minutes

**All tests passing?** ✅ **Ship it!** 🚀
