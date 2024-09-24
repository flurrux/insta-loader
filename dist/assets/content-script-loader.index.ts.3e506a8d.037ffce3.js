(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.3e506a8d.js")
    );
  })().catch(console.error);

})();
