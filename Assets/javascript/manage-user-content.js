

//variable to track current index position being used for title and text area
var currentIndex = null
var titleApproved
var newTitle
var selectedTitle
//page scene selectors
var pageStart
var pageLoadMemo
var pageEditContent
var pageEditTitle


//object array for storing titles and content
var memoList = [{
  title: 'GroceryList',
  content: 'snacks',
}, {
  title: 'Christmas List',
  content: 'World peace',
}, {
  title: 'To Do',
  content: 'Work on Voicely project',
}, {
  title: 'Why Westley is the cutest',
  content: 'Facts',
}, {
  title: '5 Cutest Wildcat Species',
  content: 'Sandcats'
}]

// load current titles in memoList as saved sessions
function loadList() {
  //clear contents of list to start fresh
  $('#savedList').empty()
  // color class names ordered to create the list item background fade effect
  var colorClass = ['lighten-3', 'lighten-2', 'lighten-1', '', 'darken-1', 'darken-2', 'darken-3', 'darken-2', 'darken-1', '', 'lighten-1', 'lighten-2']
  //start on colorClass index 0
  var x = 0

  for (let i = 0; i < memoList.length; i++) {
    //if x === 11 then reset x to 0 to loop color pattern again
    if (x === 11) {
      x = 0
    }
    //append new list item & add text
    $('#savedList').append($('<li>', { class: 'collection-item cyan ' + colorClass[x], id: 'listItem-' + i }))
    $('#listItem-' + i).text(memoList[i].title)
    //append link to new li
    $('#listItem-' + i).append($('<a>', { href: '#!', class: 'secondary-content', id: 'listLink-' + i }))
    //append icon to link
    $('#listLink-' + i).append($('<i>', { class: 'material-icons', id: 'listIcon-' + i, }))
    //set icon text to clear
    $('#listIcon-' + i).text('clear')
    //increment x for the next line item color pattern
    x++
  }
}
// load saved memo list on startup
loadList()



// depending on what the user is trying to do, change the behavior and accessibility of the page
function changePageScene() {
  //START - Scene to create a new Voicely or load a saved session
  if (pageStart) {
    $('#editTitleBtn').text('Edit title')
    $("#voicelyTitle").prop("disabled", true)
    $("#editTitleBtn").prop("disabled", true)
    $('#editTitleBtn').text('Edit title')
    $("#newVoicelyBtn").prop("disabled", false)
    $("#newVoicelyBtn").text("new voicely")
    $('#phraseDiv').prop("disabled", true)
  }
  //LOAD - Scene to create a new Voicely memo, or cancel and return to START-UP SCREEN
  if (pageLoadMemo) {
    $("#voicelyTitle").prop("disabled", false)
    $("#editTitleBtn").prop("disabled", false)
    $('#editTitleBtn').text('Save title')
    $("#newVoicelyBtn").prop("disabled", false)
    $("#newVoicelyBtn").text("cancel")
    $('#phraseDiv').prop("disabled", true)
    $('#recordVoicelyBtn').prop("disabled", true)
    $('#saveVoicelyBtn').prop("disabled", true)
  }
  //EDIT TITLE - Scene to edit the title of an existing memo
  if (pageEditTitle) {
    $("#voicelyTitle").prop("disabled", false)
    $("#newVoicelyBtn").text('cancel')
    $("#editTitleBtn").prop("disabled", false)
    $('#editTitleBtn').text('Update title')
    $('#recordVoicelyBtn').prop("disabled", true)
    $('#saveVoicelyBtn').prop("disabled", true)
  }
  //EDIT CONTENT - Scene for working on a current Voicely memo
  if (pageEditContent) {
    $('#editTitleBtn').text('Edit title')
    $("#voicelyTitle").prop("disabled", true)
    $("#editTitleBtn").prop("disabled", false)
    $('#editTitleBtn').text('Edit title')
    $("#newVoicelyBtn").prop("disabled", false)
    $("#newVoicelyBtn").text("new voicely")
    $('#phraseDiv').prop("disabled", false)
    $('#recordVoicelyBtn').prop("disabled", false)
    $('#saveVoicelyBtn').prop("disabled", false)
  }
}


//approve or deny a title input from a user
function approveNewTitle() {
  //if title is empty, deny
  if (newTitle !== '') {
    titleApproved = true
  } else {
    alert(`Title can not be blank, please enter a title name.`)
  }

  if (titleApproved) {
    for (let i = 0; i < memoList.length; i++) {
      if (memoList[i].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim()) {
        titleApproved = false
        console.log(`The title: '${memoList[i].title}', already exists at index ${i}`)
        alert(`"${newTitle}" already exists, please enter a different title.`)
      }
    }
  }
}


