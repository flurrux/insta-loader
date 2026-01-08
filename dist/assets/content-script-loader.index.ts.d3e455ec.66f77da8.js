(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.d3e455ec.js")
    );
  })().catch(console.error);

})();
