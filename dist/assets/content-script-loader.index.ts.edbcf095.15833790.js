(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.edbcf095.js")
    );
  })().catch(console.error);

})();
