(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.dd15a1d3.js")
    );
  })().catch(console.error);

})();
