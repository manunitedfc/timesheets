import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { COLOR_SCHEME_STORAGE_KEY } from '@/lib/theme/color-scheme';

const initialSplashStyles = `
:root {
  background: #f1f5f9;
  color-scheme: light;
}

html,
body,
#root {
  min-height: 100%;
  background: #f1f5f9;
}

@media (prefers-color-scheme: dark) {
  :root {
    background: #020617;
    color-scheme: dark;
  }

  html,
  body,
  #root {
    background: #020617;
  }
}

html.dark,
html.dark body,
html.dark #root {
  background: #020617;
}

html.light,
html.light body,
html.light #root {
  background: #f1f5f9;
}

#initial-web-splash {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

html.dark #initial-web-splash {
  background: #020617;
}

#initial-web-splash img {
  display: block;
  width: min(280px, 55vw);
  height: auto;
  filter: brightness(0);
}

html.dark #initial-web-splash img {
  filter: brightness(0) invert(1);
}
`;

const initialColorSchemeScript = `
(function () {
  try {
    var key = ${JSON.stringify(COLOR_SCHEME_STORAGE_KEY)};
    var stored = window.localStorage.getItem(key);
    var scheme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.toggle('dark', scheme === 'dark');
    root.classList.toggle('light', scheme === 'light');
    root.style.colorScheme = scheme;
    root.style.backgroundColor = scheme === 'dark' ? '#020617' : '#f1f5f9';
    if (document.body) {
      document.body.style.backgroundColor = scheme === 'dark' ? '#020617' : '#f1f5f9';
    }
  } catch (error) {}
})();
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: initialSplashStyles }} />
        <ScrollViewStyleReset />
        <script dangerouslySetInnerHTML={{ __html: initialColorSchemeScript }} />
      </head>
      <body>
        <div id="initial-web-splash" aria-hidden="true">
          <img src="/company-logo.png" alt="" />
        </div>
        {children}
      </body>
    </html>
  );
}
