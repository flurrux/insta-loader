(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.453dfe16.js")
    );
  })().catch(console.error);

})();
