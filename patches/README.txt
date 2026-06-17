Patch hast-util-from-html-isomorphic and decode-named-character-reference
Vite doesn't support export conditions 'worker':
https://github.com/vitejs/vite/issues/7439#issuecomment-1372732658
hast-util-from-html-isomorphic and decode-named-character-reference have
a browser version that depends on DOM which vite uses in worker.
Solutions that didn't work:
- adding `worker` to `resolve.conditions` breaks vite-plugin-ssr
- using `alias` works in dev, but breaks in prod (as
  `require.resolve` is not available)
Hack for now: Just patch both packages to use Node version.

---

Patch react-transition-group to add an `exports` field so Node.js ESM can
resolve subpath imports like `react-transition-group/TransitionGroupContext`
(needed by @mui/material@9.1.1+).
https://github.com/mui/material-ui/issues/48644
