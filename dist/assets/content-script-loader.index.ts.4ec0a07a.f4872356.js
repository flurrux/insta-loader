(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.4ec0a07a.js")
    );
  })().catch(console.error);

})();
