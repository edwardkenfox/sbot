// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';
var allLink = 'http://www.supremenewyork.com/shop/all';
var currentLink = window.location.href;

// Listen for the go-ahead and go to first page to start sniping
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "snipeitnow") {
    chrome.storage.local.remove("theRightLink");
    chrome.storage.local.get("allURL", function(items) {
      // Load the first URL/keyword
      var firstPage = items.allURL.putURL1;
      console.log("The first keyword/URL with variable name firstPage is " + firstPage);
      console.log("The current URL (window.location.href) is " + window.location.href);
      if (firstPage.indexOf("http://www.supremenewyork.com/shop/") >= 0) { // Is a link
        window.location.href = firstPage;
        console.log("Data received contains URL. Going to URL.")
      } else if (window.location.href == 'http://www.supremenewyork.com/shop/all') {
        console.log("Data received contains keyword and URL is shop/all. Checking product.");
        findFirstProductLink().then(function(theRightLink) {
          console.log("The first link on snipe is " + theRightLink);
          console.log("The link that we have to go to is " + theRightLink)
          chrome.storage.local.set({
            theRightLink: theRightLink
          }, function() {
            window.location.href = theRightLink;
          });
        });
      } else {
        console.log("Data received contains keyword and URL is not shop/all. Going to shop/all.");
        window.location.href = allLink;
      }
    });
  }
});

