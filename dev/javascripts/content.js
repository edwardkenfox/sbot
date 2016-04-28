// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';
var allLink = 'http://www.supremenewyork.com/shop/all';

//Fill Forms
if (window.location.href == checkoutLink) {
  fillforms();
}
function manualControl() {
  checkManual().then(function (status) {
    if (status == 1) {
      console.log("manual switch is on so dont style")
      addToCart();
    } else {
      checkStatus().then(function (botStatus) {
        if (botStatus == 1) {
          doSnipe();
        }
      });
    }
  });
};

//On URL Change
var oldLocation = window.location.href;
setInterval(function() {
  if(window.location.href != oldLocation) {
    console.log("URL changed to "+ window.location.href);
    oldLocation = window.location.href
    manualControl();
  }
}, 500); // check every second

//On Snipe
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting == "snipeitnow") {
    manualControl();
  }
});

//On Loop
manualControl();

function doSnipe() {
  // Differentiate the data received to URLs or Keyword
  findFirstProduct().then(function (theRightProduct) {
    if (theRightProduct.indexOf("http://www.supremenewyork.com/") >= 0) {
      snipeLink(theRightProduct);
      console.log("The data received is an url which is " + theRightProduct);
    } else {
      snipeKeyword(theRightProduct);
      console.log("The data received is a keyword which is " + theRightProduct);
    }
  });
}

function findFirstProduct() {
  return new Promise(function (resolve) {
    getLink().then(function (allURL) {
      var theRightProduct = allURL.putURL1;
      console.log("The first data received is " + theRightProduct)
      resolve(theRightProduct);
    });
  });
}

function snipeLink(theData) {
  console.log("URL Mode: The data received in snipeLink() is " + theData);
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
    var posNow = allURL.nowUrl; // Get current URL position
    var gotoPage = allURL[("putURL" + posNow).toString()]; // Get the URL to snipe at this time
    if (window.location.href == gotoPage) {
      console.log("URL Mode: Correct product page, executing addToCart();");
      addToCart();
    } else if (theData === undefined) { // If URL is not defined
      console.log("URL Mode: URL is undefined! Go to next URL.");
      // Check if there is a next URL to be sniped.
      goNext();
    } else {
      console.log("URL Mode: Not on product page. Navigating to product page.");
      window.location.href = theData;
    }
  });
}


function snipeKeyword(theData) {
  console.log("Keyword Mode: The data received in snipeKeyword() is " + theData);
  chrome.storage.local.get('theRightLink', function (result) {
    var theRightLink = result.theRightLink;
    if (window.location.href == theRightLink) {
      console.log("Keyword Mode: Correct product page, executing addToCart();");
      addToCart();
    } else if (window.location.href == allLink) {
      console.log("Keyword Mode: On all page. executing keywordBot(theData);");
      $(function () {
        keywordBot(theData);
      });
    } else {
      console.log("Keyword Mode: Not on all page. Navigating to all page.");
      window.location.href = allLink;
    }
  });
}

function keywordBot(theData) {
  // Acquire the correct URL based on keyword
  var p1 = new Promise(function (resolve, reject) {
    console.log("the product taken is " + theData)
    var imgProd = $('.inner-article a')
    imgProd.each(function () {
      if ($(this).attr("href").indexOf(theData) >= 0) {
        var theRightLink = $(this).attr("href");
        console.log("the right link is " + theRightLink)
        resolve(theRightLink);
        if (theRightLink.indexOf("black") >= 0) {
          var theRightLink = "http://www.supremenewyork.com" + theRightLink;
          resolve(theRightLink);
        }
        return false;
      }
    });
    reject("I'm busy");
  });
  // Acquire the correct URL based on keyword
  p1.then(function (theValue) {
    console.log("Keyword Mode: (SUCCESS) A URL has been retrieved from the keyword and the URL is " + theValue);
    window.location.href = theValue;
    chrome.storage.local.set({
      theRightLink: theValue
    });
  }).catch(function () {
    chrome.storage.local.get('theRightLink', function (result) {
      var theRightLink = result.theRightLink;
      if (window.location.href != theRightLink) {
        console.log("Keyword Mode: (FAILURE) URL is not the right link, so navigating to " + theRightLink);
        window.location.href = theRightLink;
      } else {
        console.log("Keyword Mode: Correct product page, executing addToCart();");
        addToCart();
      }
    });

  });
}

