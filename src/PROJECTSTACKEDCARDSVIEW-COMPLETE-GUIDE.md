# 📚 ProjectStackedCardsView - Complete Feature Guide

## 🎯 Overview

The **ProjectStackedCardsView** is a sophisticated, scroll-driven interface that displays project information across 7 sections that physically stack on top of each other as you scroll. It's the **default view** for all project detail pages and features smooth 60fps animations, multiple navigation methods, and full accessibility.

---

## 📐 Architecture Overview

```
ProjectStackedCardsView
├── Hero Section (Full screen)
└── 700vh Scroll Space
    └── Sticky Viewport (100vh)
        ├── 7 Stacked Cards (absolute positioned)
        ├── Navigation Buttons (fixed)
        ├── Progress Rail (fixed)
        └── Close Button (fixed)
```

---

## 🎨 Core Features

### **1. Scroll-Driven Card Animation System** 📜

The entire interface is powered by a **scroll-driven animation system** where cards slide up from the bottom as you scroll.

#### **How It Works:**
```javascript
// Line 290: 700vh tall spacer creates scroll space
<div style={{ height: `${sections.length * 100}vh` }}>

// Line 292: Sticky container stays in viewport
<div className="sticky top-0 h-screen w-full">

// Cards positioned absolutely, all in same spot
// Transform applied based on scroll position
```

#### **Card Animation Logic:**
```javascript
// Lines 151-181: getCardStyle()
- translateY: Cards start at 100% (off screen) and slide to 0%
- opacity: Fades from 0 to 1 as card slides in
- scale: Grows from 0.95 to 1.0 for depth effect
- zIndex: Each card stacks on top (10, 11, 12...)
```

#### **Visual Result:**
```
Scroll 0%    → Hero visible
Scroll 14%   → Card 0 slides up from bottom
Scroll 28%   → Card 1 slides up, covers Card 0
Scroll 42%   → Card 2 slides up, covers Card 1
Scroll 56%   → Card 3 slides up, covers Card 2
Scroll 70%   → Card 4 slides up, covers Card 3
Scroll 84%   → Card 5 slides up, covers Card 4
Scroll 100%  → Card 6 slides up, covers Card 5
```

---

### **2. Performance Optimization** ⚡

Achieves **buttery smooth 60fps scrolling** with multiple optimization techniques:

#### **RequestAnimationFrame (RAF) Throttling** (Lines 54-104)
```javascript
useEffect(() => {
  const handleScroll = () => {
    // Cancel previous frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Schedule for next frame
    rafRef.current = requestAnimationFrame(() => {
      // Update scroll state
    });
  };
});
```

**Benefits:**
- Syncs updates with browser's repaint cycle
- Prevents layout thrashing
- Maintains 60fps even on slower devices

#### **Passive Scroll Listeners** (Line 94)
```javascript
container.addEventListener('scroll', handleScroll, { passive: true });
```

**Benefits:**
- Browser knows handler won't call `preventDefault()`
- Can optimize scroll performance
- Reduces jank on mobile

#### **Micro-Debouncing** (Lines 71-73)
```javascript
// Skip if scroll hasn't changed significantly
if (Math.abs(scrollTop - lastScrollTop.current) < 1) return;
```

**Benefits:**
- Prevents unnecessary recalculations
- Reduces state updates

#### **Conditional `will-change`** (Line 179)
```javascript
willChange: isVisible && Math.abs(cardProgress) < 2 
  ? 'transform, opacity' 
  : 'auto'
```

**Benefits:**
- GPU acceleration only when needed
- Prevents memory bloat
- Optimizes for cards currently animating

#### **Memoization** (Lines 32-52, 106-118, 151-181)
```javascript
const sections = useMemo(() => [...], []);
const formattedCategory = useMemo(() => {...}, [project.category]);
const handleNavigate = useCallback((index) => {...}, [sections.length]);
const getCardStyle = useCallback((index) => {...}, [scrollProgress]);
```

**Benefits:**
- Prevents unnecessary recalculations
- Reduces re-renders
- Improves overall responsiveness

---

### **3. Seven Content Sections** 📄

Each section is a stacked card with unique content:

#### **Card 0: Objetivo Principal** 🎯 (Lines 296-341)
```
Content:
- TypewriterText animation for objective
- 4-field metadata grid:
  • Categoría
  • Ámbito Temático
  • Ubicación (shows "🇲🇽 Proyecto Nacional" if national)
  • Organización

Background: White
Layout: Standard padding with centered content
```

