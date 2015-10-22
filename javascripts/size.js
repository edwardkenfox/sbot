(function() {
  $(function() {
    chrome.storage.local.get('sizePref', function(items) {
      var key, sizePref;
      sizePref = items.sizePref;
      for (key in sizePref) {
        $('#' + key + ' select').val(sizePref[key]);
      }
    });
    return $('#saveSize').click(function() {
      var saveAllSizes;
      saveAllSizes = function() {
        var sizePref;
        sizePref = {
          tops: 'Large',
          shoes: '10.5'
        };
        $('#tops select').each(function(idx, element) {
          sizePref.tops = this.value;
        });
        $('#shoes select').each(function(idx, element) {
          sizePref.shoes = this.value;
        });
        chrome.storage.local.set({
          sizePref: sizePref
        });
      };
      return saveAllSizes();
    });
  });

}).call(this);
