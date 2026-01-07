# 🧪 Error Boundary - Testing Guide

## Quick 2-Minute Test

### ✅ Basic Functionality Test
1. Navigate to `/error-test`
2. Click "Trigger Full Page Error"
3. **Check:** See beautiful error UI with red header ✅
4. **Check:** "Recargar página" and "Volver al inicio" buttons visible ✅
5. Click "Recargar página"
6. **Check:** Page reloads and app works again ✅

**Result:** If you see the error UI and can recover, it's working! ✨

---

## Comprehensive Test Suite

### Test 1: Full Page Error Boundary 🚨

#### Setup
1. Navigate to `/error-test`
2. Locate "Full Page Error Boundary" section

#### Test Cases

**Case 1.1: Trigger Full Page Error**
```
Steps:
1. Click "Trigger Full Page Error" button
2. Observe the screen

Expected:
- [ ] Entire page replaced with error UI
- [ ] Red gradient header visible
- [ ] Alert triangle icon (⚠️) displayed
- [ ] Title: "¡Ups! Algo salió mal"
- [ ] Subtitle: "La aplicación encontró un error inesperado"
- [ ] Error message box (red background)
- [ ] "¿Qué pasó?" section with explanation
- [ ] "¿Qué puedo hacer?" section with 3 bullet points
- [ ] Action buttons visible
- [ ] Footer with support message
- [ ] Smooth fade-in animation
```

**Visual Check:**
```
┌────────────────────────────────┐
│ ╔══════════════════════════╗  │
│ ║ ⚠️  ¡Ups! Algo salió mal ║  │ ← Red gradient
│ ║ La aplicación encontró... ║  │
│ ╚══════════════════════════╝  │
│                                │
│ [Error message box]            │
│ ¿Qué pasó?                     │
│ ¿Qué puedo hacer?              │
│ • Recargar la página           │
│ • Volver al inicio             │
│ • Reportar el error            │
│                                │
│ [🔄 Recargar página]           │
│ [🏠 Volver al inicio]          │
│                                │
│ [🐛 Copiar detalles] [▼ Ver...]│
└────────────────────────────────┘
```

**Case 1.2: Reload Action**
```
Steps:
1. Trigger error
2. Click "Recargar página" button

Expected:
- [ ] Page reloads (full refresh)
- [ ] Back to normal /error-test page
- [ ] Error cleared
- [ ] All components working
- [ ] No lingering state
```

**Case 1.3: Go Home Action**
```
Steps:
1. Trigger error
2. Click "Volver al inicio" button

Expected:
- [ ] Navigates to "/" (map view)
- [ ] Error cleared
- [ ] Map loads normally
- [ ] No error state
```

**Case 1.4: Error Details**
```
Steps:
1. Trigger error
2. Click "Ver detalles técnicos" button
3. Observe expanded section
4. Click "Ocultar detalles técnicos"

Expected:
- [ ] Details section expands with animation
- [ ] Shows "Error Message"
- [ ] Shows "Stack Trace"
- [ ] Shows "Component Stack"
- [ ] Shows "Browser Info"
- [ ] Code formatted in monospace font
- [ ] Scrollable if too long
- [ ] Details hide when toggled again
```

**Case 1.5: Copy Error Details**
```
Steps:
1. Trigger error
2. Click "Copiar detalles del error" button
3. Check clipboard

Expected:
- [ ] Alert shows "Error details copied..."
- [ ] Clipboard contains error report
- [ ] Report includes:
  - Error message
  - Stack trace
  - Component stack
  - User agent
  - URL
  - Timestamp
- [ ] Format is readable
```

---

### Test 2: Section Error Boundary 📦

#### Setup
1. Navigate to `/error-test`
2. Locate "Section Error Boundary" section

#### Test Cases

**Case 2.1: Trigger Section Error**
```
Steps:
1. Click "Trigger Section Error" button
2. Observe the behavior

Expected:
- [ ] Only the section shows error UI
- [ ] Rest of page remains functional
- [ ] Red alert box appears
- [ ] Alert icon visible
- [ ] Title: "Error en Demo Section"
- [ ] Error message displayed
- [ ] "Intentar de nuevo" button visible
- [ ] Other sections unaffected
```

**Visual Check:**
```
┌─────────────────────────────┐
│ Other content still works   │ ← Not affected
├─────────────────────────────┤
│  ⚠️                         │
│  Error en Demo Section      │ ← Section error
│  This is a simulated error  │
│  [🔄 Intentar de nuevo]    │
├─────────────────────────────┤
│ More content below          │ ← Not affected
└─────────────────────────────┘
```

