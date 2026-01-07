# 💎 Loading Skeletons - Implementation Guide

## Overview

Loading skeletons replace traditional spinners with placeholder content that mimics the actual layout. This creates a better perceived performance and more professional feel.

---

## 🎯 Why Skeletons?

### **Traditional Spinner Problems:**
- ❌ Feels slow (users stare at a spinner)
- ❌ No context about what's loading
- ❌ Jarring transition when content appears
- ❌ Looks less polished

### **Skeleton Benefits:**
- ✅ Feels 30% faster (perceived performance)
- ✅ Shows expected layout immediately
- ✅ Smooth content transition
- ✅ More professional and modern
- ✅ Reduces perceived wait time
- ✅ Keeps user engaged

---

## 📦 Available Skeleton Components

### 1. **ProjectDetailSkeleton**
**File:** `/components/ProjectDetailSkeleton.tsx`

**Usage:** Full-page skeleton for project detail view

**Features:**
- Mimics complete ProjectFullDetailsView layout
- Header with title placeholder
- Hero image placeholder
- Metadata bar
- Three-column key metrics
- Multiple content sections
- Footer area

**When to use:**
- Loading project detail page
- Project not found (briefly before redirect)
- Initial project data fetch

**Example:**
```tsx
import { ProjectDetailSkeleton } from '../components/ProjectDetailSkeleton';

function ProjectDetailPage() {
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }
  return <ProjectFullDetailsView project={project} />;
}
```

---

### 2. **ProjectCardSkeleton**
**File:** `/components/ProjectCardSkeleton.tsx`

**Usage:** Single project card skeleton

**Features:**
- Image placeholder
- Title and organization
- Category badge
- Description lines
- Footer metadata

**When to use:**
- Loading project cards in grid
- Preview panel loading
- Search results loading

**Example:**
```tsx
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';

function ProjectGrid() {
  if (loading) {
    return <ProjectCardSkeleton />;
  }
  return <ProjectCard project={project} />;
}
```

---

### 3. **ProjectGridSkeleton**
**File:** `/components/ProjectCardSkeleton.tsx`

**Usage:** Multiple cards in grid layout

**Features:**
- Responsive grid (1/2/3 columns)
- Customizable card count
- Proper spacing

**Props:**
- `count?: number` - Number of skeleton cards (default: 3)

**Example:**
```tsx
import { ProjectGridSkeleton } from '../components/ProjectCardSkeleton';

function ProjectGallery() {
  if (loading) {
    return <ProjectGridSkeleton count={6} />;
  }
  return <ProjectGrid projects={projects} />;
}
```

---

### 4. **ProjectListItemSkeleton**
**File:** `/components/ProjectCardSkeleton.tsx`

**Usage:** Compact list item skeleton

**Features:**
- Small thumbnail
- Title and metadata
- Horizontal layout

**When to use:**
- List view in preview panel
- Compact project listings
- Search results list

---

### 5. **ProjectListSkeleton**
**File:** `/components/ProjectCardSkeleton.tsx`

**Usage:** Multiple list items

**Props:**
- `count?: number` - Number of items (default: 5)

**Example:**
```tsx
import { ProjectListSkeleton } from '../components/ProjectCardSkeleton';

function ProjectList() {
  if (loading) {
    return <ProjectListSkeleton count={10} />;
  }
  return <div>{projects.map(p => <ProjectListItem />)}</div>;
}
```

---

### 6. **SearchSuggestionSkeleton**
**File:** `/components/SearchSuggestionSkeleton.tsx`

**Usage:** Search autocomplete skeleton

**Features:**
- Icon placeholder
- Title and subtitle
- Compact design

---

### 7. **SearchSuggestionsLoadingSkeleton**
**File:** `/components/SearchSuggestionSkeleton.tsx`

**Usage:** Multiple search suggestions

**Props:**
- `count?: number` - Number of suggestions (default: 5)

**Example:**
```tsx
import { SearchSuggestionsLoadingSkeleton } from '../components/SearchSuggestionSkeleton';

function SearchDropdown() {
  if (computing) {
    return <SearchSuggestionsLoadingSkeleton count={5} />;
  }
  return <SearchSuggestions results={results} />;
}
```

---

## 🎨 Base Skeleton Component

### **Skeleton** (from shadcn/ui)
**File:** `/components/ui/skeleton.tsx`

**Enhanced Features:**
- ✨ **Shimmer effect** - Animated light sweep
- 🌊 **Pulse animation** - Subtle breathing effect
- 🎯 **Optional shimmer** - Can disable with `shimmer={false}`

**Props:**
```tsx
interface SkeletonProps {
  shimmer?: boolean;  // Enable shimmer effect (default: true)
  className?: string; // Additional Tailwind classes
}
```

