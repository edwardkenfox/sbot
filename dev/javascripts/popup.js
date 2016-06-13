$(document).ready(function() {
  // Snipe button
  $('#clickMe').click(function() {
      /// Change the enabled status to on
      var statusStore = {};
      statusStore.enableStatus = 1;
      chrome.storage.local.set({
          statusStore: statusStore
      });
      // Send a signal to content.js to start running code to go to the first URL
      chrome.tabs.query({
          active: true,
          currentWindow: true
      }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
              greeting: "snipeitnow"
          });
      });
      // Reset the item count
      chrome.storage.local.set({ "itemArrayCurrent": 0 });
      // Save position in field manual field
      chrome.storage.local.get('manualSwitch', function(items) {
          console.log("this manualSwitch is " + items.manualSwitch)
          if (items.manualSwitch == 0) {
            var itemPosArray = $("input#auto-mode").val();
            chrome.storage.local.set({ "itemPos": itemPosArray });
            itemArrayTotal = itemPosArray.split(",").length;
            chrome.storage.local.set({ "itemArrayTotal": itemArrayTotal });
          } else {
            itemArrayTotal2 = $("input#manual-mode-checkout").val();
            console.log("Manual mode ON. Item processed before checkout is " + itemArrayTotal2);
            chrome.storage.local.set({ "itemArrayTotal": itemArrayTotal2 });
          }
      });
  });

  // Stop script button
  $('#stopMe').click(function() {
      // Change the enabled status to off
      var statusStore = {};
      statusStore.enableStatus = 0;
      chrome.storage.local.set({
          statusStore: statusStore
      });
  });

  // Get auto checkout status and set the checkbox
  chrome.storage.local.get('checkoutSwitch', function(items) {
      console.log("this checkoutswich is " + items.checkoutSwitch)
      if (items.checkoutSwitch == 1) {
          $("#auto-checkout").prop('checked', true);
          chrome.storage.local.get('manualSwitch', function(items) {
              if (items.manualSwitch == 1) {
                  $("#manual-mode-checkout").css('display', 'block');
              }
          });
      } else {
          $("#auto-checkout").prop('checked', false);
          $("#manual-mode-checkout").css('display', 'none');
      }
  });

  // Checkout for me checkbox
  $("#auto-checkout").change(function() {
      if (this.checked) {
          // Set auto-checkout status to on
          chrome.storage.local.set({ "checkoutSwitch": 1 });
          chrome.storage.local.get('manualSwitch', function(items) {
              if (items.manualSwitch == 1) {
                  $("#manual-mode-checkout").css('display', 'block');
              }
          });

      } else {
          // Set auto-checkout status to off
          chrome.storage.local.set({ "checkoutSwitch": 0 });
          $("#manual-mode-checkout").css('display', 'none');
      }
  });


  // Get manual status status and set the checkbox
  chrome.storage.local.get('manualSwitch', function(items) {
      console.log("this manualSwitch is " + items.manualSwitch)
      if (items.manualSwitch == 1) {
          $("#manual-mode").prop('checked', true);
          $("#auto-mode").css('display', 'none');
          chrome.storage.local.get('checkoutSwitch', function(items) {
              if (items.manualSwitch == 1) {
                  $("#manual-mode-checkout").css('display', 'block');
              }
          });
      } else {
          $("#manual-mode").prop('checked', false);
          $("#auto-mode").css('display', 'block');
          $("#manual-mode-checkout").css('display', 'none');
      }
  });

  // Checkout for me checkbox
  $("#manual-mode").change(function() {
      if (this.checked) {
          // Set auto-checkout status to on
          chrome.storage.local.set({ "manualSwitch": 1 });
          $("#auto-mode").css('display', 'none');
          chrome.storage.local.get('checkoutSwitch', function(items) {
              if (items.checkoutSwitch == 1) {
                  $("#manual-mode-checkout").css('display', 'block');
              }
          });
      } else {
          // Set auto-checkout status to off
          chrome.storage.local.set({ "manualSwitch": 0 });
          $("#auto-mode").css('display', 'block');
          $("#manual-mode-checkout").css('display', 'none');

      }
  });

  // Function to change enabled status and set button text
  function butText() {
      chrome.storage.local.get('statusStore', function(items) {
          var statusStore = items.statusStore;
          if (statusStore.enableStatus == 1) {
              $("#clickMe").html('<img src="images/three-dots.svg" style="display:inline-block;height:7px;width:auto;">Sniping...');
              $('#clickMe').prop('disabled', true);
              $("#stopMe").prop('disabled', false);
          } else {
              $("#clickMe").html('<i class="material-icons">gps_fixed</i>Snipe');
              $('#stopMe').prop('disabled', true);
              $("#clickMe").prop('disabled', false);
          }
      });
  }

  // Run above function on start
  butText();
  // Run change button text function if storage data changes
  chrome.storage.onChanged.addListener(function(changes, namespace) {
      butText();
  });


  // Fill input fields with saved URLs
  chrome.storage.local.get('allURL', function(items) {
      var allURL = items.allURL;
      for (var key in allURL) {
          console.log('The retrieved key is "' + key + '" and the data is "' + allURL[key] + '"...');
          $("#" + key).val(allURL[key]);
      }
  });

  chrome.storage.local.get('itemPos', function(items) {
      correctItemPos = items.itemPos;
      $("input#auto-mode").val(correctItemPos);
  });

  chrome.storage.local.get('itemArrayTotal', function(items) {
      itemArrayTotal = items.itemArrayTotal;
      $("input#manual-mode-checkout").val(itemArrayTotal);
  });

}); // End of document ready

$("input[type='url']").on("click", function() {
  $(this).select();
});
