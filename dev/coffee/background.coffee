chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  console.log if sender.tab then 'from a content script:' + sender.tab.url else 'from the extension'
  if request.greeting == 'checkitout'
    sendResponse farewell: 'willcheck'
    console.log 'I got the check out message and will send back'
    chrome.tabs.query {}, (tabs) ->
      message = greeting: 'clickcheck'
      i = 0
      while i < tabs.length
        chrome.tabs.sendMessage tabs[i].id, message
        ++i
      return
  if request.greeting == 'increasecount'
    chrome.storage.local.get 'itemArrayCurrent', (items) ->
      newItemCount = items.itemArrayCurrent + 1
      chrome.storage.local.set 'itemArrayCurrent': newItemCount
      console.log 'new item count is ' + newItemCount
      chrome.storage.local.get 'itemArrayTotal', (items) ->
        console.log 'total item count is ' + items.itemArrayTotal
        if newItemCount == items.itemArrayTotal
          chrome.tabs.query {}, (tabs) ->
            message = greeting: 'startcheckout'
            i = 0
            while i < tabs.length
              chrome.tabs.sendMessage tabs[i].id, message
              ++i
            return
  return