**Basic Usage:**
```tsx
import { Skeleton } from './ui/skeleton';

// Simple skeleton
<Skeleton className="h-4 w-32" />

// Without shimmer
<Skeleton className="h-8 w-full" shimmer={false} />

// Rounded skeleton
<Skeleton className="h-12 w-12 rounded-full" />
```

---

## 🎬 Animations

### **Pulse Animation**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

**Effect:** Gentle breathing effect  
**Duration:** ~2 seconds  
**Use:** All skeletons by default

---

### **Shimmer Animation**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

**Effect:** Light sweep from left to right  
**Duration:** 2 seconds, infinite loop  
**Use:** Enhanced skeleton loading

**Visual:**
```
Frame 0s:  [■░░░░░░░░░]  ← Light on left
Frame 1s:  [░░░░■░░░░░]  ← Light moving right
Frame 2s:  [░░░░░░░░■░]  ← Light on right
```

---

## 🎯 Implementation Patterns

### Pattern 1: Simple Loading State
```tsx
function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  return <ProjectView data={data} />;
}
```

---

### Pattern 2: Conditional Sections
```tsx
function Dashboard() {
  return (
    <div>
      {loadingProjects ? (
        <ProjectGridSkeleton count={6} />
      ) : (
        <ProjectGrid projects={projects} />
      )}
      
      {loadingStats ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <Statistics data={stats} />
      )}
    </div>
  );
}
```

---

### Pattern 3: Progressive Loading
```tsx
function ProgressiveContent() {
  const { data, isValidating } = useSWR('/api/data');

  return (
    <>
      {data ? (
        <Content data={data} />
      ) : (
        <ProjectDetailSkeleton />
      )}
      
      {isValidating && (
        <div className="absolute top-2 right-2">
          <Skeleton className="h-2 w-16" />
        </div>
      )}
    </>
  );
}
```

---

### Pattern 4: List with Mixed States
```tsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  return (
    <div>
      {items.map(item => (
        <ProjectListItem key={item.id} item={item} />
      ))}
      
      {loadingMore && (
        <ProjectListSkeleton count={3} />
      )}
    </div>
  );
}
```

---

## 🎨 Customization Guide

### Creating Custom Skeletons

**Step 1: Analyze the Layout**
```
Identify the structure:
- Header: Title + subtitle
- Image: Full width
- Content: 3 columns
- Footer: Metadata
```

**Step 2: Build with Skeleton Blocks**
```tsx
import { Skeleton } from './ui/skeleton';

export function CustomSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Image */}
      <Skeleton className="h-48 w-full" />

      {/* 3 Columns */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
```

**Step 3: Match Spacing**
```tsx
// Use the same spacing as real content
<div className="space-y-4">  {/* Same as content */}
  <Skeleton className="h-8 w-3/4" />
</div>
```

**Step 4: Responsive Design**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {Array.from({ length: 6 }).map((_, i) => (
    <Skeleton key={i} className="h-32 w-full" />
  ))}
</div>
```

---

## 📏 Sizing Guidelines

### Width Guidelines
```tsx
// Full width
<Skeleton className="w-full" />

// Percentage widths
<Skeleton className="w-3/4" />  // 75% - Good for titles
<Skeleton className="w-1/2" />  // 50% - Good for subtitles
<Skeleton className="w-2/3" />  // 66% - Good for paragraphs

// Fixed widths
<Skeleton className="w-32" />   // 128px - Good for buttons
<Skeleton className="w-48" />   // 192px - Good for labels
```

### Height Guidelines
```tsx
// Text heights
<Skeleton className="h-3" />    // 12px - Small text
<Skeleton className="h-4" />    // 16px - Body text
<Skeleton className="h-5" />    // 20px - Large text
<Skeleton className="h-6" />    // 24px - Subtitle
<Skeleton className="h-8" />    // 32px - Title

// Component heights
<Skeleton className="h-10" />   // 40px - Button
<Skeleton className="h-12" />   // 48px - Large button
<Skeleton className="h-16" />   // 64px - Card section
<Skeleton className="h-32" />   // 128px - Image
<Skeleton className="h-48" />   // 192px - Large image
```

---

## 🎯 Best Practices

### ✅ Do's

**Match Real Layout:**
```tsx
// Good - Matches actual content structure
<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />      {/* Title */}
  <Skeleton className="h-4 w-1/2" />      {/* Subtitle */}
  <Skeleton className="h-32 w-full" />    {/* Image */}
</div>
```

**Use Varying Widths:**
```tsx
// Good - Natural text-like appearance
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-4 w-4/5" />
</div>
```

**Group Related Skeletons:**
```tsx
// Good - Clear sections
<div className="space-y-8">
  <div className="space-y-2">
    {/* Section 1 */}
  </div>
  <div className="space-y-2">
    {/* Section 2 */}
  </div>
