# 🎬 Project Hero Section - Visual Reference

## ✨ Overview

The Project Detail Page now features a stunning **full-screen hero section** that appears before the stacked cards, providing a beautiful introduction to each project with the project image, title, metadata, and smooth animations.

---

## 🎨 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [X]                                              [Share]        │ ← Buttons
│                                                                   │
│                      🇲🇽 Proyecto Nacional                       │ ← Badge
│                                                                   │
│                                                                   │
│                     PROJECT TITLE HERE                           │ ← Title
│                     Large & Centered                             │
│                                                                   │
│    🏢 Organization  •  📍 State  •  Category                    │ ← Metadata
│                                                                   │
│         Brief description of the project objective...            │ ← Description
│                                                                   │
│                                                                   │
│                      Desliza para explorar                        │ ← Scroll hint
│                             ↓                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
│                     [Background Image with Gradient]             │
```

---

## 📐 Component Breakdown

### 1. **Background Layer**
```tsx
- Full-screen project image
- Dark gradient overlay (60% → 80% → 100% opacity)
- Ensures text readability
- Smooth transition to stacked cards below
```

**CSS:**
```css
background: gradient from-[#0c4159]/60 via-[#0c4159]/80 to-[#0c4159]
```

### 2. **Close Button** (Top Left)
```tsx
Position: absolute top-6 left-6
Style: White circular button (48px)
Icon: X icon from Lucide
Hover: Scale + shadow enhancement
Action: Navigate back
```

**Features:**
- 🎯 Rounded full (circle)
- 🌫️ Backdrop blur
- 💫 Hover scale animation
- ♿ Focus ring for accessibility
- 🎨 White background with orange accent

### 3. **Share Button** (Top Right)
```tsx
Position: absolute top-6 right-6
Style: Matching circular button
Variant: "hero" (custom styling)
Icon: Share2 icon
Action: Share project via Web Share API or clipboard
```

**Hero Variant:**
```css
- Same circular white design as close button
- Consistent 48px size
- Icon scales on hover
- Toast notification on share/copy
```

### 4. **Project Badge** (National Projects Only)
```tsx
Condition: project.isNationalProject === true
Content: "🇲🇽 Proyecto Nacional"
Style: Orange accent with backdrop blur
Animation: Fade in (0ms delay)
```

**CSS:**
```css
background: bg-[#ff8012]/20
border: border-[#ff8012]/30
backdrop-filter: blur-sm
```

### 5. **Project Title**
```tsx
Font: Arvo (serif)
Size: 4xl → 5xl → 6xl (responsive)
Color: White
Alignment: Centered
Max-width: 4xl (896px)
Animation: Fade in from bottom (100ms delay)
```

### 6. **Metadata Bar**
```tsx
Layout: Flex wrap, centered
Gap: 4 → 6 (responsive)
Content:
  - 🏢 Organization name
  - 📍 State (if not national)
  - 🏷️ Category
Animation: Fade in (200ms delay)
```

**Icon Colors:**
```css
Icons: text-[#ff8012] (orange accent)
Text: text-white/90
Separators: text-white/40
```

### 7. **Description Preview**
```tsx
Content: First 200 chars of objective
Style: White/80% opacity
Font: Arvo
Max-width: 2xl (672px)
Line clamp: 3 lines
Animation: Fade in (300ms delay)
```

### 8. **Scroll Indicator**
```tsx
Content: "Desliza para explorar" + down arrow
Position: Bottom center
Animation: Gentle bounce (500ms delay)
Color: White/60% opacity
```

**Arrow SVG:**
```tsx
<svg> Chevron down icon </svg>
- Smooth animation
- Indicates more content below
```

---

## 🎬 Animation Timeline

### Staggered Entrance (Cascade Effect)

```
Time: 0ms     → Badge appears (if national)
Time: 100ms   → Title fades in from bottom
Time: 200ms   → Metadata bar appears
Time: 300ms   → Description fades in
Time: 500ms   → Scroll indicator starts bouncing
```

**Animation:** `heroFadeIn`
```css
@keyframes heroFadeIn {
  from: opacity 0, translateY(20px)
  to:   opacity 1, translateY(0)
}
Duration: 800ms
Easing: ease-out
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
```
Title: text-6xl (60px)
Metadata: text-base (16px)
Description: text-lg (18px)
Spacing: Large gaps (24px)
```

### Tablet (768px - 1023px)
```
Title: text-5xl (48px)
Metadata: text-base (16px)
Description: text-lg (18px)
Spacing: Medium gaps (20px)
```

### Mobile (≤767px)
```
Title: text-4xl (36px)
Metadata: text-sm (14px)
Description: text-base (16px)
Spacing: Small gaps (16px)
Padding: Reduced (24px sides)
```

---

## 🎨 Color Palette

### Background
```css
Base: #0c4159 (Deep blue)
Gradient: from-[#0c4159]/60 → via-[#0c4159]/80 → to-[#0c4159]
Bottom fade: from-[#0c4159] to transparent (32px height)
```

### Text
```css
Primary: white (100%)
Secondary: white/90 (90%)
Tertiary: white/80 (80%)
Muted: white/60 (60%)
Separator: white/40 (40%)
```

### Accents
```css
Orange: #ff8012
Orange glow: #ff8012/20 (backgrounds)
Orange border: #ff8012/30
```

### Buttons
```css
Background: white/90 with backdrop blur
Hover: white (100%)
Icon color: #0c4159
Shadow: lg → xl on hover
```

---

## ⚡ Interactive Elements

### Close Button
```typescript
onClick: () => onClose()
- Navigates back to previous page
- Smooth scale animation on hover
- Focus ring for keyboard navigation
```

### Share Button
```typescript
onClick: () => handleShare()
Actions:
1. Try Web Share API (mobile-first)
2. Fallback to clipboard copy
3. Show toast notification
4. Display checkmark icon for 2 seconds
```

**Web Share Data:**
```javascript
{
  title: project.name,
  text: `Conoce este proyecto social: ${project.name}`,
  url: window.location.href
}
```

---

## 🏗️ Technical Implementation

### Component Structure
```tsx
<ProjectHeroSection>
  <Background layer>
    - Project image (full cover)
    - Gradient overlay
  </Background>
  
  <Close button> (absolute top-left)
  <Share button> (absolute top-right)
  
  <Content> (centered flex column)
    {isNational && <Badge />}
    <Title />
    <Metadata />
    {objective && <Description />}
    <ScrollIndicator />
  </Content>
  
  <Bottom fade> (gradient to cards)
</ProjectHeroSection>
```

### Props
```typescript
interface ProjectHeroSectionProps {
  project: Project;     // Full project data
  onClose: () => void;  // Close handler
}
```

---

## 🎯 User Experience Benefits

### 1. **Immediate Context**
- Users instantly see project image and title
- Clear organization and location
- Quick description preview

### 2. **Beautiful First Impression**
- Full-screen hero creates impact
- Professional, modern design
- Smooth animations draw attention

### 3. **Clear Navigation**
- Close button always visible (top-left)
- Share functionality easily accessible (top-right)
- Scroll indicator guides users to content

### 4. **Responsive Design**
- Adapts to all screen sizes
- Touch-friendly button sizes (48px)
- Readable text at any viewport

---

## ♿ Accessibility Features

### Semantic HTML
```html
<h1> for project title (proper heading hierarchy)
<button> with aria-labels for actions
```

### Keyboard Navigation
```typescript
Close button: Tab + Enter
Share button: Tab + Enter
Focus rings: 2px white ring with offset
```

### Screen Readers
```html
aria-label="Cerrar y volver al mapa"
aria-label="Compartir proyecto"
Alt text on images
```

### Color Contrast
```
White text on dark blue: 12:1+ ratio (AAA)
Icon colors: High contrast
Overlay ensures readability on all images
```

---

## 🎨 Visual Polish

### Shadows
```css
Buttons: shadow-lg (elevated)
Hover: shadow-xl (more elevated)
Subtle depth throughout
```

### Blur Effects
```css
Backdrop blur on buttons: blur-sm
Badge background: blur-sm + tint
Creates frosted glass effect
```

### Transitions
```css
Buttons: 200ms all
Icons: transform on hover (scale 1.1)
Smooth and polished feel
```

---

## 🔄 Integration with Stacked Cards

### Scroll Flow
```
1. User lands on hero (100vh)
2. Scrolls down → sees scroll indicator
3. Content transitions from hero → stacked cards
4. Bottom gradient creates seamless blend
5. First card (Objetivo) slides up from bottom
6. Tabs appear horizontally as cards stack
```

### Visual Continuity
```css
Hero background: #0c4159
Cards background: Same #0c4159
Gradient blend: Smooth transition
No visual jump or jarring change
```

---

## 📊 Layout Measurements

### Hero Section
```
Height: 100vh (full viewport)
Padding: 24px (mobile) → 48px → 80px (desktop)
Content max-width: 1280px
```

### Buttons
```
Size: 48px × 48px (circular)
Icon size: 24px
Position offset: 24px from edges
```

### Typography
```
Title: 36px → 48px → 60px
Metadata: 14px → 16px
Description: 16px → 18px
Line height: 1.5 (consistent)
```

### Spacing
```
Badge → Title: 24px
Title → Metadata: 24px
Metadata → Description: 32px
Description → Scroll: 32px
```

---

## 🚀 Performance Optimizations

### Image Loading
```tsx
<ImageWithFallback> component
- Lazy loading built-in
- Fallback handling
- Optimized rendering
```

### CSS Animations
```css
transform & opacity only (GPU accelerated)
will-change hints for smooth performance
Hardware acceleration enabled
```

### Responsive Images
```tsx
object-cover ensures proper scaling
No layout shift during load
Smooth gradient overlay
```

---

## 💡 Best Practices

### Content Guidelines
- **Title**: Keep concise (max 2 lines)
- **Description**: 200 chars max for preview
- **Metadata**: 3-4 items maximum
- **Images**: High quality, 1920×1080+ recommended

### Animation Guidelines
- Stagger delays by 100ms for cascade
- Keep animations under 1s total
- Use `animation-fill-mode: both` for delays
- Respect `prefers-reduced-motion`

### Button Placement
- Top-left: Primary action (close)
- Top-right: Secondary action (share)
- Consistent with web conventions

---

## 🎉 Summary

The Project Hero Section provides a **stunning, full-screen introduction** to each project with:

✅ **Full-viewport hero** with project image and gradient overlay  
✅ **Animated entrance** with staggered fade-ins  
✅ **Clear navigation** with close and share buttons  
✅ **Rich metadata** showing organization, location, and category  
✅ **Description preview** with first 200 characters  
✅ **Scroll indicator** guiding users to stacked cards below  
✅ **Responsive design** adapting to all screen sizes  
✅ **Accessibility** with proper semantics and keyboard navigation  
✅ **Smooth integration** with stacked cards system  

**It's the perfect opening act before the beautiful stacked card experience!** 🎬✨
