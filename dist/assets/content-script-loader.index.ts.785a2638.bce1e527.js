(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.785a2638.js")
    );
  })().catch(console.error);

})();
