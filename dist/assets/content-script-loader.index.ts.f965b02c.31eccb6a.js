(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.f965b02c.js")
    );
  })().catch(console.error);

})();
