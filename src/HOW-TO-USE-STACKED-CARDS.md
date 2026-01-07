# 🚀 Stacked Cards View - Now the Default!

## ✨ What Changed

The **stacked cards view** is now the **default experience** for all project detail pages! Users will automatically see the beautiful folder-like card stacking experience when they view any project.

---

## 📍 How to Access Project Details

### **Method 1: From the Map View** (Primary)

1. **Click on any project marker** on the map
2. In the project preview panel, click **"Ver detalles"**
3. The project detail page opens automatically in **stacked cards view**

---

### **Method 2: Direct URL Access**

Simply navigate to any project using the standard URL format:

```
/proyecto/{PROJECT_ID}
```

**Examples:**
```
http://localhost:5173/proyecto/PRJ-001
http://localhost:5173/proyecto/PRJ-002
http://localhost:5173/proyecto/PRJ-003
```

All of these will now open in the beautiful stacked cards view by default!

---

### **Method 3: Programmatic Navigation (for developers)**

In your code, navigate to projects normally:

```tsx
import { useNavigate } from 'react-router-dom';

function YourComponent() {
  const navigate = useNavigate();
  
  const openProjectDetails = (projectId: string) => {
    navigate(`/proyecto/${projectId}`);
  };
  
  return (
    <button onClick={() => openProjectDetails('PRJ-001')}>
      View Project Details
    </button>
  );
}
```

---

## 🎨 The Stacked Cards Experience

When you open any project, you get the complete stacked cards experience:

### **1. Hero Section** 📸
- Full-screen project image with gradient overlay
- Project title (large, centered)
- Organization, state, and category metadata
- Quick description preview
- "🇲🇽 Proyecto Nacional" badge (if applicable)
- Close button (top-left)
- Share button (top-right)
- Scroll indicator ("Desliza para explorar")

### **2. Stacked Cards** 📚
As you scroll down from the hero, 7 sections slide up and stack:

#### **Card 1: Objetivo** 🎯
- Main project objective
- Project metadata grid (category, thematic area, location, organization)

#### **Card 2: Beneficiarios** 👥
- Beneficiaries information with highlighted numbers
- Breakout image on left side

#### **Card 3: Factores de Riesgo** ⚠️
- Risk factors with highlighted key phrases
- Breakout image on right side

#### **Card 4: Metodología** 📋
- Methodology with highlighted phrases
- Breakout image on left side

#### **Card 5: Resultados** 📊
- Main results with highlighted numbers
- Breakout image on right side

#### **Card 6: Evaluación** ⭐
- Evaluation criteria highlights
- Total score and final ranking position

#### **Card 7: Información de Contacto** 📧
- Contact information footer

### **3. Navigation System** 🧭

You can navigate through sections using:

**a) Scroll** (Primary)
- Scroll down → Next card slides up from bottom
- Scroll up → Current card slides down

**b) Horizontal Tabs** (Top)
- Click any tab to jump to that section
- Tabs stack horizontally like file folders
- Active tab highlighted with orange accent

**c) Navigation Buttons** (Bottom-left)
- "← Anterior" → Previous section
- "Siguiente →" → Next section

**d) Progress Rail** (Right side)
- Vertical dots showing all sections
- Click any dot to jump directly
- Current section highlighted

**e) Keyboard** ⌨️
- `↓` or `PageDown` → Next section
- `↑` or `PageUp` → Previous section
- `Home` → First section
- `End` → Last section

---

## 🎯 Quick Start Guide

### **For Testing:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser to:**
   ```
   http://localhost:5173/
   ```

3. **Click any project marker on the map**

4. **Click "Ver detalles" in the preview panel**

5. **Scroll down** to see the beautiful card stacking effect!

6. **Try all navigation methods:**
   - Scroll naturally
   - Click the tabs at the top
   - Use the navigation buttons at bottom-left
   - Click the progress rail dots on the right
   - Try keyboard shortcuts

---

## 📱 Responsive Behavior

The stacked cards view automatically adapts to screen size:

### **Desktop** (≥1024px)
- All 7 tabs visible
- Smooth 700ms animations
- Full-width breakout images

### **Tablet** (768px - 1023px)
- First 5-6 tabs visible
- Slightly faster animations (500ms)
- Responsive image layouts

### **Mobile** (≤767px)
- First 4-5 tabs visible
- Quick animations (400ms)
- Stacked layout for breakout sections

---

## 🎬 Complete Component Architecture

Here's what renders when you access any project detail page:

```
ProjectDetailPage
└── ProjectStackedCardsView
    ├── ProjectHeroSection
    │   ├── Background Image + Gradient
    │   ├── Close Button (top-left)
    │   ├── Share Button (top-right)
    │   ├── Badge (if national project)
    │   ├── Title
    │   ├── Metadata Bar
    │   ├── Description Preview
    │   └── Scroll Indicator
    │
    ├── Stacked Cards Container (700vh scroll space)
    │   └── Sticky Viewport (100vh)
    │       ├── StackedCardSection (Objetivo)
    │       │   ├── Card Tab
    │       │   ├── Card Body
    │       │   └── Content
    │       │
    │       ├── StackedCardSection (Beneficiarios)
    │       │   └── BreakoutImageSection (left)
    │       │
    │       ├── StackedCardSection (Riesgos)
    │       │   └── BreakoutImageSection (right)
    │       │
    │       ├── StackedCardSection (Metodología)
    │       │   └── BreakoutImageSection (left)
    │       │
    │       ├── StackedCardSection (Resultados)
    │       │   └── BreakoutImageSection (right)
    │       │
    │       ├── StackedCardSection (Evaluación)
    │       │   └── Score Grid
    │       │
    │       └── StackedCardSection (Contacto)
    │           └── GlobalFooter
    │
    ├── Navigation Buttons (bottom-left)
    │   ├── Anterior Button
    │   └── Siguiente Button
    │
    └── ProgressRail (right side)
        └── 7 Dot Indicators
```

---

## 💡 Pro Tips

### **1. Smooth Scrolling**
Scroll slowly to appreciate the smooth slide-up animations.

### **2. Try All Navigation Methods**
Experiment with scrolling, tabs, buttons, rail, and keyboard - they all work together beautifully!

### **3. Keyboard Power User**
Use `Home` to jump to start, `End` to jump to contact, arrows to step through.

### **4. Responsive Testing**
Try resizing your browser to see how the layout adapts!

### **5. Share Beautiful Projects**
The share button in the hero section makes it easy to share projects with the beautiful stacked cards view!

---

## 🎨 Visual States

### **Scroll-Driven States:**

```
Scroll 0%   → Hero Section visible
Scroll 10%  → First card (Objetivo) starts sliding up
Scroll 14%  → Objetivo fully stacked
Scroll 24%  → Beneficiarios starts sliding up
Scroll 28%  → Beneficiarios fully stacked
... and so on for all 7 sections
```

### **Tab States:**

- **Inactive**: Gray background, semi-transparent
- **Hover**: Slight lift, shadow enhancement
- **Active**: Orange accent bar, elevated position
- **Focus**: Orange outline ring (keyboard navigation)

### **Card States:**

- **Hidden**: `translateY(100%)`, `opacity: 0`
- **Sliding**: `translateY(50%)`, `opacity: 0.5`
- **Stacked**: `translateY(0%)`, `opacity: 1`

---

## 📚 Related Components

All these components work together to create the stacked cards experience:

### **Core Components:**
- `/components/ProjectStackedCardsView.tsx` - Main container
- `/components/ProjectHeroSection.tsx` - Hero section
- `/components/StackedCardSection.tsx` - Individual card
- `/components/ProgressRail.tsx` - Navigation rail
- `/components/BreakoutImageSection.tsx` - Image layouts

### **Content Components:**
- `/components/TypewriterText.tsx` - Animated text
- `/components/HighlightNumbers.tsx` - Number highlighting
- `/components/HighlightPhrases.tsx` - Phrase highlighting
- `/components/GlobalFooter.tsx` - Contact info
- `/components/ShareButton.tsx` - Share functionality

### **Supporting Files:**
- `/styles/globals.css` - All animations and styles
- `/pages/ProjectDetailPage.tsx` - Page routing
- `/types/index.ts` - TypeScript types

---

## 🎉 Summary

The stacked cards view is now the default experience:

✅ **Click any project marker on the map**  
✅ **Click "Ver detalles" to open the project**  
✅ **Hero section appears first with project image and details**  
✅ **Scroll down to see 7 cards slide up and stack beautifully**  
✅ **Navigate using tabs, buttons, rail, keyboard, or scroll**  
✅ **Works perfectly on desktop, tablet, and mobile**  
✅ **Fully accessible with keyboard and screen reader support**  
✅ **Smooth 700ms animations with elegant polish**  

**No URL parameters needed - it just works!** 🎬✨

---

## 🔗 Quick Reference

**URL Pattern:**
```
/proyecto/{PROJECT_ID}
```

**Example:**
```
http://localhost:5173/proyecto/PRJ-001
```

**That's it! Beautiful stacked cards are now the default!** 🚀📚✨