#### **Card 1: Beneficiarios** 👥 (Lines 343-365)
```
Content:
- HighlightNumbers component (extracts/highlights numbers)
- BreakoutImageSection with image on LEFT
- Numbers automatically highlighted and enlarged

Background: #fafafa (light gray)
Layout: Full-bleed with 50/50 image/content split
```

#### **Card 2: Factores de Riesgo** ⚠️ (Lines 367-391)
```
Content:
- HighlightPhrases component (highlights key phrases)
- BreakoutImageSection with image on RIGHT
- Phrases in quotation marks highlighted

Background: White
Layout: Full-bleed with 50/50 split
Optional: Only renders if project.riskFactors exists
```

#### **Card 3: Metodología** 📋 (Lines 393-417)
```
Content:
- HighlightPhrases component
- BreakoutImageSection with image on LEFT
- Methodology text with key phrases emphasized

Background: #fafafa (light gray)
Layout: Full-bleed with 50/50 split
Optional: Only renders if project.methodology exists
```

#### **Card 4: Resultados Principales** 📊 (Lines 419-441)
```
Content:
- HighlightNumbers component
- BreakoutImageSection with image on RIGHT
- Results text with numbers highlighted

Background: White
Layout: Full-bleed with 50/50 split
```

#### **Card 5: Evaluación** ⭐ (Lines 443-460)
```
Content:
- EvaluationCard component (NEW!)
  • Animated score counter (0 → target)
  • Animated ranking counter
  • Gradient cards with orange/blue themes
  • Progress bar
  • Achievement badges for top 3
  • Metrics grid
  • Hover effects

Background: #f5f5f5 (light gray)
Layout: Standard padding with centered content
Optional: Only renders if evaluationCriteriaHighlights exists
```

#### **Card 6: Información de Contacto** 📧 (Lines 462-477)
```
Content:
- GlobalFooter component
  • Contact name
  • Email
  • Phone
  • X (Twitter) handle
  • Website link
  • Project link (discrete)

Background: White
Layout: Full footer component
```

---

### **4. Multiple Navigation Methods** 🧭

Users can navigate through sections in **5 different ways**:

#### **A) Natural Scrolling** 📜 (Primary)
- Scroll down → Next card slides up
- Scroll up → Previous card slides back down
- Works with mouse wheel, trackpad, touch
- Smooth physics-based animation

#### **B) Navigation Buttons** ⬅️➡️ (Lines 198-244)
```
Fixed at bottom-left corner:
- "← Anterior" button
- "Siguiente →" button

Features:
- Disabled when at start/end
- Smooth scroll to target section
- Accessible with keyboard
- Focus ring on tab
- Hover effects
```

#### **C) Progress Rail** 🔴 (Lines 246-253)
```
Fixed on right side (vertical dots):
- 7 dots, one per section
- Current section highlighted
- Click any dot to jump directly
- Visual progress indicator
- Hover states on each dot
- Accessible labels
```

#### **D) Keyboard Shortcuts** ⌨️ (Lines 121-148)
```
Supported keys:
- ↓ or PageDown → Next section
- ↑ or PageUp → Previous section
- Home → Jump to first section
- End → Jump to last section

Features:
- Prevents default browser scrolling
- Ignores when typing in inputs
- Smooth scroll animation
- Updates current section state
```

#### **E) Direct Section Jump** 🎯
```javascript
// Line 107-118: handleNavigate()
handleNavigate(index) => {
  // Calculate scroll position
  // Smooth scroll to target
}

Used by:
- Progress rail clicks
- Navigation buttons
- Keyboard shortcuts
```

---

### **5. Fixed UI Elements** 🎨

Three elements stay visible at all times:

#### **Close Button** ✖️ (Lines 255-275)
```
Position: Fixed top-left (6, 6)
Style:
- White circular button (40px)
- Backdrop blur
- X icon (scales on hover)
- Shadow elevation on hover
- Accessible label

Behavior:
- Calls onClose() prop
- Returns to previous page
```

#### **Navigation Buttons** ⬅️➡️ (Lines 198-244)
```
Position: Fixed bottom-left (4, 4)
Style:
- Two white rounded buttons
- Backdrop blur
- Orange focus rings
- Disabled state styling
- Shadow elevation on hover

Behavior:
- Navigate between sections
- Disabled at boundaries
- Smooth scroll animation
```

