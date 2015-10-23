(->
  $ ->
    chrome.storage.local.get 'sizePref', (items) ->
      key = undefined
      sizePref = undefined
      sizePref = items.sizePref
      for key of sizePref
        `key = key`
        $('#' + key + ' select').val sizePref[key]
      return
    $('#saveSize').click ->
      saveAllSizes = undefined

      saveAllSizes = ->
        sizePref = undefined
        sizePref =
          tops: 'Large'
          shoes: '10.5'
        $('#tops select').each (idx, element) ->
          sizePref.tops = @value
          return
        $('#shoes select').each (idx, element) ->
          sizePref.shoes = @value
          return
        chrome.storage.local.set sizePref: sizePref
        return

      saveAllSizes()
  return
).call this
