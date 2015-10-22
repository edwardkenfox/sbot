# Listen for the go-ahead and go to first page to start sniping
chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  if request.greeting == 'snipeitnow'
    chrome.storage.local.get 'allURL', (items) ->
      allURL = items.allURL
      # Load the first URL
      firstPage = allURL.putURL1
      if window.location.href != 'https://www.supremenewyork.com/checkout'
        window.location.href = firstPage
      else
        win = window.open(firstPage, '_blank')
        if win
          #Browser has allowed it to be opened
          win.focus()
        else
          #Broswer has blocked it
          alert 'Please allow popups for this site'
      console.log 'The first URL is ' + firstPage
      return
  return
fillforms()

# Remove unavailable items from cart
chrome.storage.local.get 'statusStore', (items) ->
  statusStore = items.statusStore
  if statusStore.enableStatus == 1
    # Check if enabled is on
    # nostock();
    chrome.storage.local.get 'allURL', (items) ->
      # Get all registered URLs
      allURL = items.allURL
      totalPos = Object.keys(allURL).length - 1
      # Get total number of URLs minus the data for position and minus 1 for URL position
      # Get current URL position
      posNow = allURL.nowUrl
      # Get the URL to snipe at this time
      dataObj = ('putURL' + posNow).toString()
      gotoPage = allURL[dataObj]
      # If current URL isn't saved URL, go to it. If not, add the item to cart.
      if window.location == gotoPage
        # Add to cart function
        checkSize = setInterval((->
          if $('#size option').length
            # If product isn't already in cart and size dropdown exists
            console.log 'Dropdown exist'
            clearInterval checkSize
            chrome.storage.local.get 'sizePref', (items) ->
              # Get size preferences from storage
              sizePref = items.sizePref.tops
              # Set size to a var
              sizeVal = $('#size option').filter(->
                $(this).html() == sizePref
              ).val()
              sizeVal2 = $('#size option').filter(->
                $(this).html() == 'L'
              ).val()
              if sizeVal != undefined
                $('#size').val sizeVal
                checkCart = setInterval((->
                  if $('#size').val() == sizeVal and $('#cart-addf').length != 0
                    console.log 'The size is correctly selected.'
                    $.ajax
                      url: $('#cart-addf').attr('action')
                      type: 'POST'
                      data: 'size=' + sizeVal
                      success: ->
                        console.log 'The form has been submitted successfully.'
                        # Check if there is a next URL to be sniped.
                        if posNow < totalPos
                          # Increase the URL position by 1
                          nextPos = posNow + 1
                          allURL.nowUrl = nextPos
                          chrome.storage.local.set { allURL: allURL }, ->
                            # Go to the next URL
                            nextObj = ('putURL' + nextPos).toString()
                            nextPage = allURL[nextObj]
                            window.location.href = nextPage
                            return
                        else
                          checkout()
                          # Check out if item as been added to cart.
                          console.log 'Run checkout function'
                        return
                    clearInterval checkCart
                  return
                ), 10)
              return
          else
            console.log 'Dropdown doesnt exist'
            onesize = $('#size').val()
            $.ajax
              url: $('#cart-addf').attr('action')
              type: 'POST'
              data: 'size=' + onesize
              success: ->
                console.log 'The form has been submitted successfully.'
                # Check if there is a next URL to be sniped.
                if posNow < totalPos
                  # Increase the URL position by 1
                  nextPos = posNow + 1
                  allURL.nowUrl = nextPos
                  chrome.storage.local.set { allURL: allURL }, ->
                    # Go to the next URL
                    nextObj = ('putURL' + nextPos).toString()
                    nextPage = allURL[nextObj]
                    window.location.href = nextPage
                    return
                else
                  checkout()
                  # Check out if item as been added to cart.
                  console.log 'Run checkout function'
                return
          return
        ), 10)
      else if gotoPage == undefined
        # If URL is not defined
        console.log 'URL is undefined! Go to next.'
        # Check if there is a next URL to be sniped.
        if posNow < totalPos
          # Increase the URL position by 1
          nextPos = posNow + 1
          allURL.nowUrl = nextPos
          chrome.storage.local.set { allURL: allURL }, ->
            `var nextPos`
            # Go to the next URL
            nextObj = ('putURL' + nextPos).toString()
            nextPage = allURL[nextObj]
            window.location.href = nextPage
            return
      else
        if $('time b:contains("11:00am")').length > 0 and window.location != gotoPage
          console.log 'URL doesn\'t exist, so skip item.'
          # Check if there is a next URL to be sniped.
          if posNow < totalPos
            # Increase the URL position by 1
            nextPos = posNow + 1
            allURL.nowUrl = nextPos
            chrome.storage.local.set { allURL: allURL }, ->
              # Go to the next URL
              nextObj = ('putURL' + nextPos).toString()
              nextPage = allURL[nextObj]
              window.location.href = nextPage
              return
        else if window.location.href != 'https://www.supremenewyork.com/checkout'
          window.location.href = gotoPage
        else
          #open new tab and go to page
          # chrome.tabs.create({ url: gotoPage });
          win = window.open(firstPage, '_blank')
          if win
            #Browser has allowed it to be opened
            win.focus()
          else
            #Broswer has blocked it
            alert 'Please allow popups for this site'
      return
  return

  # Function to go to checkout page

