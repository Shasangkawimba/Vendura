---
name: Vendura
description: Vendor Contract & Compliance Management System
---

<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Vendura

## 1. Overview

**Creative North Star: "The Digital Ledger"**

Vendura is a restrained, highly functional application designed for rapid decision-making by managers, finance, and directors. It draws inspiration from tools like Linear and Notion to provide a clean, technical, and trustworthy environment. Unnecessary decoration is discarded in favor of clear data hierarchy and instantaneous feedback. We explicitly reject cluttered, over-stimulating interfaces (like the Bloomberg Terminal) and overly playful consumer aesthetics (like typical fintech apps).

**Key Characteristics:**
- Restrained color palette focused on legibility and unambiguous status indication.
- Technical, single-sans typography for maximum scannability.
- Flat-by-default surfaces with minimal decorative shadowing.
- Motion is strictly functional (instant state changes over long animations).

## 2. Colors

**The Restrained Rule.** Tinted neutrals form the background, with one primary accent color carrying ≤10% of the surface.

### Primary
- **[Deep Slate / Indigo Anchor]** ([to be resolved during implementation]): Used for primary actions, focus rings, and key data highlights.

### Neutral
- **[Background]** ([to be resolved during implementation]): The main app surface in dark or light mode.
- **[Surface]** ([to be resolved during implementation]): Slightly offset from the background to define cards and regions.
- **[Ink]** ([to be resolved during implementation]): High contrast text against backgrounds.

### Status (Mandatory)
- **[Status Colors]** ([to be resolved during implementation]): Distinct, high-contrast colors mapped unequivocally to DRAFT, WAITING, ACTIVE, REJECTED, and EXPIRED. No ambiguous shades.

## 3. Typography

**Display Font:** [font pairing to be chosen at implementation] (Single sans)
**Body Font:** [font pairing to be chosen at implementation] (Single sans)

**Character:** Clean, technical, and highly scannable, prioritizing dense data readability over expressive flair.

### Hierarchy
- **Display** ([weight], [size], [line-height]): Dashboard metric heroes.
- **Headline** ([weight], [size], [line-height]): Page titles.
- **Title** ([weight], [size], [line-height]): Section or card titles.
- **Body** ([weight], [size], [line-height]): Standard text and table rows. Minimum 14px enforced.
- **Label** ([weight], [size], [letter-spacing]): Metadata and table headers.

## 4. Elevation

The interface is flat by default. Depth is established through subtle 1px borders, background tonal shifts, and very restrained ambient shadows (used strictly for transient elements like dropdowns, tooltips, or modals).

## 5. Components

*(Components will be documented here once the UI library is built during implementation.)*

## 6. Do's and Don'ts

### Do:
- **Do** ensure extremely high contrast for all contract status badges.
- **Do** use a minimum body font size of 14px to guarantee readability.
- **Do** design flawlessly for both Dark and Light modes.
- **Do** rely on simple, instantaneous state changes instead of long transition choreography.

### Don't:
- **Don't** use flashy consumer app aesthetics (e.g. Jenius, Livin).
- **Don't** use heavy Glassmorphism or Neumorphism; they obscure legibility.
- **Don't** use playful 3D or cartoon illustrations.
- **Don't** create cluttered, eye-straining dashboards (like Bloomberg Terminal).
- **Don't** use bright, saturated gradients for backgrounds or text.
