# Terminal Portfolio

A cyberpunk terminal style portfolio built with React, Vite, and Tailwind CSS. It behaves like a real CLI with commands, theme switching, typewriter output, and a responsive layout.

## Features
- Terminal UI with commands, history, and autocomplete (Tab cycles matches).
- Theme system with dynamic favicon colors.
- Typewriter output with auto scroll and link detection.
- Responsive layout; 3D model is hidden on small screens.
- Resume download served from the public folder.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Zustand (state)
- Framer Motion (animation)
- Three.js / react-three-fiber (3D viewer)

## Commands
- `help` - Show available commands
- `about` - Learn about me
- `projects` - View featured projects
- `skills` - See technical skills
- `experience` - Work experience
- `education` - Education and certifications
- `achievements` - Key accomplishments
- `contact` - Contact information
- `resume` - Resume link
- `download` - Resume link
- `social` - Social links
- `history` - Show command history
- `history persist on|off` - Toggle history persistence
- `theme` - Change terminal theme
- `themes` - List available themes
- `clear` - Clear the terminal

## Getting Started
```bash
npm install
npm run dev
```

Build and preview:
```bash
npm run build
npm run preview
```

Tests:
```bash
npm run test
```

## Configuration
Environment variables (optional):
- `VITE_MODEL_URL` - URL to a GLTF/GLB model for the 3D viewer.
- `VITE_MODEL_PREVIEW` - Optional preview image for the model.
- `VITE_BASE` - Base path for deployment (e.g., `/your-repo/` for GitHub Pages).

## Content Editing
- Update copy in `src/data/*.json`.
- Adjust themes in `src/lib/themes.ts`.
- Replace the resume at `public/resume.pdf`.
- Favicon SVG lives at `public/favicon.svg` and is updated dynamically when the theme changes.

## Deploy (GitHub Pages)
Set a base path so asset links and resume download work under a repo path:
```bash
VITE_BASE=/your-repo/ npm run build
```
Then deploy the `dist` folder. The resume link uses the base path automatically.

## Analytics (Optional)
If you add Plausible, Umami, or Google Analytics scripts, terminal commands will emit a `terminal_command` event with `{ command, result }`.
