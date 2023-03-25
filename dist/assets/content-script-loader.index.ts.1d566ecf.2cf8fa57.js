(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.1d566ecf.js")
    );
  })().catch(console.error);

})();
