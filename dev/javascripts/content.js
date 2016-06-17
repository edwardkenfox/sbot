// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';
var allLink = 'http://www.supremenewyork.com/shop/all';
var newLink = 'http://www.supremenewyork.com/shop/new';

//On Loop
$(function() {
  if (window.location.href === newLink) {
    var imgProdNow = $('.inner-article a:nth-of-type(1)').attr("href");
    console.log("the value upon reload is " + imgProdNow)
    checkStatus().then(function (status) {
      if (status === 1) {
        autoRefresh(imgProdNow);
      }
    });
  }
});

//Fill Forms
fillforms();

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

$(function() {
  if ((window.location.href.indexOf("supremenewyork") != -1) && (window.location.href !== newLink) &&  (window.location.href !== checkoutLink) && (window.location.href !== cartLink) && (window.location.href !== allLink) && (window.location.href !== 'http://www.supremenewyork.com/shop')) {
    addToCart();
  }
});

//On URL Change
var oldLocation = window.location.href;
setInterval(function() {
  if(window.location.href !== oldLocation) {
    console.log("URL changed to "+ window.location.href);
    oldLocation = window.location.href
    addToCart();
  }
}, 500); // check every second

//On Snipe
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "snipeitnow") {
    if (window.location.href !== newLink) {
      window.location.href = newLink;
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

function selectSize() {
  console.log("Executing selectSize()")
  return new Promise(function (resolve) {
    var href = window.location.href;

    if (href.indexOf("jackets") > -1) {
      getSize("jackets").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (href.indexOf("shirts") > -1) {
      getSize("shirts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (href.indexOf("tops") > -1) {
      getSize("tops").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (href.indexOf("shoes") > -1) {
      getSize("shoes").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (href.indexOf("sweatshirts") > -1) {
      getSize("sweatshirts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (href.indexOf("shorts") > -1) {
      getSize("shorts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        if (sizeValue === undefined) {
          getSize("shortsalt").then(function (result) {
            sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
            resolve(sizeValue);
          });
        } else {
          resolve(sizeValue);
        }
      });
    } else if (href.indexOf("pants") > -1) {
      getSize("pants").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        if (sizeValue === undefined) {
          getSize("pantsalt").then(function (result) {
            sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
            resolve(sizeValue);
          });
        } else {
          resolve(sizeValue);
        }
      });
    } else if (href.indexOf("t-shirts") > -1) {
      getSize("tshirts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
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

function addToCart() {
  var checkSize = setInterval(function () {
    if (document.querySelector("#size option")) { // If product isn't already in cart and size dropdown exists
      console.log("Dropdown exist");
      clearInterval(checkSize);
      selectSize().then(function (sizeValue) {
        console.log("size has been resolved to the value of " + sizeValue)
        if (sizeValue !== undefined) {
          $("#size").val(sizeValue);
          var checkCart = setInterval(function () {
            var doc = window.document;
            if ((doc.getElementById("size").value === sizeValue) && (doc.getElementById("cart-addf"))) {
              console.log("The size is correctly selected.");
              addSizeOne();
              chrome.runtime.sendMessage({
                greeting: "increasecount"
              });
              console.log("Increase item count and successfully added.");
              clearInterval(checkCart);
            }
          }, 10);
        }
      });
    } else if ($("#size").attr('type') === 'hidden') {
      clearInterval(checkSize);
      chrome.runtime.sendMessage({
        greeting: "increasecount"
      });
      console.log("Increase item count and one size item successfully added.");
      checkStatus();
      addOneSize();
    } else {
      clearInterval(checkSize);
      chrome.runtime.sendMessage({
        greeting: "increasecount"
      });
      console.log("Increase item count and item not added.");
    }
  }, 10);
}

function addSize() {
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: document.getElementById("cart-addf").getAttribute("action"),
      type: 'POST',
      data: "size=" + sizeValue,
    });
  });
}

function addSizeOne() {
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: document.getElementById("cart-addf").getAttribute("action"),
      type: 'POST',
      data: "size=" + sizeValue,
      success: function () {
        checkout();
      }
    });
  });
}

// Function to add size to cart
function addOneSize() {
  var doc = window.document;
  onesize = doc.getElementById("size").value;

  getLink().then(function (allURL) { // Get all registered URLs
    // var allURL = items.allURL;
    var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
    // Get current URL position
    var posNow = allURL.nowUrl;
    // Get the URL to snipe at this time
    var dataObj = ("putURL" + posNow).toString();
    var gotoPage = allURL[dataObj];
    $.ajax({
      url: doc.getElementById("cart-addf").getAttribute("action"),
      type: 'POST',
      data: "size=" + onesize,
      success: function () {
        goNext();
      }
    });
  });
}

// Function to get size
function getSize(itemSize) {
  return new Promise(function (resolve) {
    chrome.storage.local.get('sizePref', function (items) { // Get size preferences from storage
      resolve(items.sizePref[itemSize]);
    });
  });
};

// Fucntion to get link from storage
function getLink() {
  return new Promise(function (resolve) {
    chrome.storage.local.get('allURL', function (items) { // Get size preferences from storage
      resolve(items.allURL);
    });
  });
};

// Function to go to checkout page
function checkout() {
  turnOff();
  checkCheckout().then(function (status) {
    if (status === 1) {
      // Get auto checkout status and process payment if on
      chrome.runtime.sendMessage({
        greeting: "checkitout"
      });
    }
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

// Function to fill forms if on checkout page
function fillforms() {
  var doc = window.document;

  if (window.location.href === checkoutLink) {
    var checkForm = setInterval(function () {
      if (doc.getElementById("number_v")) {
        clearInterval(checkForm);
        var nowZone = doc.getElementById("time-zone-name").innerHTML;
        if (nowZone === "TYO") {
          chrome.storage.local.get('tyoPref', function (items) {
            var tyoPref = items.tyoPref;
            for (var key in tyoPref) {
              $("#" + key).val(tyoPref[key]);
            }
            if (tyoPref.credit_card_type === "cod") {
              doc.getElementById("card_details").style.display = "none";
            }
          });
        } else if (nowZone === "NYC") {
          console.log("This is the NYC checkout page.");
          chrome.storage.local.get('nycPref', function (items) {
            var nycPref = items.nycPref;
            for (var key in nycPref) {
              $("#" + key).val(nycPref[key]);
            }
          });
        } else {
          console.log("Don't know which checkout page this is. Time zone text doesn't exist.");
        }
        //Check terms checkbox
        doc.getElementById("order_terms").checked = true;
        console.log("filledform");
        chrome.storage.local.get('checkoutSwitch', function(items) {
          console.log("this checkoutswich is " + items.checkoutSwitch)
          if (items.checkoutSwitch == 1) {
            $("input[name = 'commit']").click();
          }
        });
      }
    }, 10);
  }
}
