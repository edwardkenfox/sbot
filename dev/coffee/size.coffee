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
          tshirts: 'Large'
          shoes: '10.5'
          pants: 'Medium'
          pantsalt: '32'
        $('#tshirts select').each (idx, element) ->
          sizePref.tshirts = @value
          return
        $('#pants select').each (idx, element) ->
          sizePref.pants = @value
          return
        $('#pantsalt select').each (idx, element) ->
          sizePref.pantsalt = @value
          return
        $('#shoes select').each (idx, element) ->
          sizePref.shoes = @value
          return
        chrome.storage.local.set sizePref: sizePref
        return

      saveAllSizes()
  return
).call this