checkout = ->
  #  window.location.href = 'https://www.supremenewyork.com/checkout';
  # Set enabled to off
  console.log 'Set enabled to off'
  statusStore = {}
  statusStore.enableStatus = 0
  chrome.storage.local.set statusStore: statusStore
  # Get auto checkout status and process payment if on
  chrome.storage.local.get 'statusStore2', (items) ->
    `var statusStore2`
    statusStore2 = items.statusStore2
    if statusStore2.autoCheckout == 1
      statusStore2 = {}
      statusStore2.autoCheckout = 0
      chrome.storage.local.set statusStore2: statusStore2
      chrome.runtime.sendMessage { greeting: 'checkitout' }, (response) ->
        console.log 'Sent a message to check out.'
        return
    else
      console.log 'Auto check out is disabled.'
    return
  return

# Function to remove items in cart that are sold out and go to checkout page

nostock = ->
  if window.location.href == 'http://www.supremenewyork.com/shop/cart'
    # Check if any unavailable item exists
    if $('.out_of_stock').length != 0
      $('.out_of_stock .cart-remove .intform .remove').click()
    else
      checkout()
  return

fillforms()

# Function to fill forms if on checkout page

fillforms = ->
  if window.location.href == 'https://www.supremenewyork.com/checkout'
    chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
      if request.greeting == 'clickcheck'
        $('input[name = \'commit\']').click()
        console.log 'Got a message to check out.'
      return
    checkForm = setInterval((->
      if $('#number_v').length != 0
        clearInterval checkForm
        nowZone = $('#time-zone-name').text()
        if nowZone == 'TYO'
          chrome.storage.local.get 'tyoPref', (items) ->
            tyoPref = items.tyoPref
            for key of tyoPref
              $('#' + key).val tyoPref[key]
            if tyoPref.credit_card_type == 'cod'
              $('#card_details').css 'display', 'none'
            return
        else if nowZone == 'NYC'
          console.log 'This is the NYC checkout page.'
          chrome.storage.local.get 'nycPref', (items) ->
            nycPref = items.nycPref
            for key of nycPref
              $('#' + key).val nycPref[key]
            return
        else
          console.log 'Don\'t know which checkout page this is. Time zone text doesn\'t exist.'
        #Check terms checkbox
        $('#order_terms').prop 'checked', true
        $('.icheckbox_minimal').addClass 'checked'
      return
    ), 10)
  return

fillforms()

