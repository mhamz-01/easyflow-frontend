# Project Style Guide & Global Standards

# This document provides a high-level overview of the global design tokens, typography rules, color system, and folder conventions used throughout this project. It ensures that every developer follows the same coding standards and maintains consistency across the codebase.

# Purpose of This Document

By reading this file, developers should clearly understand:

What global variables are defined for typography and colors

How the global design system is structured

Which naming conventions and patterns should be followed

How to keep their implementation aligned with the established project standards

No developer should deviate from the standards defined here.

# Typography

All typography-related design tokens are defined in app/global.css.
Custom CSS variables are used to enforce consistent font sizes across the application.

Font Sizes
Token Size
--title 24px
--h1 18px
--body 16px

These are exposed through Tailwind using the following theme variables:

@theme inline {
--text-title: var(--title);
--text-h1: var(--h1);
--text-body: var(--body);
}

Use these variables whenever applying typography styles.

# Colors

The project uses a predefined color palette stored in :root within global.css.
Each color has a Tailwind-ready variable assigned to it.

Tailwind Color Tokens
--color-primary-blue: var(--primary-blue);
--color-primary-yellow: var(--primary-yellow);
--color-primary-green: var(--primary-green);
--color-primary-pink: var(--primary-pink);

--color-gray-100: var(--gray-100);
--color-gray-200: var(--gray-200);

--border-black: var(--border-black);

# Root Color Definitions

:root {
--primary-blue: #0D8EFF;
--primary-yellow: #FFC53D;
--primary-green: #51FF00;
--primary-pink: #FF00C8;

--gray-100: #6E6E6E;
--gray-200: #737373;

--border-black: #2E2E2E;
}

All colors used in components or pages must reference these tokens instead of hard-coded hex values.

# Development Guidelines

Always use predefined typography and color variables.

Avoid custom or inline styles unless absolutely required.

Follow the folder structure and naming patterns consistent with the rest of the project.

When adding new design tokens, update both :root and their Tailwind mappings.

# Summary

This documentation ensures that:

Design remains consistent throughout the application

Developers use shared global variables

Future contributors can easily understand and align with existing standards

If you add new typography, colors, or structural conventions, update this file to keep it current.
# EasyFlow-frontend