**Case 2.2: Section Recovery**
```
Steps:
1. Trigger section error
2. Click "Intentar de nuevo" button

Expected:
- [ ] Section error clears
- [ ] Green "Component is working" box appears
- [ ] Smooth transition
- [ ] No page reload
- [ ] State preserved
- [ ] Other sections unaffected
```

**Case 2.3: Reset Section Button**
```
Steps:
1. Trigger section error
2. Click "Reset Section" button (appears after error)

Expected:
- [ ] Manual reset button works
- [ ] Section returns to normal
- [ ] Green success message
- [ ] No page reload
```

---

### Test 3: Event Handler Errors ⚡

#### Setup
1. Navigate to `/error-test`
2. Locate "Event Handler Error" section

#### Test Cases

**Case 3.1: Event Error (Not Caught)**
```
Steps:
1. Read the warning message
2. Open browser console
3. Click "Throw Error (Event Handler)" button
4. Check console

Expected:
- [ ] Warning explains it won't be caught
- [ ] Console shows error
- [ ] Error boundary NOT triggered
- [ ] Page still functional
- [ ] No error UI appears
- [ ] This is expected behavior
```

**Note:**
```
Event handler errors are NOT caught by React Error Boundaries.
This is by design. They must be handled with try-catch.
```

---

### Test 4: Async Operation Errors ⏳

#### Setup
1. Navigate to `/error-test`
2. Locate "Async Operation Error" section

#### Test Cases

**Case 4.1: Async Error**
```
Steps:
1. Click "Throw Error (Async)" button
2. Wait ~500ms
3. Observe result

Expected:
- [ ] 500ms delay before error
- [ ] Error boundary IS triggered
- [ ] Shows full error UI
- [ ] Can recover with reload
- [ ] Async errors ARE caught
```

---

### Test 5: Visual Design 🎨

#### Design Consistency

**Case 5.1: Colors**
```
Check color palette:

Header:
- [ ] Red gradient (from-red-500 to-red-600)
- [ ] White text
- [ ] White icon with transparency

Error Box:
- [ ] Red background (bg-red-50)
- [ ] Red border (border-red-200)
- [ ] Red text (text-red-800)

Buttons:
- [ ] Primary: Ocean blue (#0c4159)
- [ ] Secondary: Outline style
- [ ] Ghost: Gray text
```

**Case 5.2: Typography**
```
Check font usage:

All text:
- [ ] Arvo font family
- [ ] Proper font weights
- [ ] Readable sizes
- [ ] Consistent styling

Headers:
- [ ] H1 clear and bold
- [ ] H3 section headers
- [ ] Proper hierarchy
```

**Case 5.3: Icons**
```
Check icon usage:

- [ ] AlertTriangle in header (large, white)
- [ ] RefreshCw in reload button
- [ ] Home in home button
- [ ] Bug in report button
- [ ] ChevronDown/Up in toggle
- [ ] All icons proper size
- [ ] Icons aligned with text
```

**Case 5.4: Spacing**
```
Check layout spacing:

- [ ] Consistent padding (p-8, p-6, p-4)
- [ ] Proper gaps (space-y-6, gap-3)
- [ ] Margins appropriate
- [ ] Not too cramped
- [ ] Not too spacious
- [ ] Responsive spacing
```

---

### Test 6: Content Quality 📝

#### Text Tests

**Case 6.1: Spanish Language**
```
Check all text is in Spanish:

Titles:
- [ ] "¡Ups! Algo salió mal"
- [ ] "¿Qué pasó?"
- [ ] "¿Qué puedo hacer?"

Buttons:
- [ ] "Recargar página"
- [ ] "Volver al inicio"
- [ ] "Copiar detalles del error"
- [ ] "Ver/Ocultar detalles técnicos"
- [ ] "Intentar de nuevo"

All text properly translated ✓
```

**Case 6.2: Helpful Messaging**
```
Read all messages:

Expected:
- [ ] Not scary or alarming
- [ ] Professional tone
- [ ] Explains what happened
- [ ] Suggests solutions
- [ ] User-friendly
- [ ] Not technical jargon
- [ ] Empathetic ("Lamentamos...")
```

**Case 6.3: Grammar & Spelling**
```
Proofread all text:

- [ ] No spelling errors
- [ ] Proper accents (á, é, í, ó, ú)
- [ ] Correct punctuation
- [ ] Grammar correct
- [ ] Capitalization proper
```

---

### Test 7: Responsive Design 📱

#### Breakpoint Tests

**Desktop (1920px)**
```
Expected:
- [ ] Centered card (max-w-2xl)
- [ ] Comfortable spacing
- [ ] Buttons side-by-side
- [ ] Easy to read
- [ ] Professional look
```

**Tablet (768px)**
```
Expected:
- [ ] Card still centered
- [ ] Buttons may stack
- [ ] Padding adjusts
- [ ] Readable text
- [ ] Touch-friendly
```

