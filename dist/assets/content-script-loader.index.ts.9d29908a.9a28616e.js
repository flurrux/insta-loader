(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.9d29908a.js")
    );
  })().catch(console.error);

})();