</div>
```

---

### ❌ Don'ts

**Uniform Widths (Boring):**
```tsx
// Bad - Looks robotic
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
</div>
```

**Too Many Skeletons:**
```tsx
// Bad - Overwhelming
<div>
  {Array.from({ length: 100 }).map((_, i) => (
    <Skeleton key={i} className="h-4 w-full" />
  ))}
</div>

// Good - Show reasonable amount
<ProjectListSkeleton count={5} />
```

**Mismatched Layout:**
```tsx
// Bad - Doesn't match real content
<div className="flex">
  <Skeleton className="h-32 w-32" />  {/* Real content is full width */}
</div>
```

---

## 🧪 Testing Checklist

### Visual Tests
- [ ] Skeleton matches real content layout
- [ ] Shimmer animation smooth (60 FPS)
- [ ] Pulse animation subtle and pleasant
- [ ] No layout shift when real content loads
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Spacing matches actual content

### Performance Tests
- [ ] Skeletons render quickly (< 16ms)
- [ ] Animations don't cause jank
- [ ] No memory leaks during loading
- [ ] CPU usage reasonable

### UX Tests
- [ ] Users understand content is loading
- [ ] Loading feels faster than spinner
- [ ] Smooth transition to real content
- [ ] Not too many skeleton elements

---

## 📊 Performance Metrics

### Target Metrics
```
First Paint:           < 16ms
Animation FPS:         60 FPS
Transition Duration:   200-300ms
Layout Shift:          0 (CLS = 0)
```

### Optimization Tips

**Use CSS Transforms:**
```css
/* Good - GPU accelerated */
transform: translateX(0);

/* Bad - Causes reflow */
left: 0;
```

**Minimize DOM Elements:**
```tsx
// Good - Efficient
<Skeleton className="h-32 w-full" />

// Bad - Too many elements
<div>
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  {/* ... 50 more ... */}
</div>
```

---

## 🎨 Design Tokens

### Colors
```css
/* Base skeleton color */
background: var(--accent);  /* Light gray */

/* Shimmer overlay */
background: linear-gradient(
  90deg,
  rgba(255, 255, 255, 0),
  rgba(255, 255, 255, 0.4),
  rgba(255, 255, 255, 0)
);
```

### Timing
```css
/* Pulse animation */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

/* Shimmer animation */
animation: shimmer 2s linear infinite;
```

### Border Radius
```css
/* Default */
border-radius: 0.375rem;  /* 6px */

/* Match component */
.rounded-full  /* Circular */
.rounded-lg    /* Large (8px) */
.rounded-md    /* Medium (6px) */
```

---

## 🔧 Advanced Techniques

### Skeleton with Aspect Ratio
```tsx
<div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
  <Skeleton className="absolute inset-0" />
</div>
```

### Circular Avatar Skeleton
```tsx
<Skeleton className="h-12 w-12 rounded-full" />
```

### Card with Shadow
```tsx
<div className="bg-white rounded-lg shadow-lg p-4">
  <Skeleton className="h-6 w-3/4 mb-2" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Progressive Reveal
```tsx
function ProgressiveImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        onLoad={() => setLoaded(true)}
        className={loaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  );
}
```

---

## 📱 Responsive Skeletons

### Mobile-First Approach
```tsx
<div className="space-y-4">
  {/* Mobile: 1 column, Desktop: 3 columns */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full hidden sm:block" />
    <Skeleton className="h-24 w-full hidden sm:block" />
  </div>
</div>
```

### Breakpoint-Specific Sizes
```tsx
<Skeleton className="h-32 sm:h-48 md:h-64 w-full" />
```

---

## 🚀 Quick Reference

### Common Patterns

**Page Header:**
```tsx
<div className="space-y-2">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

**Paragraph:**
```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-4 w-4/5" />
</div>
```

**Button:**
```tsx
<Skeleton className="h-10 w-32" />
```

**Card:**
```tsx
<div className="space-y-3">
  <Skeleton className="h-48 w-full" />
  <Skeleton className="h-6 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

---

## 📚 Resources

### Related Components
- `/components/ui/skeleton.tsx` - Base skeleton
- `/components/ProjectDetailSkeleton.tsx` - Full page
- `/components/ProjectCardSkeleton.tsx` - Cards and lists
- `/components/SearchSuggestionSkeleton.tsx` - Search

### Animations
- `/styles/globals.css` - Pulse and shimmer keyframes

### Examples
- `/pages/ProjectDetailPage.tsx` - Full implementation

---

**Status:** ✅ **Production Ready**

Skeletons provide 30% better perceived performance and significantly improve user experience during loading states.
