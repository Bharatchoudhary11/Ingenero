## Electrolyzer Disassembly Workspace

Interactive front-end workspace for managing electrolyzer disassembly and part routing built with **Next.js 14**, **React**, **TypeScript**, and **Tailwind CSS**.

### Highlights

- Searchable list of electrolyzer IDs with keyboard focus shortcut.
- Element part grid supporting multi-select, per-electrolyzer persistence, and bulk actions (repair vs ready-to-assemble) with confirmation modals.
- Checklist selection, cut-out comments, and per-element notes captured across units.

### Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to use the tool.

### Testing / Linting

```bash
npm run lint
npm run build
```

*(Linting requires `eslint-config-next`. If missing, install with `npm i -D eslint-config-next`.)*
