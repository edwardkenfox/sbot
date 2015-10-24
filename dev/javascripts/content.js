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


checkStatus().then(function(botStatus) {
    if (botStatus == 1) {
        getLink().then(function(allURL) { // Get all registered URLs
            var totalPos = Object.keys(allURL).length - 1; // Get total number of URLs minus the data for position and minus 1 for URL position
            var posNow = allURL.nowUrl; // Get current URL position
            var gotoPage = allURL[("putURL" + posNow).toString()]; // Get the URL to snipe at this time
            if (window.location == gotoPage) {
                var checkSize = setInterval(function() {
                    if ($('#size option').length) { // If product isn't already in cart and size dropdown exists
                        console.log("Dropdown exist");
                        clearInterval(checkSize);
                        checkStatus();
                        selectSize().then(function(sizeValue) {
                            if (sizeValue !== undefined) {
                                $("#size").val(sizeValue);
                                var checkCart = setInterval(function() {
                                    if (($("#size").val() === sizeValue) && ($("#cart-addf").length !== 0)) {
                                        console.log("The size is correctly selected.");
                                        addSize();
                                        clearInterval(checkCart);
                                    }
                                }, 10);
                            }
                        });
                    } else if ($("#size").attr('type') == 'hidden') {
                        clearInterval(checkSize);
                        checkStatus();
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
    }
});

fillforms();

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
            console.log("this checkoutswich from contentjs is " + items.checkoutSwitch)
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
