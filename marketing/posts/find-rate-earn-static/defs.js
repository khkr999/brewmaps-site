// shared SVG pieces: pin, cup, star. Injected into each story's <svg><defs>.
const DEFS = `
<g id="pin"><path d="M0 0 C-10 -18 -34 -40 -34 -64 A34 34 0 1 1 34 -64 C34 -40 10 -18 0 0Z"/></g>
<g id="cup"><path d="M-22 -14 H22 C21 12 11 18 0 18 C-11 18 -21 12 -22 -14Z"/><path d="M22 -9 a9 9 0 0 1 0 17" fill="none"/></g>
<path id="star" d="M0 -50 L14.7 -20.2 47.6 -15.5 23.8 7.7 29.4 40.5 0 25 -29.4 40.5 -23.8 7.7 -47.6 -15.5 -14.7 -20.2Z"/>
<g id="bean"><ellipse rx="16" ry="23"/><path d="M0 -20 C-7 -8 7 8 0 20" fill="none" stroke="#2a180f" stroke-width="3.5" stroke-linecap="round" opacity=".55"/></g>`;
document.querySelectorAll('svg defs').forEach(d => d.insertAdjacentHTML('beforeend', DEFS));
