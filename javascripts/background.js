chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "checkitout") {
            sendResponse({
                farewell: "willcheck"
            });
            console.log("I got the check out message and will send back");
            chrome.tabs.query({}, function(tabs) {
                var message = {
                    greeting: "clickcheck"
                };
                for (var i = 0; i < tabs.length; ++i) {
                    chrome.tabs.sendMessage(tabs[i].id, message);
                }
            });
        }
    });
