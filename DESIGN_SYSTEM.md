# MoroccoEdu Design System

## 🎨 Design Philosophy

**Inspired by:** Stripe, Notion, Apple  
**Style:** Minimal, clean, modern, professional  
**Focus:** Readability, contrast, strong visual hierarchy

---

## 🌈 Color Palette

### Backgrounds
```css
--bg-main: #0B0F1A;        /* Deep dark - primary background */
--bg-secondary: #111827;   /* Slightly lighter - cards, sections */
--bg-card: #1F2937;        /* Elevated surfaces - inputs, overlays */
--bg-elevated: #253043;    /* Higher elevation */
--bg-hover: #1F2937;       /* Hover states */
```

### Primary Colors (Gradient System)
```css
--primary-indigo: #6366F1;     /* Main brand color */
--primary-purple: #8B5CF6;     /* Secondary brand color */
--primary-gradient: linear-gradient(135deg, #6366F1, #8B5CF6);
```

**Usage:**
- Active navigation items
- Primary buttons
- Highlights and accents
- Stats and important numbers

### Accent - Moroccan Gold
```css
--accent-gold: #C9A227;
--accent-gold-light: rgba(201, 162, 39, 0.1);
```

**Usage (sparingly):**
- Special badges
- Important icons
- Premium features
- Cultural highlights

### Text Colors
```css
--text-primary: #FFFFFF;      /* Headings, important text */
--text-secondary: #9CA3AF;    /* Body text, descriptions */
--text-muted: #6B7280;        /* Meta info, timestamps */
```

### Status Colors
```css
--error: #EF4444;    /* Errors, dislikes */
--success: #10B981;  /* Success, likes */
--warning: #F59E0B;  /* Warnings */
```

### Borders
```css
--border-subtle: #1F2937;   /* Light borders */
--border-default: #374151;  /* Default borders */
--border-focus: #6366F1;    /* Focus states */
```

---

## 🧱 Reusable Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}
```

### Cards
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Inputs
```css
.input {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-indigo);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-gold {
  background: var(--accent-gold-light);
  color: var(--accent-gold);
  border: 1px solid rgba(201, 162, 39, 0.2);
}

.badge-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-indigo);
  border: 1px solid rgba(99, 102, 241, 0.2);
}
```

---

## 📐 Layout System

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

### Border Radius
```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6);
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
```

---

## 🎯 Component Guidelines

### Navbar
- **Background:** `rgba(11, 15, 26, 0.95)` with backdrop blur
- **Height:** 64px
- **Border:** 1px subtle bottom border
- **Logo:** Gradient text (indigo → gold)
- **Active Item:** Full gradient background, white text

### Sidebar
- **Background:** `#0B0F1A` (same as main bg)
- **Border:** 1px right border (`#1F2937`)
- **Width:** 260px
- **Active Item:** Gradient background, white text, left indicator bar
- **Hover:** TranslateX(4px) + background change

### Resource Cards
- **Layout:** Horizontal (vote section + content)
- **Vote Section:** 60px width, separate background
- **Content:** 24px padding
- **Hover:** Scale(1.01) + translateY(-2px)
- **Border:** Subtle → Default on hover

### Search Bar
- **Background:** `#1F2937`
- **Border:** `#374151` → `#6366F1` on focus
- **Focus:** Soft glow effect (3px indigo shadow)
- **Border Radius:** Full (pill shape)
- **Padding:** 14px 20px

### Right Sidebar
- **Background:** `#0B0F1A`
- **Width:** 320px
- **Hidden:** Below 1280px
- **Sections:** Trending, Stats, Community Info

---

## ✨ Animation & Transitions

### Timing
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### Common Patterns

**Hover Lift:**
```css
transform: translateY(-2px);
box-shadow: var(--shadow-md);
```

**Hover Scale:**
```css
transform: scale(1.02);
```

**Active Press:**
```css
transform: translateY(0) scale(0.98);
```

**Slide In:**
```css
transform: translateX(4px);
```

---

## 📝 Typography

### Font Family
```css
--font-main: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Heading Sizes
```css
h1: 2.5rem (40px) - font-weight: 700
h2: 2rem (32px)   - font-weight: 700
h3: 1.5rem (24px) - font-weight: 700
h4: 1.25rem (20px) - font-weight: 700
```

### Body Text
```css
font-size: 16px
line-height: 1.6
color: var(--text-primary)
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(to right, #6366F1, #C9A227);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 🎨 Usage Examples

### When to Use Each Color

**Indigo/Purple Gradient:**
- Primary CTAs (Create Resource, Submit, etc.)
- Active navigation states
- Important statistics
- Premium features

**Moroccan Gold:**
- Special badges (Featured, Premium)
- Cultural highlights
- Achievement icons
- Sparingly for maximum impact

**White Text:**
- Headings and titles
- Important information
- Button text on gradient backgrounds

**Secondary Text:**
- Body content
- Descriptions
- Normal UI text

**Muted Text:**
- Timestamps
- Metadata
- Helper text
- Disabled states

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  - Sidebar hidden (hamburger menu)
  - Single column layout
  - Reduced font sizes
  - Full-width cards
}

/* Tablet */
@media (max-width: 1280px) {
  - Right sidebar hidden
  - Main content expands
  - Two-column grids
}

/* Desktop */
@media (min-width: 1281px) {
  - Full 3-column layout
  - Sidebar + Main + Right Sidebar
}
```

---

## 🚀 Best Practices

### Do's ✅
- Use CSS variables for consistency
- Maintain contrast ratios (WCAG AA minimum)
- Use gradient sparingly for emphasis
- Keep spacing consistent (use spacing scale)
- Add hover states to interactive elements
- Use transitions for smooth UX

### Don'ts ❌
- Don't use too many colors
- Don't mix border radius sizes randomly
- Don't skip hover/active states
- Don't use pure black (#000000)
- Don't overload with shadows
- Don't ignore accessibility

---

## 🎯 Visual Hierarchy

1. **Level 1 (Most Important):** Gradient text, primary buttons
2. **Level 2:** Headings, active states
3. **Level 3:** Body text, secondary information
4. **Level 4:** Meta info, timestamps, muted text

---

## 🔧 Implementation Notes

### CSS Variables
All colors and design tokens are defined in `index.css` root for easy theming and maintenance.

### Component Structure
- Each component has its own CSS file
- Uses CSS variables exclusively
- Follows BEM-like naming convention
- Mobile-first responsive design

### Performance
- Minimal CSS (no unused styles)
- Hardware-accelerated transforms
- Optimized transitions
- Lazy loading for heavy components

---

**Last Updated:** 2026-04-19  
**Version:** 2.0 (Premium Redesign)
