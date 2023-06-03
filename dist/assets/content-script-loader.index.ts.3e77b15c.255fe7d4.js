(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.3e77b15c.js")
    );
  })().catch(console.error);

})();
