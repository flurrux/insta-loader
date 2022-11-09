(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.b4e6ceb4.js")
    );
  })().catch(console.error);

})();