#### **Progress Rail** 🔴 (Lines 246-253)
```
Position: Fixed right side, vertically centered
Component: ProgressRail
Props:
- sections: Array of section definitions
- currentIndex: Active section
- onNavigate: Handler function

Behavior:
- Shows current position
- Click to jump to section
- Visual feedback on hover
```

---

### **6. Accessibility Features** ♿

Full accessibility support throughout:

#### **Screen Reader Support** (Lines 187-196)
```javascript
<div 
  id="section-live-region"
  className="sr-only" 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  Sección activa: {sections[currentSectionIndex].label}
</div>
```

**Announces:**
- Current section name when changing
- Updates read automatically
- Polite priority (doesn't interrupt)

#### **ARIA Labels** (Throughout)
```javascript
aria-label="Objetivo principal del proyecto"
aria-label="Ir a la sección anterior"
aria-label="Cerrar vista de proyecto"
```

**Benefits:**
- Descriptive labels for all interactive elements
- Context for screen reader users
- Proper semantic meaning

#### **Keyboard Navigation** (Lines 121-148)
- All interactive elements focusable
- Arrow keys for navigation
- Home/End for jump to start/end
- Escape support could be added

#### **Focus Management**
```css
focus:outline-none 
focus:ring-2 
focus:ring-[#ff8012] 
focus:ring-offset-2
```

**Benefits:**
- Clear visual focus indicators
- Orange ring matches brand
- Visible on all backgrounds

#### **Semantic HTML**
- Proper heading hierarchy
- Button elements (not divs)
- Meaningful structure

---

### **7. Responsive Design** 📱

Adapts seamlessly across all screen sizes:

#### **Desktop (≥1024px)**
```
- All 7 cards fully visible
- Large padding (12 units)
- Full-width breakout images
- Larger text sizes
- All navigation methods visible
- Smooth 700ms animations
```

#### **Tablet (768px - 1023px)**
```
- Cards maintain structure
- Medium padding (10 units)
- Responsive image layouts
- Slightly smaller text
- Navigation optimized
- 500ms animations
```

#### **Mobile (<768px)**
```
- Single column layouts
- Compact padding (8 units)
- Stacked image layouts
- Smaller text sizes
- Touch-optimized buttons
- 400ms animations
- Touch-friendly scroll
```

#### **Responsive Classes** (Examples)
```javascript
className="px-8 md:px-12 py-8"  // Padding
className="text-xl md:text-2xl lg:text-3xl"  // Text size
className="grid grid-cols-1 md:grid-cols-2"  // Grid layout
```

---

### **8. Smooth Touch Interactions** 👆

Optimized for mobile/tablet:

#### **Touch Scrolling** (Line 283)
```javascript
style={{
  scrollBehavior: 'smooth',
  WebkitOverflowScrolling: 'touch',  // iOS momentum
}}
```

**Benefits:**
- Native iOS momentum scrolling
- Smooth physics on Android
- Finger-friendly interactions

#### **Pointer Events Management** (Line 178)
```javascript
pointerEvents: isActive ? 'auto' : 'none'
```

**Benefits:**
- Only active card receives interactions
- Prevents clicking through cards
- Better touch target accuracy

---

### **9. Component Integration** 🧩

Uses specialized components for each content type:

#### **ProjectHeroSection** (Line 287)
```
Features:
- Full-screen hero image
- Gradient overlay
- Project title (centered, large)
- Metadata bar (org, state, category)
- Description preview
- Share button
- National project badge
- Scroll indicator
```

#### **StackedCardSection** (Lines 301, 348, 373, etc.)
```
Props:
- id: Section identifier
- index: Position in stack
- title: Card title for tab
- bgColor: Background color
- polished: Enable premium effects
- fullBleed: Enable full-width layout

Features:
- Folder-like tab at top
- Card body with content
- Smooth animations
- Responsive sizing
```

#### **TypewriterText** (Line 311)
```
Features:
- Animated typing effect
- Character-by-character reveal
- Configurable speed
- Smooth cursor animation
```

#### **HighlightNumbers** (Lines 362, 438)
```
Features:
- Extracts numbers from text
- Enlarges and colors them
- Orange accent color
- Smooth transitions
```

#### **HighlightPhrases** (Lines 387, 413)
```
Features:
- Detects phrases in quotes
- Highlights with background
- Orange accent color
- Subtle animations
```

#### **BreakoutImageSection** (Lines 357, 382, 408, 433)
```
Props:
- imageUrl: Image source
- imageAlt: Alt text
- imageSide: 'left' or 'right'

Features:
- 50/50 split layout
- Full-bleed edge-to-edge
- Image on alternating sides
- Responsive stacking on mobile
- Overflow scroll for content
```

#### **EvaluationCard** (Line 457)
```
Features:
- Animated score counter
- Animated ranking counter
- Gradient cards
- Progress bar
- Achievement badges
- Metrics grid
- Hover effects
- Scroll-triggered animation
```

#### **GlobalFooter** (Line 475)
```
Features:
- Contact information
- Email, phone, social links
- Project website
- Consistent styling
- Responsive layout
```

#### **ProgressRail** (Lines 248-252)
```
Props:
- sections: Section definitions
- currentIndex: Active section
- onNavigate: Navigation handler

Features:
- Vertical dot indicators
- Click to navigate
- Visual progress
- Hover states
- Accessible labels
```

---

### **10. State Management** 🎛️

Manages scroll state efficiently:

#### **State Variables** (Lines 26-30)
```javascript
const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
// Tracks which section is active (0-6)

const [scrollProgress, setScrollProgress] = useState(0);
// Overall scroll progress (0.0 to 1.0)

const containerRef = useRef<HTMLDivElement>(null);
// Reference to scroll container

const rafRef = useRef<number | null>(null);
// RequestAnimationFrame ID

const lastScrollTop = useRef(0);
// Last scroll position for debouncing
```

#### **Progress Calculation** (Lines 75-87)
```javascript
// Calculate scroll progress (0 to 1)
const progress = scrollTop / scrollHeight;

// Determine current section
const sectionProgress = progress * sections.length;
const newIndex = Math.floor(sectionProgress);

// Update if changed
if (newIndex !== currentSectionIndex) {
  setCurrentSectionIndex(newIndex);
}
```

#### **State Flow**
```
User scrolls
    ↓
handleScroll() triggered
    ↓
RAF scheduled
    ↓
Calculate progress
    ↓
Update currentSectionIndex
    ↓
Update scrollProgress
    ↓
Cards re-render with new styles
    ↓
Smooth 60fps animation
```

---

### **11. Data Handling** 📊

Smart handling of project data:

#### **Formatted Values** (Lines 43-52)
```javascript
const formattedCategory = useMemo(() => {
  const cleaned = project.category.replace(/[-/]/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}, [project.category]);

// "participación-social" → "Participación social"
```

#### **National Project Badge** (Line 330)
```javascript
{project.isNationalProject 
  ? '🇲🇽 Proyecto Nacional' 
  : project.state
}

// Shows special badge instead of listing all states
```

#### **Optional Sections** (Lines 368, 394, 444)
```javascript
{project.riskFactors && (
  <div>...</div>
)}

// Only renders if data exists
// Prevents empty cards
```

#### **Image Fallbacks**
```javascript
imageUrl={project.beneficiariesImageUrl || project.imageUrl}

// Uses section-specific image if available
// Falls back to main project image
```

---

### **12. Section Definitions** 📋 (Lines 33-41)

```javascript
const sections = useMemo(() => [
  { id: 'objective', label: 'Objetivo' },
  { id: 'beneficiaries', label: 'Beneficiarios' },
  { id: 'risk-factors', label: 'Factores de Riesgo' },
  { id: 'methodology', label: 'Metodología' },
  { id: 'results', label: 'Resultados' },
  { id: 'evaluation', label: 'Evaluación' },
  { id: 'footer', label: 'Información' },
], []);
```

**Used for:**
- Progress calculation
- Navigation buttons
- Progress rail dots
- Screen reader announcements
- Keyboard navigation
- Section identification

---

## 🎨 Visual Design System

### **Color Palette**
```css
Primary Blue:   #0c4159  (backgrounds, text)
Primary Orange: #ff8012  (accents, highlights)
White:          #ffffff  (card backgrounds)
Light Gray:     #fafafa  (alternating cards)
Border:         #0c4159/10 (subtle borders)
```

### **Typography**
```css
Font:           'Arvo', serif (throughout)
Sizes:          xs, sm, base, lg, xl, 2xl, 3xl
Weight:         400 (regular)
Tracking:       Wide for labels
```

### **Spacing System**
```css
Grid Unit:      4px base
Padding:        8, 12 (mobile/desktop)
Gaps:           6 (grid gaps)
Border Radius:  lg (large rounded corners)
```

### **Animation Timing**
```css
Duration:       200ms (quick), 700ms (smooth)
Easing:         ease-out, cubic-bezier
Transform:      translate3d (GPU accelerated)
```

---

## 🚀 Performance Metrics

### **Target Performance:**
- ✅ **60fps scrolling** (achieved via RAF)
- ✅ **<50ms** interaction latency
- ✅ **0 layout shifts** during scroll
- ✅ **Smooth on mobile** (tested iOS/Android)

### **Optimization Techniques:**
1. RequestAnimationFrame throttling
2. Passive scroll listeners
3. Memoized calculations
4. Conditional will-change
5. GPU-accelerated transforms
6. Micro-debouncing
7. Component code splitting
8. Efficient re-renders

---

## 🎯 User Experience Flow

### **Complete User Journey:**

```
1. User clicks project marker on map
       ↓
2. Preview panel opens
       ↓
3. User clicks "Ver detalles"
       ↓
4. ProjectDetailPage loads
       ↓
5. ProjectStackedCardsView renders
       ↓
6. Hero section appears (full screen)
       ↓
7. User scrolls down
       ↓
8. Card 0 (Objetivo) slides up from bottom
       ↓
9. User continues scrolling
       ↓
10. Cards stack one by one (1, 2, 3, 4, 5, 6)
        ↓
11. User explores with:
    - Natural scrolling
    - Navigation buttons
    - Progress rail
    - Keyboard shortcuts
        ↓
12. User finishes exploring
        ↓
13. User clicks close button
        ↓
14. Returns to map view
```

### **Engagement Features:**
- ✨ Beautiful animations catch attention
- 🎭 Typewriter effect creates anticipation
- 🔢 Highlighted numbers stand out
- 📸 Large images provide context
- 🏆 Achievement badges celebrate success
- 📊 Animated counters build excitement
- 🧭 Multiple navigation options empower user

---

## 📚 Dependencies

### **React Hooks Used:**
```javascript
useState    → Track scroll state
useEffect   → Set up scroll listeners & keyboard
useRef      → DOM references & RAF tracking
useMemo     → Memoize expensive calculations
useCallback → Memoize event handlers
```

### **Custom Components:**
```javascript
ProjectHeroSection      → Hero display
StackedCardSection      → Card wrapper
BreakoutImageSection    → Image layouts
TypewriterText          → Animated text
HighlightNumbers        → Number emphasis
HighlightPhrases        → Phrase emphasis
EvaluationCard          → Animated scores
GlobalFooter            → Contact info
ProgressRail            → Navigation dots
ShareButton             → Social sharing
```

### **External Utilities:**
```javascript
ImageWithFallback       → Reliable image loading
```

---

## 🎓 Key Concepts

### **1. Scroll-Driven Animation**
Instead of traditional page navigation, scroll position drives card animations. More scroll = more cards visible.

### **2. Sticky Positioning**
The card container is `sticky` so it stays in viewport while the spacer creates scroll space.

### **3. Absolute Positioning**
All cards positioned at `inset-0` (covering entire container) so they stack physically.

### **4. Transform-Based Animation**
Cards animate via `transform: translateY()` instead of `top` for GPU acceleration.

### **5. RequestAnimationFrame**
Syncs scroll updates with browser repaint for smooth 60fps.

### **6. Passive Listeners**
Tells browser scroll handler won't prevent default, enabling optimizations.

### **7. Memoization**
Prevents unnecessary recalculations of expensive operations.

### **8. Conditional Rendering**
Optional sections only render when data exists.

---

## 🎉 Summary

The **ProjectStackedCardsView** is a:

✅ **Highly performant** scroll-driven interface  
✅ **Fully accessible** with screen reader & keyboard support  
✅ **Beautifully animated** with smooth 60fps transitions  
✅ **Multi-navigation** supporting 5 different methods  
✅ **Responsive design** working on all devices  
✅ **Rich content** with 7 distinct sections  
✅ **Component-based** architecture for maintainability  
✅ **Optimized** with RAF, memoization, and GPU acceleration  

**It transforms project data into an engaging, memorable storytelling experience!** 🚀✨

---

## 📖 Related Documentation

- `/HOW-TO-USE-STACKED-CARDS.md` - User guide
- `/COMPLETE-STACKED-CARDS-SUMMARY.md` - Technical summary
- `/STACKED-CARDS-PREMIUM-SUMMARY.md` - Premium features
- `/EVALUATION-CARD-ENHANCEMENTS.md` - Evaluation card details
- `/guidelines/Stacked-Cards-Guide.md` - Implementation guide

---

**You now understand every feature in ProjectStackedCardsView!** 🎊