**Mobile (375px)**
```
Expected:
- [ ] Full width card
- [ ] Buttons stack vertically
- [ ] Padding reduced but adequate
- [ ] Text readable
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px
```

---

### Test 8: Animation & Transitions 🎬

#### Animation Tests

**Case 8.1: Fade-In Animation**
```
Steps:
1. Trigger error
2. Watch appearance

Expected:
- [ ] Smooth fade-in
- [ ] animate-fade-in class
- [ ] ~200ms duration
- [ ] Not jarring
- [ ] Professional
```

**Case 8.2: Details Expand**
```
Steps:
1. Click "Ver detalles técnicos"
2. Watch expansion

Expected:
- [ ] Smooth expansion
- [ ] No jump
- [ ] animate-fade-in on content
- [ ] Height animates
```

**Case 8.3: Button Hover**
```
Hover over buttons:

Expected:
- [ ] Color change smooth
- [ ] Cursor: pointer
- [ ] Transition ~200ms
- [ ] No lag
```

---

### Test 9: Browser Compatibility 🌐

#### Cross-Browser Tests

**Chrome/Edge**
- [ ] Error UI renders perfectly
- [ ] All buttons work
- [ ] Animations smooth
- [ ] Clipboard copy works
- [ ] No console errors

**Firefox**
- [ ] Same as Chrome
- [ ] Gradient renders correctly
- [ ] Fonts load properly

**Safari (Desktop)**
- [ ] Error UI renders
- [ ] Buttons functional
- [ ] Animations work
- [ ] Arvo font loads

**Safari (iOS)**
- [ ] Mobile responsive
- [ ] Touch targets work
- [ ] Clipboard copy works (or alert fallback)
- [ ] Readable on small screen

**Chrome (Android)**
- [ ] Mobile optimized
- [ ] All features work
- [ ] Performance good

---

### Test 10: Error Logging 📊

#### Console Tests

**Case 10.1: Console Logging**
```
Steps:
1. Open browser console
2. Trigger error
3. Check console output

Expected:
- [ ] "ErrorBoundary caught an error:" logged
- [ ] Error object logged
- [ ] ErrorInfo logged
- [ ] Stack trace visible
- [ ] Component stack visible
```

**Case 10.2: onError Callback**
```
Check App.tsx implementation:

Expected:
- [ ] onError prop passed to ErrorBoundary
- [ ] Console.error called
- [ ] Error and errorInfo logged
- [ ] Optional: Sentry/tracking service called
```

---

### Test 11: Edge Cases 🔍

#### Edge Case Tests

**Case 11.1: Multiple Errors**
```
Steps:
1. Trigger error
2. Reload
3. Trigger different error
4. Reload

Expected:
- [ ] Each error handled correctly
- [ ] No state contamination
- [ ] Clean recovery each time
```

**Case 11.2: Rapid Error Triggering**
```
Steps:
1. Click error button repeatedly (fast)

Expected:
- [ ] Only shows error once
- [ ] No duplicate error UIs
- [ ] Stable state
```

**Case 11.3: Error in Error Boundary**
```
If error boundary itself breaks:

Expected:
- [ ] React default error handling kicks in
- [ ] Console shows error
- [ ] White screen (unavoidable)
- [ ] But this shouldn't happen (tested code)
```

**Case 11.4: Very Long Error Messages**
```
Test with long errors:

Expected:
- [ ] Message doesn't overflow
- [ ] Scrollable if needed
- [ ] Layout doesn't break
- [ ] Still readable
```

---

### Test 12: Recovery Actions 🔄

#### Action Tests

**Case 12.1: Reload Button**
```
Test:
1. Trigger error
2. Click "Recargar página"
3. Verify behavior

Expected:
- [ ] Full page reload (window.location.reload)
- [ ] All state cleared
- [ ] Fresh app start
- [ ] No error remnants
```

**Case 12.2: Home Button**
```
Test:
1. Trigger error
2. Click "Volver al inicio"
3. Check navigation

Expected:
- [ ] Navigates to "/"
- [ ] Error state reset
- [ ] Map loads
- [ ] Clean state
```

**Case 12.3: Retry Button (Section)**
```
Test:
1. Trigger section error
2. Click "Intentar de nuevo"
3. Verify recovery

Expected:
- [ ] Section re-renders
- [ ] Error cleared
- [ ] No page reload
- [ ] Smooth transition
```

---

### Test 13: User Experience 👥

#### UX Tests

**Case 13.1: First Impression**
```
Show error to user:

Ask them:
- Do you understand what happened?
- Do you know what to do?
- Is it scary or alarming?
- Do you feel frustrated?

Expected:
- [ ] Users understand the situation
- [ ] Next steps are clear
- [ ] Not scary, professional
- [ ] Confidence they can recover
```

