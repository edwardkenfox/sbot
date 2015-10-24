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
  return
