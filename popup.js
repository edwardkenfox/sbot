$(document).ready(function() {


    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".field-wrapper"); //Fields wrapper
    var removeBut = $(".remove_field"); //Fields wrapper
    var add_button = $("#add_field_button"); //Add button ID
    var x = "";
    // Initial text box count
    chrome.storage.local.get("allURL", function(items) { // Get all registered URLs
        var allURL = items.allURL;
        var totalPos = Object.keys(allURL).length - 1;
        if (totalPos) {
            x = totalPos;
        } else {
            x = 1;
        }
        for (var i = 2; i < x + 1; i++) {
            $(wrapper).append('<div class="form-group"><input type="url" id="putURL' + i + '" name="mytext[]" placeholder="Insert URL you want to snipe" required /><a href="#" class="remove_field"><i class="fa fa-minus-circle"></i></a></div>'); //add input box
        }
    });

    // Add field button
    $(add_button).unbind('click').bind('click', function(e) {
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div class="form-group"><input type="url" id="putURL' + x + '" name="mytext[]" placeholder="Insert URL you want to snipe" required /><a href="#" class="remove_field"><i class="fa fa-minus-circle"></i></a></div>'); //add input box
        }
    });

    // Remove field button
    $(wrapper).unbind('click').on("click", ".remove_field", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        if (x > 1) {
            x--;
        }
    });

    // Function to save values of URL fields that are not empty
    function saveResults() {
        var allURL = {};
        $('input[type=url]').filter(function() {
            return this.value.length !== 0;
        }).each(function(idx, element) {
            allURL[element.id] = this.value; // Set URL field id as Object name
        });
        allURL.nowUrl = 1; // Reset URL position
        chrome.storage.local.set({
            allURL: allURL
        });
    }

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


        // Save URL in fields
        saveResults();

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
    chrome.storage.local.get('statusStore2', function(items) {
        var statusStore2 = items.statusStore2;
        if (statusStore2.autoCheckout == 1) {
            $("#auto-checkout").prop('checked', true);
        } else {
            $("#auto-checkout").prop('checked', false);
        }
    });


    // Checkout for me checkbox
    $("#auto-checkout").change(function() {
        if (this.checked) {
            // Set auto-checkout status to on
            statusStore2 = {};
            statusStore2.autoCheckout = 1;
            chrome.storage.local.set({
                statusStore2: statusStore2
            });
        } else {
            // Set auto-checkout status to off
            statusStore2 = {};
            statusStore2.autoCheckout = 0;
            chrome.storage.local.set({
                statusStore2: statusStore2
            });
            console.log(statusStore2);
        }
    });


    // Function to change enabled status and set button text
    function butText() {
        chrome.storage.local.get('statusStore', function(items) {
            var statusStore = items.statusStore;
            if (statusStore.enableStatus == 1) {
                $("#clickMe").html('<img src="three-dots.svg" style="display:inline-block;height:7px;width:auto;"> <div style="display:inline-block;font-size:16px;">Sniping...</div>');
                $('#clickMe').prop('disabled', true);
                $("#stopMe").prop('disabled', false);
            } else {
                $("#clickMe").html('<i class="fa fa-crosshairs"></i>');
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


}); // End of document ready


$("input[type='url']").on("click", function() {
    $(this).select();
});