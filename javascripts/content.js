// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';
var cartLink = 'https://www.supremenewyork.com/cart';

// Listen for the go-ahead and go to first page to start sniping
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "snipeitnow") {
        chrome.storage.local.get("allURL", function(items) {
            var allURL = items.allURL;
            // Load the first URL
            var firstPage = allURL.putURL1;
            if (window.location.href != checkoutLink) {
                window.location.href = firstPage;
                console.log("The first URL is " + firstPage + "and is not" + checkoutLink);
            } else {
                var win = window.open(firstPage, '_blank');
                if (win) {
                    //Browser has allowed it to be opened
                    win.focus();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups for this site');
                }
            }
        });
    }
});

// Remove unavailable items from cart
chrome.storage.local.get('statusStore', function(items) {
    var statusStore = items.statusStore.enableStatus;
    if (statusStore != 1) { // Check if enabled is on
        throw new FatalError("Something went badly wrong!");
    }
    getLink().then(function(allURL) { // Get all registered URLs
        // var allURL = items.allURL;
        var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
        // Get current URL position
        var posNow = allURL.nowUrl;
        // Get the URL to snipe at this time
        var dataObj = ("putURL" + posNow).toString();
        var gotoPage = allURL[dataObj];
        // If current URL isn't saved URL, go to it. If not, add the item to cart.
        if (window.location == gotoPage) {
            // Add to cart function
            var checkSize = setInterval(function() {
                if ($('#size option').length && statusStore == 1) { // If product isn't already in cart and size dropdown exists
                    console.log("Dropdown exist");
                    clearInterval(checkSize);
                    getSize("tshirts").then(function(result) {
                        sizeVal = $("#size").find("option").filter(':contains(' + result + ')').val();
                    });
                    chrome.storage.local.get('sizePref', function(items) { // Get size preferences from storage
                        if (sizeVal !== undefined) {
                            $("#size").val(sizeVal);
                            var checkCart = setInterval(function() {
                                if (($("#size").val() === sizeVal) && ($("#cart-addf").length !== 0)) {
                                    console.log("The size is correctly selected.");
                                    addSize();
                                    clearInterval(checkCart);
                                }
                            }, 10);
                        }
                    });
                } else if (statusStore == 1) {
                    clearInterval(checkSize);
                    console.log("Dropdown doesnt exist");
                    addOneSize();
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
});

fillforms();

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
            checkout(); // Check out if item as been added to cart
        }
    });
}

function addSize() {
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
            data: "size=" + sizeVal,
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

// Function to create an error
function FatalError() {
    Error.apply(this, arguments);
    this.name = "FatalError";
}
FatalError.prototype = Object.create(Error.prototype);

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
    // Get auto checkout status and process payment if on
    chrome.storage.local.get('statusStore2', function(items) {
        var statusStore2 = items.statusStore2;
        if (statusStore2.autoCheckout == 1) {
            var statusStore2 = {};
            statusStore2.autoCheckout = 0;
            chrome.storage.local.set({
                statusStore2: statusStore2
            });
            chrome.runtime.sendMessage({
                greeting: "checkitout"
            }, function(response) {
                console.log("Sent a message to check out.");
            });
        } else {
            console.log('Auto check out is disabled.');
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
