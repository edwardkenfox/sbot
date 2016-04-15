$(document).ready ->
  # Remove credit card fields if COD is selected
  $('#tyo form .form-group #credit_card_type').change ->
    if $(this).val() == 'cod'
      $('#tyo form .hideme').hide()
    else
      console.log 'COD not selected'
      $('#tyo form .hideme').show()
    return
  # Get TYO form fields from storage and populate fields
  chrome.storage.local.get 'tyoPref', (items) ->
    tyoPref = items.tyoPref
    for key of tyoPref
      console.log 'Replacing "' + key + '" with "' + tyoPref[key] + '"...'
      $('#tyo form .form-group #' + key).val tyoPref[key]
    if tyoPref['credit_card_type'] == 'cod'
      $('#tyo form .hideme').hide()
    else
      $('#tyo form .hideme').show()
    return
  # Get NYC form fields from storage and populate fields
  chrome.storage.local.get 'nycPref', (items) ->
    nycPref = items.nycPref
    for key of nycPref
      console.log 'Replacing "' + key + '" with "' + nycPref[key] + '"...'
      $('#nyc form .form-group #' + key).val nycPref[key]
    return
  $('#savetyoAdd').click ->

    saveResults2 = ->
      tyoPref = {}
      $('#tyo form .form-group input, #tyo form .form-group select').each (idx, element) ->
        tyoPref[element.id] = @value
        return
      chrome.storage.local.set tyoPref: tyoPref
      return

    saveResults2()
    return
  $('#savenycAdd').click ->

    saveResults = ->
      nycPref = {}
      $('#nyc form .form-group input, #nyc form .form-group select').each (idx, element) ->
        nycPref[element.id] = @value
        return
      chrome.storage.local.set nycPref: nycPref
      return

    saveResults()
    return
  return
