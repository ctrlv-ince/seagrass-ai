# 🌿 Seagrass AI — Design System & UI Specification

> **Single Source of Truth** for visual language, interaction patterns, design tokens, and components across the **Web** (`web/`) and **Mobile** (`mobile/`) platforms.

---

## 1. Design Philosophy: Scientific Elegance

Seagrass AI is a **scientific decision-support tool** for coastal marine biologists, oceanographers, and environmental agencies. The interface must communicate **precision, credibility, and clarity**:

1. **Marine-Inspired Palette**: Oceanic teals, cyans, and emeralds anchored by clean slate neutrals. Avoid generic flat primaries.
2. **Data-Dense Yet Legible**: Scientific metrics (shoot density $/m^2$, canopy height $cm$, wave attenuation decay curves) are prioritized with high-contrast typography and monospace biometrics.
3. **Edge-First & Resilient**: The UI clearly communicates offline status, local SQLite sync queues, and GPS lock precision.
4. **Accessible by Default**: All touch targets meet or exceed $44 \times 44\text{px}$ (WCAG 2.5.5 Level AAA), focus rings are crisp with `:focus-visible`, and ARIA roles are standard.

---

## 2. Shared Design Tokens

The machine-readable source of truth is located in [`shared/design-tokens.json`](file:///c:/seagrass/shared/design-tokens.json).

### 2.1 Color Palette

| Token | Hex Value | Semantic Role | Web Variable | Mobile Token |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `#0D9488` (Teal-600) | Brand primary, action buttons, active tabs | `--primary` | `colors.primary` |
| **Primary Dark** | `#0F766E` (Teal-700) | Hover states, active pressed states | `--primary-hover` | `colors.primaryDark` |
| **Primary Light** | `#CCFBF1` (Teal-100) | Badges, subtle accents, reticle borders | `--primary-light` | `colors.primaryLight` |
| **Primary Subtle** | `#F0FDFA` (Teal-50) | Icon backgrounds, card highlights | `--primary-subtle` | `colors.primarySubtle` |
| **Accent / Hydro** | `#06B6D4` (Cyan-500) | Wave height, physics telemetry, charts | `--accent` | `colors.accent` |
| **Success / Benthic**| `#10B981` (Emerald-500)| YOLOv11 detections, synced records | `--success` | `colors.success` |
| **Warning / Canopy** | `#F59E0B` (Amber-500) | Moderate attenuation, pending sync | `--warning` | `colors.warning` |
| **Error / Alert** | `#EF4444` (Rose-500) | Critical wave energy, sync conflicts | `--error` | `colors.error` |
| **Background** | `#F8FAFC` (Slate-50) | App workspace canvas | `--background` | `colors.background` |
| **Surface** | `#FFFFFF` | Cards, modals, sheets | `--card` | `colors.surface` |
| **Text Primary** | `#0F172A` (Slate-900) | Headings, bold telemetry figures | `--foreground` | `colors.text` |
| **Text Secondary** | `#475569` (Slate-600) | Body copy, secondary labels | `--muted` | `colors.textSecondary` |
| **Text Tertiary** | `#94A3B8` (Slate-400) | Timestamps, metadata, hints | `--muted-foreground` | `colors.textTertiary` |
| **Border** | `#E2E8F0` (Slate-200) | Card boundaries, dividers | `--border` | `colors.border` |

---

## 3. Typography Hierarchy

Both platforms standardize on modern humanist sans-serif typefaces with high legibility at micro sizes.

- **Web**: Plus Jakarta Sans / Inter (`system-ui, -apple-system, sans-serif`)
- **Mobile**: `@expo-google-fonts/inter` (`Inter_400Regular`, `Inter_600SemiBold`, `Inter_700Bold`)

| Level | Size | Weight | Line Height | Mobile Size | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | $32 - 40\text{px}$ | $800$ (Heavy) | $1.2$ | $32\text{px}$ | Landing hero, major screen headers |
| **Section Header** | $20 - 24\text{px}$ | $700$ (Bold) | $1.3$ | $20\text{px}$ | Dashboard card titles, modal titles |
| **Body Large** | $16\text{px}$ | $500$ (Medium) | $1.5$ | $16\text{px}$ | Primary list item titles, descriptions |
| **Body Regular** | $14\text{px}$ | $400$ (Regular)| $1.5$ | $14\text{px}$ | Form inputs, survey descriptions |
| **Micro Caption** | $11 - 12\text{px}$ | $600$ (Semibold)| $1.4$ | $12\text{px}$ | Field hints, metadata, badges |
| **Mono Telemetry** | $12 - 20\text{px}$ | $700$ (Bold) | $1.0$ | $14 - 18\text{px}$ | Coordinates, wave heights ($1.62\text{m}$), confidence ($97.4\%$) |

---

## 4. Component Standards

### 4.1 Buttons (`Button.tsx`)
- **Primary**: Teal solid background (`#0D9488`), white text, subtle hover lift and active scale down ($0.98$).
- **Secondary**: Slate-100 / white border with Slate-800 text.
- **Outline**: White background with $1.5\text{px}$ teal border and teal text.
- **Touch Target**: Minimum height $44\text{px}$ on web, $48\text{px}$ on mobile.

### 4.2 Cards (`Card.tsx`)
- Crisp $1\text{px}$ border in `#E2E8F0`, rounded corners ($16 - 24\text{px}$).
- Subtle shadow (`shadow-xs` / `shadow.sm`) with white background.
- Clean header area with title, subtitle, and optional right-aligned status badge.

### 4.3 Status Badges (`Badge.tsx`)
- `primary` (Teal), `success` (Emerald), `warning` (Amber), `error` (Rose), `neutral` (Slate).
- Optional pulsing live dot indicator (`dot` & `pulse` props) for real-time AI states.

### 4.4 Feedback & Notifications (`Toast.tsx`)
- Native slide-in toast notifications anchored to the bottom-right on desktop / bottom on mobile.
- `role="status"` and `aria-live="polite"` for full screen-reader compliance.
- No disruptive browser `alert()` popups.

---

## 5. Scientific Visualizations & Charts

### 5.1 Hydrodynamic Wave Decay Curves
- **Wave Height Curve**: Teal AreaChart (`#0D9488`) with gradient fill fading to transparent.
- **Unvegetated Bare Seabed Baseline**: Dashed Slate-400 line (`#94A3B8`) illustrating unprotected wave heights.
- **Axes**: Transect distance in meters ($0\text{m} \to 50\text{m}$) on X-axis; Wave height in meters ($0.0\text{m} \to 2.0\text{m}$) on Y-axis.
- **Tooltips**: Dark slate backdrop (`#0F172A`) with high-contrast colored callouts.

### 5.2 Species & Canopy Metrics
- Dual-toggle view:
  1. **Confidence Distribution**: Vertical bar chart highlighting detection certainty.
  2. **Canopy Coverage Breakdown**: Donut pie chart highlighting meadow composition.

---

## 6. Mobile Field Usability Guidelines

1. **Quadrat Alignment Reticle**: High-contrast $3 \times 3$ grid overlay mimicking standard $50 \times 50\text{cm}$ benthic quadrats with reticle corner marks.
2. **Center Floating Action Button (FAB)**: Primary camera access accessible via single tap from any tab.
3. **Pull-to-Refresh**: Native `RefreshControl` refreshing SQLite stats and cloud sync queues without page reloads.
4. **Haptic & Visual Feedback**: Every tap produces clear visual state changes (`active:scale-95` on web, `pressed && transform: [{ scale: 0.98 }]` on mobile).
