# UI Design Principles: "Soft & Puffy" Claymorphism

This document outlines the core design principles for the ComicCo application's user interface, based on the "Soft & Puffy" Claymorphism style.

## Core Principles

-   **Style:** "Soft & Puffy" Claymorphism. The UI should feel tactile, friendly, and look like soft, pressable clay.
-   **Goal:** To create a playful, inviting, and easy-to-use interface for neurodivergent children.

## Visual Style Breakdown

-   **Color Palette:** A soft, pastel color palette is essential. The primary colors are inspired by the reference image:
    -   **Main Container:** Light, soft blue (`--container-blue: #E0E8F6;`)
    -   **Buttons:** A variety of gentle pastels like purple (`--squish-me-purple: #C8B6FF;`), light green (`--soft-green: #D9F7E6;`), yellow (`--puffy-yellow: #FDFD96;`), and pink (`--playful-pink: #FFDFD3;`).
    -   **Background:** The overall page background should be a very light, subtle gradient to add depth.

-   **Shapes:**
    -   All interactive elements, containers, and content blocks must have a large border radius (e.g., 16-24px).
    -   Avoid all sharp corners and hard edges to maintain the soft, friendly aesthetic.

-   **Shadows (The "Puffy" Effect):**
    -   The signature "puffy" look is achieved with a specific combination of outer and inner shadows.
    -   **Outer Shadow:** A soft, diffused drop shadow to gently lift elements off the background.
    -   **Inner Shadow:** A subtle, light inner shadow on the top/left edges to create a rounded, three-dimensional, and pressable appearance.
    -   This is implemented in the `.puffy-shadow` utility class.

-   **Typography:**
    -   **Font:** Use a clean, rounded, sans-serif font that is highly legible and child-friendly.
    -   **Color:** Text color should be a darker, muted shade that complements the pastel backgrounds without creating harsh contrast (e.g., `--foreground-rgb: 50, 60, 80;`).

## Interactivity

-   **Animations:** Interactions should be playful and responsive.
-   **Button Presses:** Buttons should have a "squishy" effect on click, achieved by slightly scaling them down (`active:scale-95`).
-   **Feedback:** Use gentle visual cues (like stars, avatar animations) and soft auditory sounds for encouragement.