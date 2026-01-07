# 🎨 Evaluation Card - Visual Reference

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EVALUATION CRITERIA                             │
│  Criterios de evaluación destacados                                │
│  • Criterion 1...                                                   │
│  • Criterion 2...                                                   │
└─────────────────────────────────────────────────────────────────────┘

                           ────────────
                          ⬤ Resultados ⬤
                           ────────────

┌──────────────────────────────┐  ┌──────────────────────────────┐
│  ○ WARM ORANGE GRADIENT      │  │  ○ COOL BLUE GRADIENT        │
│     ┌─────────────────────┐  │  │     ┌─────────────────────┐  │
│     │ 🔍 Puntaje Total    │  │  │     │ 🏆 Posición Final   │  │
│     │ Evaluaciones...     │  │  │     │ Resultados Finales  │  │
│     └─────────────────────┘  │  │     └─────────────────────┘  │
│                              │  │                              │
│         [ANIMATED]           │  │         [ANIMATED]           │
│           856                │  │           3er                │
│          puntos              │  │          lugar               │
│                              │  │                              │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │  │     ⭐ Proyecto Destacado    │
│     [Progress Bar]           │  │     [If top 3]               │
└──────────────────────────────┘  └──────────────────────────────┘

┌───────────┬───────────┬───────────┬───────────┐
│ 🎯        │ 📊        │ 🎯        │ ⭐        │
│ Categoría │ Evaluado  │ Criterios │ Impacto   │
│ Social    │ ✓         │ Múltiples │ Alto      │
└───────────┴───────────┴───────────┴───────────┘
```

---

## 🎨 Score Card - Detailed Anatomy

### **Total Score Card (Primary)**

```
╔═══════════════════════════════════════════════════════╗
║  ┌─────┐                                              ║
║  │ 📈  │  PUNTAJE TOTAL                               ║
║  └─────┘  Evaluaciones Acumuladas                     ║
║                                                        ║
║                                                        ║
║                    856                                 ║
║                   puntos                               ║
║                                                        ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░           ║
║  [Animated progress bar - fills from 0 to 100%]       ║
║                                                        ║
║  🔆 Decorative blur circles in background             ║
╚═══════════════════════════════════════════════════════╝

Colors:
- Background: Linear gradient from #ff8012/5 → white → #ff8012/10
- Border: 2px solid #ff8012/20 (glows to /30 on hover)
- Number: Gradient text from #ff8012 → #ff8012/70
- Progress bar: #ff8012 gradient with glow
- Shadow: Orange glow shadow
```

### **Ranking Card (Secondary)**

```
╔═══════════════════════════════════════════════════════╗
║  ┌─────┐                                              ║
║  │ 🏆  │  POSICIÓN FINAL                              ║
║  └─────┘  Resultados Finales                          ║
║                                                        ║
║                                                        ║
║                    3er                                 ║
║                   lugar                                ║
║                                                        ║
║  ⭐ Proyecto Destacado                                ║
║  [Only shown for top 3 positions]                     ║
║                                                        ║
║  🔆 Decorative blur circles in background             ║
╚═══════════════════════════════════════════════════════╝

Colors:
- Background: Linear gradient from #0c4159/5 → white → #0c4159/10
- Border: 2px solid #0c4159/20 (glows to /30 on hover)
- Number: Solid #0c4159
- Badge: #ff8012 with star icon
- Shadow: Blue glow shadow
```

---

## 🎬 Animation Sequence

### **Timeline**

```
0ms    │ Cards invisible (opacity: 0, translateY: 20px)
       │
200ms  │ Score card starts entrance
       │ ↓ Bounces in with spring
600ms  │ Score card fully visible
       │ Score counter starts: 0 → 856
       │
400ms  │ Ranking card starts entrance (200ms delay)
       │ ↓ Bounces in with spring
800ms  │ Ranking card fully visible
       │
900ms  │ Ranking counter starts: 0 → 3 (500ms after score)
       │
2200ms │ Score counter completes (2s duration)
2400ms │ Ranking counter completes (1.5s duration)
       │
       │ Progress bar fills during score animation
       │ Achievement badge fades in for top 3
