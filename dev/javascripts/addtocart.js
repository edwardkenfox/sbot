$(function() {
  addToCart();
});

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
      console.log("Increase item count and add one.");
      addOneSize();
      chrome.runtime.sendMessage({
        greeting: "increasecount"
      });
    } else {
      clearInterval(checkSize);
      chrome.runtime.sendMessage({
        greeting: "increasecount"
      });
      console.log("Increase item count and item not added.");
    }
  }, 10);
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

function addSize() {
  getLink().then(function (allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: document.getElementById("cart-addf").getAttribute("action"),
      type: 'POST',
      data: "size=" + sizeValue,
      success: function () {
        console.log("Add size ajax success")
      }
    });
  });
}

function addSizeOne() {
  $.ajax({
    url: document.getElementById("cart-addf").getAttribute("action"),
    type: 'POST',
    data: "size=" + sizeValue,
  });
}

// Function to add size to cart
function addOneSize() {
  var doc = window.document;
  onesize = doc.getElementById("size").value;
  $.ajax({
    url: doc.getElementById("cart-addf").getAttribute("action"),
    type: 'POST',
    data: "size=" + onesize,
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
