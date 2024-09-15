(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.f82b55a9.js")
    );
  })().catch(console.error);

})();