**Case 13.2: Recovery Success**
```
Test:
1. User encounters error
2. User clicks reload
3. User continues using app

Expected:
- [ ] Recovery successful
- [ ] User not discouraged
- [ ] Work not lost (where possible)
- [ ] Positive experience
```

**Case 13.3: Error Reporting**
```
Test:
1. User wants to report error
2. User clicks "Copiar detalles"
3. User pastes to support

Expected:
- [ ] Easy to copy
- [ ] Contains useful info
- [ ] Not too technical
- [ ] Support can debug from it
```

---

## Performance Tests ⚡

### Test 14: Performance

**Case 14.1: Render Speed**
```
Test:
1. Open DevTools Performance
2. Trigger error
3. Measure render time

Expected:
- [ ] Error UI renders in < 100ms
- [ ] No long tasks
- [ ] Smooth transition
```

**Case 14.2: Memory Usage**
```
Test:
1. Open Memory profiler
2. Trigger error 10 times
3. Check memory

Expected:
- [ ] No memory leaks
- [ ] Memory stable
- [ ] Error state cleanup works
```

---

## Integration Tests 🔗

### Test 15: Integration

**Case 15.1: Works with Routing**
```
Test:
1. Navigate between pages
2. Trigger error on different pages
3. Verify error boundary works

Expected:
- [ ] Works on all routes
- [ ] Go home navigates correctly
- [ ] No routing conflicts
```

**Case 15.2: Works with Context**
```
Test:
1. Error in component using context
2. Check error boundary

Expected:
- [ ] Context errors caught
- [ ] Context state preserved (where possible)
- [ ] Recovery works
```

**Case 15.3: Works with State**
```
Test:
1. Error during state update
2. Check error boundary

Expected:
- [ ] State update errors caught
- [ ] Error boundary shows
- [ ] Recovery possible
```

---

## Acceptance Criteria ✅

### Must Pass

**Visual:**
- ✅ Error UI matches design
- ✅ Red gradient header
- ✅ All buttons visible
- ✅ Icons displayed correctly
- ✅ Responsive design works

**Functional:**
- ✅ Catches render errors
- ✅ Reload button works
- ✅ Home button works
- ✅ Copy details works
- ✅ Toggle details works
- ✅ Section boundary works
- ✅ Section retry works

**UX:**
- ✅ User-friendly messaging
- ✅ Clear recovery options
- ✅ Professional appearance
- ✅ Not scary or alarming
- ✅ Spanish language

**Technical:**
- ✅ Errors logged
- ✅ onError callback fires
- ✅ No memory leaks
- ✅ Clean state management
- ✅ Browser compatible

---

## Test Results Template

```
Test Date: _______________
Tester: _______________
Browser/Device: _______________

✅ PASSED
- [ ] Full page error boundary
- [ ] Section error boundary
- [ ] Reload action
- [ ] Home action
- [ ] Copy details
- [ ] Toggle details
- [ ] Visual design
- [ ] Responsive layout
- [ ] Spanish language
- [ ] Error logging

❌ FAILED
- [ ] __________________ (describe)
- [ ] __________________ (describe)

Overall Status: [ APPROVED / NEEDS FIXES ]

Notes:
_________________________________
_________________________________
```

---

## Quick Debug Checklist

If something doesn't work:

1. **Error not caught?**
   - Check if it's in event handler (use try-catch)
   - Verify ErrorBoundary wraps component
   - Check console for errors

2. **UI doesn't show?**
   - Check hasError state
   - Verify render method
   - Look for CSS conflicts

3. **Buttons don't work?**
   - Check onClick handlers
   - Verify methods bound correctly
   - Look for JavaScript errors

4. **Details don't expand?**
   - Check showDetails state
   - Verify toggle function
   - Look for CSS issues

5. **Copy doesn't work?**
   - Check clipboard API support
   - Verify fallback alert works
   - Check browser permissions

---

## Common Issues & Solutions

**Issue: Infinite error loop**
```
Solution: 
- Check error boundary render method
- Ensure fallback UI doesn't throw
- Add key prop to force remount
```

**Issue: Error not cleared after reload**
```
Solution:
- Use window.location.reload() not setState
- Clear localStorage if needed
- Reset global state
```

**Issue: Details too long**
```
Solution:
- Add max-height with scroll
- Truncate very long stacks
- Collapsible by default
```

---

**Status:** Ready for Testing 🧪

**Estimated Time:**
- Quick test: 2 minutes
- Full suite: 45-60 minutes

**Test URL:** `/error-test`

**All tests passing?** ✅ **Ship it!** 🚀