function selectSize() {
  console.log("Executing selectSize()")
  return new Promise(function (resolve) {
    if (window.location.href.indexOf("jackets") > -1) {
      getSize("jackets").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("shirts") > -1) {
      getSize("shirts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("tops") > -1) {
      getSize("tops").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("shoes") > -1) {
      getSize("shoes").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("sweatshirts") > -1) {
      getSize("sweatshirts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("shorts") > -1) {
      getSize("shorts").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("pants") > -1) {
      getSize("pants").then(function (result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        if (sizeValue == undefined) {
          getSize("pantsalt").then(function (result) {
            sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
            resolve(sizeValue);
          });
        } else {
          resolve(sizeValue);
        }
      });
    } else if (window.location.href.indexOf("t-shirts") > -1) {
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


function failSafe() {
  if (($('time b:contains("11:00am")').length > 0) && (window.location != gotoPage)) {
    console.log("URL doesn't exist, so skip item.");
    // Check if there is a next URL to be sniped.
    goNext();
  } else if (window.location.href != checkoutLink) {
    window.location.href = gotoPage;
  } else {
    //open new tab and go to page
    // chrome.tabs.create({ url: gotoPage });
    var win = window.open(firstPage, '_blank');
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this site');
    }
  }
}

function addToCart() {
  var checkSize = setInterval(function () {
    if ($('#size option').length) { // If product isn't already in cart and size dropdown exists
      console.log("Dropdown exist");
      clearInterval(checkSize);
      selectSize().then(function (sizeValue) {
        console.log("size has been resolved to the value of " + sizeValue)
        if (sizeValue !== undefined) {
          $("#size").val(sizeValue);
          var checkCart = setInterval(function () {
            if (($("#size").val() === sizeValue) && ($("#cart-addf").length !== 0)) {
              console.log("The size is correctly selected.");
              addSizeOne();
              clearInterval(checkCart);
              goNext();
            }
          }, 10);
        } else {
          console.log("Desired size does not exist");
          goNext();
        }
      });
    } else if ($("#size").attr('type') == 'hidden') {
      clearInterval(checkSize);
      checkStatus();
      console.log("Dropdown doesnt exist, executing addOneSize();");
      addOneSize();
    }
  }, 10);
}

function goNext() {
  getLink().then(function (allURL) { // Get all registered URLs
    // var allURL = items.allURL;
    var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
    // Get current URL position
    var posNow = allURL.nowUrl;
    // Get the URL to snipe at this time
    if (posNow < totalPos) {
      // Increase the URL position by 1
      var nextPos = posNow + 1;
      var nextObj = ("putURL" + nextPos).toString();
      var nextPage = allURL[nextObj];

      allURL.nowUrl = nextPos;
      chrome.storage.local.set({
        allURL: allURL
      }, function () {
        window.location.href = nextPage;
      });
    } else {
      console.log("Current URL position is " + posNow + " of " + totalPos + ", so checking out")
      checkout(); // Check out if item as been added to cart
    }
  });
}

function addSize() {
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: $("#cart-addf").attr('action'),
      type: 'POST',
      data: "size=" + sizeValue,
      success: function () {
        goNext();
      }
    });
  });
}

function addSizeOne() {
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: $("#cart-addf").attr('action'),
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
  onesize = $("#size").val();
  getLink().then(function (allURL) { // Get all registered URLs
    // var allURL = items.allURL;
    var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
    // Get current URL position
    var posNow = allURL.nowUrl;
    // Get the URL to snipe at this time
    var dataObj = ("putURL" + posNow).toString();
    var gotoPage = allURL[dataObj];
    $.ajax({
      url: $("#cart-addf").attr('action'),
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
    if (status == 1) {
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
  if (window.location.href == cartLink) {
    // Check if any unavailable item exists
    if ($(".out_of_stock").length !== 0) {
      $(".out_of_stock .cart-remove .intform .remove").click();
    } else {
      checkout();
    }
  }
}

// Function to fill forms if on checkout page
function fillforms() {
  if (window.location.href == checkoutLink) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.greeting == "clickcheck") {
        $("input[name = 'commit']").click();
        console.log("Got a message to check out.");
      }
    });
    var checkForm = setInterval(function () {
      if ($("#number_v").length !== 0) {
        clearInterval(checkForm);
        var nowZone = $("#time-zone-name").text();
        if (nowZone == "TYO") {
          chrome.storage.local.get('tyoPref', function (items) {
            var tyoPref = items.tyoPref;
            for (var key in tyoPref) {
              $("#" + key).val(tyoPref[key]);
            }
            if (tyoPref.credit_card_type == "cod") {
              $("#card_details").css("display", "none");
            }
          });
        } else if (nowZone == "NYC") {
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
        $("#order_terms").prop("checked", true);
        $(".icheckbox_minimal").addClass("checked");
      }
    }, 10);
  }
}
