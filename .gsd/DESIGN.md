# Design System

> **Source of Truth**: `.privy/ux_ui.html`

This document defines the visual design language for the application, based on the approved Glassmorphism template.

## Core Philosophy
- **Style**: Glassmorphism (Frosted glass)
- **Theme**: Deep Space / Ocean Blue
- **Vibe**: Modern, Premium, Clean
- **Font**: Inter (Google Fonts)

## Design Tokens

### Colors
**Backgrounds**:
- Deep Blue: `#020617`
- Complex Radial Gradients:
  ```css
  background-image: 
      radial-gradient(at 20% 30%, rgba(30, 144, 255, 0.4) 0, transparent 50%),
      radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.4) 0, transparent 50%), 
      radial-gradient(at 100% 0%, rgba(30, 58, 138, 0.5) 0, transparent 50%), 
      radial-gradient(at 100% 100%, rgba(15, 23, 42, 1) 0, transparent 50%), 
      radial-gradient(at 0% 100%, rgba(30, 64, 175, 0.3) 0, transparent 50%),
      radial-gradient(at 50% 50%, #0f172a 0, transparent 60%);
  ```

**Glass Effect**:
- Border: `rgba(255, 255, 255, 0.1)`
- Surface: `rgba(255, 255, 255, 0.05)`
- Highlight: `rgba(255, 255, 255, 0.15)`

### Typography
- **Family**: Inter, sans-serif
- **Headings**: Bold, Tracking-tight, Drop-shadow
- **Body**: Text-blue-100/80

## Components

### 1. Glass Panel (Card)
Standard container for content.
```css
.glass-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem; /* rounded-3xl */
}
```

### 2. Primary Button (Sign Up / Action)
Gradient background with interaction effects.
```css
.btn-signup {
    background: linear-gradient(to bottom, #3b82f6, #2563eb);
    border-top: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2), inset 0 1px 2px rgba(255,255,255,0.1);
    color: white;
}
.btn-signup:hover {
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4), inset 0 1px 2px rgba(255,255,255,0.2);
    transform: translateY(-1px);
}
```

### 3. Secondary Button (Login / Ghost)
Transparent with subtle border.
```css
.btn-login {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
}
.btn-login:hover {
    background: rgba(255, 255, 255, 0.1);
}
```

### 4. Glass Inner (Nested Sections)
For distinguishing areas within a glass panel.
```css
.glass-inner {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
}
```

## Tailwind Configuration
Required `extend` in `tailwind.config.js`:
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      glass: {
        border: 'rgba(255, 255, 255, 0.1)',
        surface: 'rgba(255, 255, 255, 0.05)',
        highlight: 'rgba(255, 255, 255, 0.15)',
      }
    }
  }
}
```

## Implementation Rules
1.  **Always** use `Inter` font.
2.  **Always** apply the deep blue gradient to the `body` or main wrapper.
3.  **Use** `glass-panel` for all main content containers.
4.  **Avoid** solid opaque backgrounds for containers; maintain transparency.
