(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.c04ec329.js")
    );
  })().catch(console.error);

})();
