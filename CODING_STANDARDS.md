# Coding Standards

## General
- TypeScript strict mode
- No any type
- Named exports preferred
- Default export only for pages

## React
- Functional components only
- One component per file
- Custom hooks under src/hooks
- Reusable UI under src/components/ui

## Naming
- PascalCase for components
- camelCase for functions
- kebab-case for folders when appropriate

## Imports
- Use @ alias
- Group imports

## Styling
- Tailwind CSS v4
- RTL first
- Mobile first
- No inline styles

## Services
- One responsibility per service
- No Firebase calls inside components

## Error Handling
- Try/catch
- Typed errors