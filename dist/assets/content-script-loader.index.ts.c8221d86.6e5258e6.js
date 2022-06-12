(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.c8221d86.js")
    );
  })().catch(console.error);

})();
