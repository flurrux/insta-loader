(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.b989accb.js")
    );
  })().catch(console.error);

})();