checkStatus().then(function(botStatus) {
  if (botStatus == 1) {
    chrome.storage.local.get('theRightLink', function(result) { // Get size preferences from storage
      var theRightLink = result.theRightLink;
      console.log("The right link is read from the storage as " + theRightLink);
      if (theRightLink !== undefined) {
        console.log("The right link is read as " + theRightLink);
        if (window.location.href == theRightLink) {
          console.log("The current URL is correctly matched as " + theRightLink);
          var checkSize = setInterval(function() {
            if ($('#size option').length) { // If product isn't already in cart and size dropdown exists
              console.log("Dropdown exist");
              clearInterval(checkSize);
              checkStatus();
              selectSize().then(function(sizeValue) {
                console.log("size has been resolved to the value of " + sizeValue)
                if (sizeValue !== undefined) {
                  $("#size").val(sizeValue);
                  var checkCart = setInterval(function() {
                    if (($("#size").val() === sizeValue) && ($("#cart-addf").length !== 0)) {
                      console.log("The size is correctly selected.");
                      addSize();
                      clearInterval(checkCart);
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
              console.log("Dropdown doesnt exist");
              addOneSize();
            }
          }, 10);

        } else {
          window.location.href = theRightLink;
        }
      } else {
        window.location.href = allLink;
      }
    });
  }
});


/*
checkStatus().then(function(botStatus) {
  if (botStatus == 1) {
    getLink().then(function(allURL) { // Get all registered URLs
      var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
      var posNow = allURL.nowUrl; // Get current URL position
      var gotoPage = allURL[("putURL" + posNow).toString()]; // Get the URL to snipe at this time

      switch (window.location) {
        case (gotoPage):
          console.log("We reached product page as data sent was a link.")
        case (allLink):
          console.log("We reached all page as data sent was a keyword. You should search for the right href now")
      }

            if (window.location == gotoPage) {
              var checkSize = setInterval(function() {
                if ($('#size option').length) { // If product isn't already in cart and size dropdown exists
                  console.log("Dropdown exist");
                  clearInterval(checkSize);
                  checkStatus();
                  selectSize().then(function(sizeValue) {
                    console.log("size has been resolved to the value of " + sizeValue)
                    if (sizeValue !== undefined) {
                      $("#size").val(sizeValue);
                      var checkCart = setInterval(function() {
                        if (($("#size").val() === sizeValue) && ($("#cart-addf").length !== 0)) {
                          console.log("The size is correctly selected.");
                          addSize();
                          clearInterval(checkCart);
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
                  console.log("Dropdown doesnt exist");
                  addOneSize();
                } else {
                  clearInterval(checkSize);
                  console.log("The size dropdown does not exist. The item is probably sold out.");
                  goNext();
                }
              }, 10);
            } else if (gotoPage === undefined) { // If URL is not defined
              console.log("URL is undefined! Go to next.");
              // Check if there is a next URL to be sniped.
              goNext();
            } else {
              failSafe();
            }


    });
  }
});*/

function findFirstProduct() {
  return new Promise(function(resolve) {
    getLink().then(function(allURL) {
      var theRightProduct = allURL.putURL1;
      console.log("The data(s) received are as follows " + theRightProduct)
      resolve(theRightProduct);
    });
  });
}

function findFirstProductLink() {
  return new Promise(function(resolve) {
    findFirstProduct().then(function(theRightProduct) {
      console.log($("img[alt='" + theRightProduct + "']"));

      $('.inner-article a img').each(function() {
        if ($(this).attr("alt").indexOf(theRightProduct) >= 0) {
          var theRightLink = $(this).parent().attr("href");
          if (theRightLink.indexOf("black") >= 0) {
            var theRightLink = "http://www.supremenewyork.com" + theRightLink;
            resolve(theRightLink);
          }

        }
      });

    });
  });
};





function selectSize() {
  console.log("size selector start")
  return new Promise(function(resolve) {
    if (window.location.href.indexOf("jackets") > -1) {
      getSize("jackets").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("shirts") > -1) {
      getSize("shirts").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("tops") > -1) {
      getSize("tops").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("sweatshirts") > -1) {
      getSize("sweatshirts").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    } else if (window.location.href.indexOf("pants") > -1) {
      getSize("pants").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        if (sizeValue == undefined) {
          getSize("pantsalt").then(function(result) {
            sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
            resolve(sizeValue);
          });
        } else {
          resolve(sizeValue);
        }
      });
    } else if (window.location.href.indexOf("t-shirts") > -1) {
      getSize("tshirts").then(function(result) {
        sizeValue = $("#size").find("option").filter(':contains(' + result + ')').val();
        resolve(sizeValue);
      });
    }
  });
}



function checkStatus() {
  return new Promise(function(resolve) {
    chrome.storage.local.get('statusStore', function(items) {
      resolve(items.statusStore.enableStatus);
    });
  });
}

function checkCheckout() {
  return new Promise(function(resolve) {
    chrome.storage.local.get('checkoutSwitch', function(items) {
      resolve(items.checkoutSwitch);
      console.log("The auto checkout switch in chrome.storage is set to " + items.checkoutSwitch)
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

function goNext() {
  getLink().then(function(allURL) { // Get all registered URLs
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
      window.location.href = nextPage;
      allURL.nowUrl = nextPos;
      chrome.storage.local.set({
        allURL: allURL
      });
    } else {
      console.log("Current URL position is " + posNow + " of " + totalPos + ", so checking out")
      checkout(); // Check out if item as been added to cart
    }
  });
}

function addSize() {
  getLink().then(function(allURL) { // Get all registered URLs
    var totalPos = Object.keys(allURL).length - 1;
    var posNow = allURL.nowUrl;
    var gotoPage = allURL[("putURL" + posNow).toString()];
    $.ajax({
      url: $("#cart-addf").attr('action'),
      type: 'POST',
      data: "size=" + sizeValue,
      success: function() {
        goNext();
      }
    });
  });
}

// Function to add size to cart
function addOneSize() {
  onesize = $("#size").val();
  getLink().then(function(allURL) { // Get all registered URLs
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
      success: function() {
        goNext();
      }
    });
  });
}

// Function to get size
function getSize(itemSize) {
  return new Promise(function(resolve) {
    chrome.storage.local.get('sizePref', function(items) { // Get size preferences from storage
      resolve(items.sizePref[itemSize]);
    });
  });
};

// Fucntion to get link from storage
function getLink() {
  return new Promise(function(resolve) {
    chrome.storage.local.get('allURL', function(items) { // Get size preferences from storage
      resolve(items.allURL);
    });
  });
};

// Function to go to checkout page
function checkout() {
  turnOff();
  checkCheckout().then(function(status) {
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
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.greeting == "clickcheck") {
        $("input[name = 'commit']").click();
        console.log("Got a message to check out.");
      }
    });
    var checkForm = setInterval(function() {
      if ($("#number_v").length !== 0) {
        clearInterval(checkForm);
        var nowZone = $("#time-zone-name").text();
        if (nowZone == "TYO") {
          chrome.storage.local.get('tyoPref', function(items) {
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
          chrome.storage.local.get('nycPref', function(items) {
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
