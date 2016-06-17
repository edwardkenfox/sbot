// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';
var allLink = 'http://www.supremenewyork.com/shop/all';
var newLink = 'http://www.supremenewyork.com/shop/new';
var productPattern = new RegExp("http://www.supremenewyork.com/shop/([a-z'-]+)/([a-z0-9]+)/([a-z-0-9]+)")

//On Loop
$(function() {
  if (window.location.href.match(productPattern)) {
    console.log("Page loaded. Match product page.")
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
