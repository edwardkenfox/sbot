(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
    if (request.greeting === 'checkitout') {
      sendResponse({
        farewell: 'willcheck'
      });
      console.log('I got the check out message and will send back');
      chrome.tabs.query({}, function(tabs) {
        var i, message;
        message = {
          greeting: 'clickcheck'
        };
        i = 0;
        while (i < tabs.length) {
          chrome.tabs.sendMessage(tabs[i].id, message);
          ++i;
        }
      });
    }
    return chrome.storage.local.get('checkoutSwitch', function(items) {
      if (items.checkoutSwitch === 1) {
        if (request.greeting === 'increasecount') {
          chrome.storage.local.get('itemArrayCurrent', function(items) {
            var newItemCount;
            newItemCount = items.itemArrayCurrent + 1;
            chrome.storage.local.set({
              'itemArrayCurrent': newItemCount
            });
            console.log('new item count is ' + newItemCount);
            return chrome.storage.local.get('itemArrayTotal', function(items) {
              console.log('total item count is ' + items.itemArrayTotal);
              if (newItemCount >= items.itemArrayTotal) {
                return chrome.tabs.query({}, function(tabs) {
                  var i, message;
                  message = {
                    greeting: 'startcheckout'
                  };
                  i = 0;
                  while (i < tabs.length) {
                    chrome.tabs.sendMessage(tabs[i].id, message);
                    ++i;
                  }
                });
              }
            });
          });
        }
      }
    });
  });

}).call(this);
