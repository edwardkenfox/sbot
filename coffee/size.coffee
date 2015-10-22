$ ->
  # Get size form fields from storage and populate fields
  chrome.storage.sync.get 'sizePref', (items) ->
    sizePref = items.sizePref
    for key of sizePref
      $('#' + key + ' select').val sizePref[key]
    return
  $('#saveSize').click ->
    saveAllSizes = ->
      sizePref =
        tops: 'Large'
        shoes: '10.5'
      $('#tops select').each (idx, element) ->
        sizePref.tops = @value
        return
      $('#shoes select').each (idx, element) ->
        sizePref.shoes = @value
        return
      chrome.storage.sync.set sizePref: sizePref
      return

    saveAllSizes()
