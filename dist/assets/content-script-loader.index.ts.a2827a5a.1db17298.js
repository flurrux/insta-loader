(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.a2827a5a.js")
    );
  })().catch(console.error);

})();
