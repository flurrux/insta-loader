(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.8d5ddaa6.js")
    );
  })().catch(console.error);

})();
