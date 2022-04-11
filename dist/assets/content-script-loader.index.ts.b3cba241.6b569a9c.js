(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.b3cba241.js")
    );
  })().catch(console.error);

})();
