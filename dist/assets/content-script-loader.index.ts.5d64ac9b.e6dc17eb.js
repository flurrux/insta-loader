(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.5d64ac9b.js")
    );
  })().catch(console.error);

})();
