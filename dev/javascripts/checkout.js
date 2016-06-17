// Variables
var checkoutLink = 'https://www.supremenewyork.com/checkout';

//On Loop
$(function() {
  if (window.location.href === checkoutLink) {
    fillforms();
    console.log("Page loaded. Checkout link. Fill forms.")
  }
});

// Function to fill forms if on checkout page
function fillforms() {
  var doc = window.document;
  console.log("This is the check before a checkout page.");

    console.log("This is a checkout page.");
    var checkForm = setInterval(function () {
      if (doc.getElementById("number_v")) {
        clearInterval(checkForm);
        var nowZone = doc.getElementById("time-zone-name").innerHTML;
        if (nowZone === "TYO") {
          console.log("This is the TYO checkout page.");
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