```

### **Animation Details**

**Entrance (score-card-entrance):**
```
Stage 1 (0%)   : opacity: 0, y: +20px, scale: 0.95
Stage 2 (60%)  : y: -5px, scale: 1.02  [bounce peak!]
Stage 3 (100%) : opacity: 1, y: 0, scale: 1.0
```

**Counter Animation:**
```javascript
// 60 steps over 2 seconds = 33.3ms per step
0     →  14   →  28   →  43   →  57   →  ... →  856
0ms      33ms    66ms    99ms    133ms   ...   2000ms

// Easing: Linear (smooth counting)
// Display: Math.floor() for integer display
```

**Progress Bar:**
```css
width: 0% → 100%
duration: 2000ms
easing: ease-out
box-shadow: 0 0 10px rgba(255, 128, 18, 0.3)
```

---

## 🎨 Color Palette

### **Orange Theme (Score Card)**
```css
Primary:    #ff8012
Light:      #ff8012/10
Medium:     #ff8012/20
Border:     #ff8012/30
Glow:       rgba(255, 128, 18, 0.1)

Gradient:
  from-[#ff8012]/5
  via-white
  to-[#ff8012]/10
```

### **Blue Theme (Ranking Card)**
```css
Primary:    #0c4159
Light:      #0c4159/10
Medium:     #0c4159/20
Border:     #0c4159/30
Glow:       rgba(12, 65, 89, 0.1)

Gradient:
  from-[#0c4159]/5
  via-white
  to-[#0c4159]/10
```

### **Neutral Elements**
```css
White:      #ffffff
Gray Light: #f5f5f5
Gray Med:   #0c4159/40
Gray Dark:  #0c4159/60
```

---

## 📏 Spacing & Sizing

### **Card Dimensions**
```
Desktop:
  - Card width: 50% (2-column grid)
  - Card height: auto
  - Padding: 40px
  - Border radius: 16px
  - Gap: 32px

Mobile:
  - Card width: 100% (stacked)
  - Padding: 32px
  - Gap: 24px
```

### **Typography**
```
Labels:
  - Size: 12px
  - Transform: uppercase
  - Tracking: 0.1em (wider)
  - Opacity: 0.5-0.6

Score Numbers:
  - Size: 96px (6xl desktop), 72px (mobile)
  - Font: Arvo serif
  - Weight: 400
  - Line height: 1

Supporting Text:
  - Size: 14px
  - Opacity: 0.4
  - Font: Arvo serif
```

### **Icons**
```
Main Icons (cards):
  - Container: 40px × 40px
  - Icon: 20px × 20px
  - Background: Primary color/10
  - Border radius: 8px

Metric Icons (grid):
  - Size: 20px × 20px
  - No container
  - Color: inherit
```

---

## 🎭 Interactive States

### **Hover Effects**
```css
Default → Hover Transition

Card:
  border: /20 → /30           (300ms ease)
  shadow: lg → xl             (300ms ease)
  background blur: /5 → /10   (500ms ease)

Icon Container:
  scale: 1.0 → 1.1            (300ms ease)
  
Score Number:
  scale: 1.0 → 1.05           (300ms ease)

Background Decorations:
  opacity: 0.05 → 0.10        (500ms ease)
```

### **Focus States (Accessibility)**
```css
Keyboard Focus:
  outline: 2px solid #ff8012
  outline-offset: 4px
  border-radius: inherit
```

---

## 📱 Responsive Breakpoints

### **Desktop (≥1024px)**
```
Grid: 2 columns
Score card: Left
Ranking card: Right
Number size: 96px (text-7xl)
Padding: 40px
Decorations: Full size
```

### **Tablet (768px - 1023px)**
```
Grid: 2 columns
Number size: 80px (text-6xl)
Padding: 36px
Decorations: Medium size
```

### **Mobile (<768px)**
```
Grid: 1 column (stack)
Score card: Top
Ranking card: Bottom
Number size: 64px (text-5xl)
Padding: 32px
Decorations: Smaller/hidden
```

---

## 🎪 Special Features

### **Achievement Badge (Top 3)**
```
When project.finalRankingPosition <= 3:

┌────────────────────────┐
│ ⭐ Proyecto Destacado  │
└────────────────────────┘

Styling:
  - Color: #ff8012
  - Icon: Star (filled)
  - Size: 14px text, 20px icon
  - Animation: Fade in after counter completes
  - Glow effect: Subtle pulse
```

### **Progress Bar (Score Card)**
```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░

Background: #0c4159/5
Fill: Linear gradient from #ff8012 → #ff8012/60
Height: 8px
Border radius: 9999px (pill)
Shadow: 0 0 10px rgba(255, 128, 18, 0.3)
Animation: Width 0 → 100% over 2s
```

### **Decorative Blur Circles**
```
Top Right:
  - Size: 128px × 128px
  - Position: -32px top, -32px right
  - Color: Primary/5 → Primary/10 on hover
  - Blur: 32px

Bottom Left:
  - Size: 96px × 96px
  - Position: -16px bottom, -16px left
  - Color: Complementary/5
  - Blur: 24px
```

---

## 🎨 CSS Classes Reference

### **Main Card Classes**
```css
.evaluation-card-primary {
  background: gradient-to-br from-[#ff8012]/5 via-white to-[#ff8012]/10;
  border: 2px solid rgb(255 128 18 / 0.2);
  box-shadow: 0 10px 15px -3px rgb(255 128 18 / 0.05);
  border-radius: 1rem;
  padding: 2.5rem;
}

.evaluation-card-secondary {
  background: gradient-to-br from-[#0c4159]/5 via-white to-[#0c4159]/10;
  border: 2px solid rgb(12 65 89 / 0.2);
  box-shadow: 0 10px 15px -3px rgb(12 65 89 / 0.05);
  border-radius: 1rem;
  padding: 2.5rem;
}

.score-number {
  font-size: 6rem;
  font-family: 'Arvo', serif;
  background: linear-gradient(to bottom right, #ff8012, rgb(255 128 18 / 0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
```

---

## 🎯 Metrics Grid Layout

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│              │              │              │              │
│      🎯      │      📊      │      🎯      │      ⭐      │
│   Categoría  │   Evaluado   │   Criterios  │   Impacto    │
│              │              │              │              │
│    Social    │      ✓       │  Múltiples   │     Alto     │
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘

Styling:
- Background: White/50 + backdrop blur
- Padding: 16px
- Border radius: 8px
- Text align: center
- Gap: 16px
```

---

## 🎬 Complete Animation Flow

```
User scrolls to Evaluation section
        ↓
Intersection Observer triggers (30% visible)
        ↓
hasAnimated = true (prevents re-trigger)
        ↓
    ┌───────────────────────────────────┐
    │   SCORE CARD ANIMATION START      │
    │   Duration: 600ms + 2000ms        │
    └───────────────────────────────────┘
            ↓                    ↓
    Card Entrance          Counter Animation
    (0-600ms)              (0-2000ms)
     - Fade in              - Count 0 → 856
     - Slide up             - 60 steps
     - Bounce               - Linear easing
     - Scale                
                            
            ↓                    ↓
    Progress Bar           Achievement Badge
    (0-2000ms)             (If top 3)
     - Fill 0 → 100%        - Fade in at end
     - Ease-out             
        
    ┌───────────────────────────────────┐
    │   RANKING CARD ANIMATION START    │
    │   Delay: 200ms                    │
    │   Duration: 600ms + 1500ms        │
    └───────────────────────────────────┘
            ↓                    ↓
    Card Entrance          Counter Animation
    (200-800ms)            (900-2400ms)
     - Same as score        - Count 0 → 3
                            - 30 steps
                            
            ↓
    All animations complete
    Final state rendered
    Hover effects active
```

---

## 💡 Quick Tips

### **What Makes It Great:**
1. ✅ **Counter creates anticipation** - Numbers build excitement
2. ✅ **Staggered timing** - Prevents overwhelming the user
3. ✅ **Visual hierarchy** - Score is primary, ranking secondary
4. ✅ **Achievement celebration** - Top 3 badge rewards excellence
5. ✅ **Smooth transitions** - Everything feels polished
6. ✅ **Hover rewards** - Cards respond to interaction
7. ✅ **Additional context** - Metrics provide supporting info
8. ✅ **Accessible** - Works for everyone

### **Performance Notes:**
- Uses Intersection Observer (efficient)
- Animates only once (no re-triggers)
- GPU-accelerated transforms
- Respects prefers-reduced-motion
- Cleans up timers on unmount

---

## 🎉 Final Result

A **stunning, dynamic evaluation card** that:
- 📊 Counts up scores dramatically
- 🎨 Uses beautiful gradients
- ✨ Animates smoothly
- 🏆 Celebrates achievements
- 📱 Works everywhere
- ♿ Accessible to all

**The perfect showcase for project evaluation results!** 🚀
