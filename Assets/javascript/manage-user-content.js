//variable to track current index position being used for title and text area
var currentIndex = null
//track if title is approved
var titleApproved
//record new title name
var newTitle
//record title selected for loading saved memos
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

//check local storage for saved memos
function getLocalStorage(){
  var storedMemos = JSON.parse(localStorage.getItem("Voicely"));
  //if Memos are retrieved, update memoList with data
  if (storedMemos !== null) {
    memoList = storedMemos;
  }
}
//update data in local storage
function setLocalStorage(){
  localStorage.setItem("Voicely", JSON.stringify(memoList));
}


// load current titles in memoList as saved sessions
function loadMemoList() {
  //retrieve latest local storage data
  getLocalStorage()
  //clear contents of #savedList to start fresh
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
    //append link to new list item
    $('#listItem-' + i).append($('<a>', { href: '#!', class: 'secondary-content', id: 'listLink-' + i }))
    //append icon to link
    $('#listLink-' + i).append($('<i>', { class: 'material-icons', id: 'listIcon-' + i, }))
    //set icon text to clear
    $('#listIcon-' + i).text('clear')
    //increment x for the next line item color pattern
    x++
  }
}


// depending on what the user clicks on, change the behavior and accessibility of the page
function updatePageScene() {
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
    $('#smsBtn').prop("disabled", true)
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
    $('#smsBtn').prop("disabled", false)
    $('#saveVoicelyBtn').prop("disabled", false)
  }
}


