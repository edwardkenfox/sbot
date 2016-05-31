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
            shirts: 'Medium',
            tops: 'Large',
            sweatshirts: 'Large',
            tshirts: 'Large',
            pants: 'Medium',
            pantsalt: '32',
            shorts: 'Medium',
            shortsalt: 'Medium',
            shoes: '10.5'
          };
          $('#jackets select').each(function(idx, element) {
            sizePref.jackets = this.value;
          });
          $('#shirts select').each(function(idx, element) {
            sizePref.shirts = this.value;
          });
          $('#tops select').each(function(idx, element) {
            sizePref.tops = this.value;
          });
          $('#sweatshirts select').each(function(idx, element) {
            sizePref.sweatshirts = this.value;
          });
          $('#pants select').each(function(idx, element) {
            sizePref.pants = this.value;
          });
          $('#pantsalt select').each(function(idx, element) {
            sizePref.pantsalt = this.value;
          });
          $('#tshirts select').each(function(idx, element) {
            sizePref.tshirts = this.value;
          });
          $('#shorts select').each(function(idx, element) {
            sizePref.shorts = this.value;
          });
          $('#shortsalt select').each(function(idx, element) {
            sizePref.shortsalt = this.value;
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
