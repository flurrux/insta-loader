chrome.runtime.onMessage.addListener((function(i,n,t){"show-notification"===i.type&&chrome.notifications.create(null,{type:"basic",...i.notification})}));
//# sourceMappingURL=notifications-background.js.map