function createNewVoicely() {
  var newMemoObject = {
    title: newTitle,
    content: ''
  }
  //add the new session to our memoList
  memoList.push(newMemoObject)
  //update currentIndex to refrence our newly created index
  currentIndex = memoList.length - 1
  console.log(`current index is ${currentIndex}, title: ${memoList[currentIndex].title}`)
  loadList()
  $('#phraseDiv').text('')

  pageEditContent = true
  changePageScene()
  pageEditContent = false
}


function confirmUpdateContent() {
  if ($('#phraseDiv').val().toLowerCase().trim() === memoList[currentIndex].content.toLocaleLowerCase().trim()) {
    console.log('up to date')
  } else {
    var saveWork
    saveWork = confirm(`Changes have been made to '${memoList[currentIndex].title}', would you like to save? \n No - Cancel \n Yes - OK`)
    if (saveWork) {
      saveCurrentVoicely()
    }
  }
}


$(document).on('click', '#newVoicelyBtn', function (event) {
  // from STARTUP Scene to LOAD Scene
  if (currentIndex === null && $(this).text().toLocaleLowerCase() === 'new voicely') {
    //turned on and turned off upon successful title creation
    pageLoadMemo = true
    changePageScene()
    pageLoadMemo = false
    return
  }
  //cancel to return to LOAD screen
  if (currentIndex === null && $(this).text().toLocaleLowerCase() === 'cancel') {
    pageStart = true
    changePageScene()
    pageStart = false
    return
  }

  if (currentIndex !== null && $(this).text().toLowerCase() === 'new voicely') {

    confirmUpdateContent()
    pageLoadMemo = true
    changePageScene()
    pageLoadMemo = false
    $('#voicelyTitle').val('')
    $('#phraseDiv').val('')

    return
  }

  if (currentIndex !== null && $(this).text().toLowerCase() === 'cancel') {
    pageEditContent = true
    changePageScene()
    pageEditContent = false
    loadVoicelyMemo()
  }

})


$(document).on('click', '#editTitleBtn', function (event) {

  if ($(this).text().toLocaleLowerCase() === 'save title') {
    //save the text value of the 'title' input
    newTitle = $('#voicelyTitle').val()
    approveNewTitle()
    if (titleApproved){
      createNewVoicely()
      titleApproved = false
    }
    console.log(memoList)
    return
  }

  if ($(this).text().toLowerCase() === 'edit title') {
    pageEditTitle = true
    changePageScene()
    pageEditTitle = false
    return
  }

  //update an existing title name
  if ($(this).text().toLocaleLowerCase() === 'update title') {
    newTitle = $('#voicelyTitle').val()
    console.log(newTitle)
    approveNewTitle()
    console.log(memoList)
    
    if (titleApproved){
      memoList[currentIndex].title = newTitle
      loadList()
      pageEditContent = true
      changePageScene()
      pageEditContent = false
      titleApproved = false
    }
    return
  }
})


function findIndex() {
  //collects text from the entire li 
  // I could not figure out how to only focus on the li text content (title name). It always included the icon text of 'clear' as well.
  //our 'x' icon contains the text 'clear', this is to  remove the word 'clear' from $(this).text()
  selectedTitle = selectedTitle.substring(0, selectedTitle.length - 5)
  //compare selectedTitle 'text' to our titles in our memoList array, if it matches, save the index location to currentIndex
  for (let i = 0; i < memoList.length; i++) {
    if (memoList[i].title === selectedTitle) {
      currentIndex = i
      console.log(`index-${currentIndex}; title: ${memoList[currentIndex].title}`)
    }
  }
}

//listen for a click on any saved session
$('.collection').on('click', '.collection-item', function () {
  if ($('#editTitleBtn').text().toLowerCase() === 'edit title') {

    selectedTitle = $(this).text()
    if (currentIndex === null) {
      findIndex()
    } else {
      confirmUpdateContent()
      findIndex()
    }

    loadVoicelyMemo()

    pageEditContent = true
    changePageScene()
    pageEditContent = false
  } else {
    alert("Finish updating title before loading a different Voicely")
  }
})

//refrencing the currentIndex, load the title and content values to the screen of whatever list item the user clicks
function loadVoicelyMemo() {
  $('#voicelyTitle').val(memoList[currentIndex].title)
  $('#phraseDiv').val('')
  $('#phraseDiv').val(memoList[currentIndex].content)

}

function saveCurrentVoicely() {
  var updateContent = $('#phraseDiv').val()
  console.log(updateContent)
  memoList[currentIndex].content = updateContent
  console.log(memoList[currentIndex])

}

//listen for a click on save content button, when clicked updatet the conent value refrenced in currentIndex
$(document).on('click', '#saveVoicelyBtn', function () {
  saveCurrentVoicely()
})

//------END------load/save content------------