//approve or deny a title input from a user
function approveNewTitle() {
  //if title is empty, deny and alert user
  if (newTitle !== '') {
    titleApproved = true
  } else {
    alert(`Title can not be blank, please enter a title name.`)
  }
  //if title is not empty, check to see if title is already in use
  //if title is in use, alert user
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


//lauched after new title is approved to create the new object in the array
function createNewVoicely() {
  var newMemoObject = {
    title: newTitle,
    content: ''
  }
  //add the new memo object to our memoList
  memoList.push(newMemoObject)
  //update local storage
  setLocalStorage()
  //update currentIndex to refrence our newly created & currently selected index
  currentIndex = memoList.length - 1
  console.log(`current index is ${currentIndex}, title: ${memoList[currentIndex].title}`)
  //reload the list to display the new object
  loadMemoList()
  //clear text from previously displayed Memo
  $('#phraseDiv').text('')
  //update the page scene with variable that is true
  pageEditContent = true
  updatePageScene()
  //reset variable
  pageEditContent = false
}


//check to see if content is saved before loading a new Memo
//this is triggered if a user selects a different memo when a current memo is loaded
//avoids a user accidentally loading a different memo without saving current memo
function confirmUpdateContent() {
  //check to see if displayed Memo content matches saved memo content
  if ($('#phraseDiv').val().toLowerCase().trim() === memoList[currentIndex].content.toLocaleLowerCase().trim()) {
    console.log('MEMO is up to date')
  } else {
    //if content does not match, prompt user before loading a different memo
    var saveWork
    saveWork = confirm(`Changes have been made to '${memoList[currentIndex].title}', would you like to save? \n OK - Yes \n Cancel - No`)
    if (saveWork) {
      //if user selects 'ok', save current memo changes before loading a different memo
      saveCurrentVoicely()
    }
  }
}


function findIndex() {
  //collects text from the entire list item
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


//refrencing the currentIndex, load the memo selected by the user
function loadVoicelyMemo() {
  $('#voicelyTitle').val(memoList[currentIndex].title)
  $('#phraseDiv').val('')
  $('#phraseDiv').val(memoList[currentIndex].content)
}


//refrencing the current index, update the content of current memo
function saveCurrentVoicely() {
  var updateContent = $('#phraseDiv').val()
  memoList[currentIndex].content = updateContent
  //update local storage
  setLocalStorage()
  console.log(memoList[currentIndex])
}


//listen for click on 'new voicely' button
$(document).on('click', '#newVoicelyBtn', function (event) {
  // if no Memo is loaded (start up page) and user clicks new memo, change page scene for 'LoadMemo'
  if (currentIndex === null && $(this).text().toLocaleLowerCase() === 'new voicely') {
    //update button scene
    pageLoadMemo = true
    updatePageScene()
    //reset button scene variable
    pageLoadMemo = false
    return
  }
  //if no Memo is loaded and user clicks 'cancel', return to start up screen
  if (currentIndex === null && $(this).text().toLocaleLowerCase() === 'cancel') {
    pageStart = true
    updatePageScene()
    //reset page scene variable
    pageStart = false
    return
  }
  // if a memo is loaded and a user clicks 'new voicely' 
  if (currentIndex !== null && $(this).text().toLowerCase() === 'new voicely') {
    //check to see if anything should be saved before allowing user to creeate a new voicely
    confirmUpdateContent()
    //update page scene
    pageLoadMemo = true
    updatePageScene()
    //reset page scene variable
    pageLoadMemo = false
    //clear title and content for new Memo creation
    $('#voicelyTitle').val('')
    $('#phraseDiv').val('')
    return
  }
  //if a memo is loaded, and a user clicks 'new voicely', then clicks 'cancel' to return to current memo
  if (currentIndex !== null && $(this).text().toLowerCase() === 'cancel') {
    //update page scene
    pageEditContent = true
    updatePageScene()
    //reset page scene variable
    pageEditContent = false
    //reload the voicely memo that was loaded before 'new voicely' was clicked
    loadVoicelyMemo()
  }
})


//listen for click  on 'edit title' button
$(document).on('click', '#editTitleBtn', function (event) {
  //if button is clicked and text displays 'save title',
  //user is in the process of updating a current memo or creating a new memo title
  if ($(this).text().toLocaleLowerCase() === 'save title') {
    //save the text value of the 'title' input
    newTitle = $('#voicelyTitle').val()
    //check title for approval
    approveNewTitle()
    //if title is approved
    if (titleApproved){
      //create the new memo object
      createNewVoicely()
      //reset the title approved variable
      titleApproved = false
    }
    console.log(memoList)
    return
  }
  //if button is clicked and text displays 'edit title', user has an active Memo loaded
  if ($(this).text().toLowerCase() === 'edit title') {
    //load page scene to edit title name
    pageEditTitle = true
    updatePageScene()
    //reset page scene variable
    pageEditTitle = false
    return
  }

  //if button is clicked and text displays 'update title',
  //user is attempting to change the name of the current loaded Memo
  if ($(this).text().toLocaleLowerCase() === 'update title') {
    //save user input text
    newTitle = $('#voicelyTitle').val()
    //check to see if new title is approved
    approveNewTitle()
    //if new title is approved
    if (titleApproved){
      //update current memo object with new title name
      memoList[currentIndex].title = newTitle
      console.log(memoList)
      //update local storage
      setLocalStorage()
      //reload the Memo list to display updated title name
      loadMemoList()
      //update the page scene
      pageEditContent = true
      updatePageScene()
      //reset page scene variable
      pageEditContent = false
      //reset approved title variable
      titleApproved = false
    }
    return
  }
})


//listen for a click on any saved Memo
$('.collection').on('click', '.collection-item', function () {
  //if a memo is selected and the edit title button displays 'edit title',
  //user is not in the middle of changing a current title name, so
  //allow user to load memo
  if ($('#editTitleBtn').text().toLowerCase() === 'edit title') {
    //save the text from the list item selected to
    selectedTitle = $(this).text()
    //if no memo is loaded
    if (currentIndex === null) {
      //find the index of the memo selected
      findIndex()
      //if a memo is currently loaded, index will not be null
    } else {
      //check to see if current memo content should be updated before loading the selected memo
      confirmUpdateContent()
      //find the index of the memo selected to load
      findIndex()
    }
    //load the page with the index if the Memo selected
    loadVoicelyMemo()
    //update page scene
    pageEditContent = true
    updatePageScene()
    //reset page scene variable
    pageEditContent = false
  } else {
    //if button does not display text of 'edit title',
    //then user is in the middle of creating a new memo or loading a saved memo
    //alert user and deny loading the selected memo
    alert("Finish updating title before loading a different Voicely")
  }
})


//listen for a click on save content button, when clicked updatet the conent value refrenced in currentIndex
$(document).on('click', '#saveVoicelyBtn', function () {
  saveCurrentVoicely()
})

// load saved memo list on startup
loadMemoList()
