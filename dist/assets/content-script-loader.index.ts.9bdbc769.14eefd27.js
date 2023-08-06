(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/index.ts.9bdbc769.js")
    );
  })().catch(console.error);

})();
