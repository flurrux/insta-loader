(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.6dcb711a.js")
    );
  })().catch(console.error);

})();
