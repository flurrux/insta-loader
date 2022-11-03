(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.5b9a8afd.js")
    );
  })().catch(console.error);

})();
