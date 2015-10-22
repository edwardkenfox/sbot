$(document).ready(function() {

    // Remove credit card fields if COD is selected
    $("#tyo form .form-group #credit_card_type").change(function() {

        if ($(this).val() == "cod") {
            $("#tyo form .hideme").hide();
        } else {
            console.log("COD not selected")
            $("#tyo form .hideme").show();
        }
    });



    // Get TYO form fields from storage and populate fields
    chrome.storage.local.get('tyoPref', function(items) {
        var tyoPref = items.tyoPref;
        for (var key in tyoPref) {
            console.log('Replacing "' + key + '" with "' + tyoPref[key] + '"...');
            $("#tyo form .form-group #" + key).val(tyoPref[key]);

        }

        if (tyoPref["credit_card_type"] == "cod") {
            $("#tyo form .hideme").hide();
        } else {
            $("#tyo form .hideme").show();
        }
    });

    // Get NYC form fields from storage and populate fields
    chrome.storage.local.get('nycPref', function(items) {
        var nycPref = items.nycPref;
        for (var key in nycPref) {
            console.log('Replacing "' + key + '" with "' + nycPref[key] + '"...');
            $("#nyc form .form-group #" + key).val(nycPref[key]);

        }
    });



    $('#savetyoAdd').click(function() {


        function saveResults2() {

            var tyoPref = {};
            $('#tyo form .form-group input, #tyo form .form-group select').each(function(idx, element) {

                tyoPref[element.id] = this.value;
            });

            chrome.storage.local.set({
                tyoPref: tyoPref
            });
        }

        saveResults2();

    });


    $('#savenycAdd').click(function() {

        function saveResults() {
            var nycPref = {};
            $('#nyc form .form-group input, #nyc form .form-group select').each(function(idx, element) {

                nycPref[element.id] = this.value;

            });
            chrome.storage.local.set({
                nycPref: nycPref
            });
        }
        saveResults();

    });



});