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
          jackets: 'Large'
          shirts: 'Medium'
          tops: 'Large'
          sweatshirts: 'Large'
          tshirts: 'Large'
          shoes: '10.5'
          pants: 'Medium'
          pantsalt: '32'
        $('#jackets select').each (idx, element) ->
          sizePref.jackets = @value
          return
        $('#shirts select').each (idx, element) ->
          sizePref.shirts = @value
          return
        $('#tops select').each (idx, element) ->
          sizePref.tops = @value
          return
        $('#sweatshirts select').each (idx, element) ->
          sizePref.sweatshirts = @value
          return
        $('#pants select').each (idx, element) ->
          sizePref.pants = @value
          return
        $('#pantsalt select').each (idx, element) ->
          sizePref.pantsalt = @value
          return
        $('#tshirts select').each (idx, element) ->
          sizePref.tshirts = @value
          return
        $('#shoes select').each (idx, element) ->
          sizePref.shoes = @value
          return
        chrome.storage.local.set sizePref: sizePref
        return

      saveAllSizes()
  return
).call this
