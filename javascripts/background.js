(function() {
  console.log("hi");

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
  });

}).call(this);
