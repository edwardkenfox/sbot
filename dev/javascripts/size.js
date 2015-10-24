(function() {
  (function() {
    $(function() {
      chrome.storage.local.get('sizePref', function(items) {
        var key, sizePref;
        key = void 0;
        sizePref = void 0;
        sizePref = items.sizePref;
        for (key in sizePref) {
          key = key;
          $('#' + key + ' select').val(sizePref[key]);
        }
      });
      return $('#saveSize').click(function() {
        var saveAllSizes;
        saveAllSizes = void 0;
        saveAllSizes = function() {
          var sizePref;
          sizePref = void 0;
          sizePref = {
            jackets: 'Large',
            tshirts: 'Large',
            shoes: '10.5',
            pants: 'Medium',
            pantsalt: '32'
          };
          $('#jackets select').each(function(idx, element) {
            sizePref.jackets = this.value;
          });
          $('#tshirts select').each(function(idx, element) {
            sizePref.tshirts = this.value;
          });
          $('#pants select').each(function(idx, element) {
            sizePref.pants = this.value;
          });
          $('#pantsalt select').each(function(idx, element) {
            sizePref.pantsalt = this.value;
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

}).call(this);
