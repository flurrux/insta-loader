(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.2a4386ca.js")
    );
  })().catch(console.error);

})();
