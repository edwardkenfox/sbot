// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';
var allLink = 'http://www.supremenewyork.com/shop/all';
var newLink = 'http://www.supremenewyork.com/shop/new';
var productPattern = new RegExp("http://www.supremenewyork.com/shop/([a-z'-]+)/([a-z0-9]+)/([a-z-0-9]+)")

//On Loop
$(function() {
  if (window.location.href === newLink) {
    chrome.storage.local.get('currentFirstItem', function (result) {
      if (result.currentFirstItem === 0) {
        var imgProd = $('.inner-article a:nth-of-type(1)').attr("href");
        chrome.storage.local.set({
          currentFirstItem: imgProd
        });
        var imgProdNow = $('.inner-article a:nth-of-type(1)').attr("href");
        autoRefresh(imgProdNow);
      } else {
        var imgProdNow = $('.inner-article a:nth-of-type(1)').attr("href");
        console.log("the value upon reload is " + imgProdNow)
        checkStatus().then(function (status) {
          if (status === 1) {
            autoRefresh(imgProdNow);
            console.log("Page loaded. New Link. Status 1. Auto Refresh.")
          }
        });
      };
    });
  }
});

if (window.location.href === newLink) {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting === "startcheckout") {
      var openCheckout = setInterval(function () {
        window.open(checkoutLink, '_blank')
        clearInterval(openCheckout);
      }, 300 );
      console.log("Got message to open checkout page")
    }
  });
}

//On Snipe
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "snipeitnow") {
    if (window.location.href !== newLink) {
      window.location.href = newLink;
      chrome.storage.local.set({
        currentFirstItem: 0
      });
    } else {
      // Store first image url and detect change
      var imgProd = $('.inner-article a:nth-of-type(1)').attr("href");
      chrome.storage.local.set({
        currentFirstItem: imgProd
      });
      autoRefresh(imgProd);
    }
  }
});

function autoRefresh(inputVal) {
  // Check the first item and store in storage
  console.log("the current page first link is " + inputVal);
  chrome.storage.local.get('currentFirstItem', function (result) {
    console.log(result.currentFirstItem);
    if (result.currentFirstItem === inputVal) {
      if (window.location.href === newLink) {
        location.reload();
      } else {
        window.location.href = newLink;
      }
    } else {
      turnOff();
      chrome.storage.local.get('manualSwitch', function(items) {
        if (items.manualSwitch == 0 && window.location.href === newLink) {
          chrome.storage.local.get('itemPos', function(items) {
            correctItemPos = items.itemPos;
            var allItemArray = correctItemPos.split(",");
            $.each(allItemArray,function(i){
              console.log("The correct item position is " + allItemArray[i]);
              correctItemPosLink = "http://www.supremenewyork.com" + $(".turbolink_scroller article:nth-of-type(" + allItemArray[i] + ") .inner-article a:nth-of-type(1)").attr("href");
              console.log("The correct item link is " + correctItemPosLink);
              window.open(correctItemPosLink, '_blank')
            });
          });
        }
      });
    }
  });
}

function checkStatus() {
  return new Promise(function (resolve) {
    chrome.storage.local.get('statusStore', function (items) {
      resolve(items.statusStore.enableStatus);
    });
  });
}

function checkCheckout() {
  return new Promise(function (resolve) {
    chrome.storage.local.get('checkoutSwitch', function (items) {
      resolve(items.checkoutSwitch);
      console.log("The auto checkout switch in chrome.storage is set to " + items.checkoutSwitch)
    });
  });
}

function checkManual() {
  return new Promise(function (resolve) {
    chrome.storage.local.get('manualSwitch', function (items) {
      resolve(items.manualSwitch);
      console.log("The manual switch in chrome.storage is set to " + items.manualSwitch)
    });
  });
}

// Function to turn the status to off
function turnOff() {
  // Set enabled to off
  console.log("Set enabled to off");
  var statusStore = {};
  statusStore.enableStatus = 0;
  chrome.storage.local.set({
    statusStore: statusStore
  });
}

// Function to remove items in cart that are sold out and go to checkout page
function nostock() {
  if (window.location.href === cartLink) {
    // Check if any unavailable item exists
    if (document.getElementsByClassName("out_of_stock")) {
      $(".out_of_stock .cart-remove .intform .remove").click();
    } else {
      checkout();
    }
  }
}

