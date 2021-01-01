//variable to track current index position being used for title and text area
var displayedIndex = null

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
// var memoList = []
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
}, {
  title: ' 🔨  Time',
  content: '💡     💡     💡     💡     💡     💡     💡     💡\n     💡     💡     💡     💡     💡     💡     💡\n💡     💡     💡     💡     💡     💡     💡     💡'
}]

//check local storage for saved memos
function getLocalStorage() {
  var storedMemos = JSON.parse(localStorage.getItem("Voicely"));
  //if Memos are retrieved, update memoList with data
  if (storedMemos !== null) {
    memoList = storedMemos;
    $('#phraseDiv').text(`Welcome back!\n Create a new Voicely or load a previous session`)
  } else {
    $('#phraseDiv').text(`Welcome!\n Create a new Voicely to get started`)

  }
}
//update data in local storage
function setLocalStorage() {
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
    $('#listItem-' + i).append($('<span>', { class: 'memo-title', id: 'memoTitle-' + i }))
    $('#memoTitle-' + i).text(memoList[i].title)
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
    $("#voicelyTitle").prop("disabled", true)
    $('#voicelyTitle').attr('class', 'cyan white-text')
    $("#voicelyTitle").val('')
    $('#alertText').text('')
    $("#editTitleBtn").prop("disabled", true)
    $('#editTitleBtn').text('Edit title')
    $("#newVoicelyBtn").prop("disabled", false)
    $("#newVoicelyBtn").text("new voicely")
    $('#phraseDiv').prop("disabled", true)
    $('#phraseDiv').val("")
    $('#recordVoicelyBtn').prop("disabled", true)
  }
  //LOAD - Scene to create a new Voicely memo, or cancel and return to START-UP SCREEN
  if (pageLoadMemo) {
    $("#voicelyTitle").prop("disabled", false)
    $('#voicelyTitle').attr('class', 'cyan white-text lighten-3')
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
    $('#voicelyTitle').attr('class', 'cyan white-text lighten-3')
    $("#newVoicelyBtn").text('cancel')
    $("#editTitleBtn").prop("disabled", false)
    $('#editTitleBtn').text('Update title')
    $('#recordVoicelyBtn').prop("disabled", false)
    $('#saveVoicelyBtn').prop("disabled", true)
  }
  //EDIT CONTENT - Scene for working on a current Voicely memo
  if (pageEditContent) {
    $("#voicelyTitle").prop("disabled", true)
    $('#voicelyTitle').attr('class', 'cyan white-text')
    $('#alertText').text('')
    $("#newVoicelyBtn").prop("disabled", false)
    $("#newVoicelyBtn").text("new voicely")
    $("#editTitleBtn").prop("disabled", false)
    $('#editTitleBtn').text('Edit title')
    $('#phraseDiv').prop("disabled", false)
    $('#recordVoicelyBtn').prop("disabled", false)
    $('#saveVoicelyBtn').prop("disabled", false)
  }
}


//approve or deny a title input from a user
function approveNewTitle() {
  //if title is empty, deny and alert user
  if (newTitle !== '') {
    titleApproved = true
  } else {
    $('#alertText').text(`*title can not be blank`)
    return
  }
  console.log(displayedIndex)
  //if title is not empty, and title matches the current displayed title, allow it and return
  if(titleApproved && displayedIndex!== null &&  memoList[displayedIndex].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim() ){
    titleApproved = true
    return
    //if title matches a different index location, deny to avoid duplicate title names and alert user to
  }else {
    for (let i = 0; i < memoList.length; i++) {
      if (memoList[i].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim()) {
        titleApproved = false
        console.log(`The title: '${memoList[i].title}', already exists at index ${i}`)
        $('#alertText').text(`"${newTitle}" already exists`)
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
  //update displayedIndex to refrence our newly created & currently selected index
  displayedIndex = memoList.length - 1
  console.log(`current index is ${displayedIndex}, title: ${memoList[displayedIndex].title}`)
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

//find the index location where 'selectedTitle' lives. This is used to load the title and content onto the page when loading a saved memo.
//displayIndex is also used to track the index loaction of the current loaded memo for auto-saving and editing purposes.
function findDisplayedIndex() {
  //loop through the memolist array
  for (let i = 0; i < memoList.length; i++) {
    //if the memo.title property matches the text value saved in "selectedTitle", save that index number to 'displayedIndex' variable
    if (memoList[i].title === selectedTitle) {
      displayedIndex = i
    }
  }
}


//refrencing the displayedIndex variable, load the memo selected by the user
function loadVoicelyMemo() {
  $('#voicelyTitle').val(memoList[displayedIndex].title)
  //empty #phraseDiv before loading content to avoid concatination of previous and new content
  $('#phraseDiv').val('')
  $('#phraseDiv').val(memoList[displayedIndex].content)
}


//refrencing the current index, update the content of current memo
function saveCurrentVoicely() {
  //save current content in #phraseDiv and set as the new value for the displayed index
  var updateContent = $('#phraseDiv').val()
  memoList[displayedIndex].content = updateContent
  //update local storage with new values
  setLocalStorage()
  console.log(`1. '${memoList[displayedIndex].title}' content auto-saved`)
}


//listen for click on 'new voicely' button
$(document).on('click', '#newVoicelyBtn', function (event) {
  // if no Memo is loaded (start up page) and user clicks new memo, change page scene to 'LoadMemo'
  if (displayedIndex === null && $(this).text().toLocaleLowerCase() === 'new voicely') {
    //update button scene
    pageLoadMemo = true
    updatePageScene()
    //reset button scene variable
    pageLoadMemo = false
    return
  }
  //if no Memo is loaded and user clicks 'cancel', return to start up screen
  if (displayedIndex === null && $(this).text().toLocaleLowerCase() === 'cancel') {
    pageStart = true
    updatePageScene()
    //reset page scene variable
    pageStart = false
    return
  }
  // if a memo is loaded and a user clicks 'new voicely' 
  if (displayedIndex !== null && $(this).text().toLowerCase() === 'new voicely') {
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
  if (displayedIndex !== null && $(this).text().toLowerCase() === 'cancel') {
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
    if (titleApproved) {
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
    if (titleApproved) {
      //update current memo object with new title name
      memoList[displayedIndex].title = newTitle
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
// $('.collection').on('click', '.collection-item', function () {
$('.collection').on('click', '.memo-title', function () {
  findDisplayedIndex()
  selectedTitle = $(this).text()
  //if a memo is selected and the edit title button displays 'edit title',
  //user is not in the middle of changing a current title name, so
  //user is allowed to load memo
  if ($('#editTitleBtn').text().toLowerCase() === 'edit title') {
    //save the text from the list item selected to
    selectedTitle = $(this).text()
    //if no memo is loaded
    if (displayedIndex === null) {
      //find the index of the memo selected
      findDisplayedIndex()
      //if a memo is currently loaded, index will not be null
    } else {
      //check to see if currrent memo content should be updated before loading the selected memo
      saveCurrentVoicely()
      //find the index of the memo selected to load
      findDisplayedIndex()
    }
    //load the page with the index if the Memo selected
    loadVoicelyMemo()
    console.log(`2. '${memoList[displayedIndex].title}' loaded from index-${displayedIndex}`)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    //update page scene
    pageEditContent = true
    updatePageScene()
    //reset page scene variable
    pageEditContent = false
    //refresh page if any delete buttons were activated but not confirmed
    loadMemoList()
  } else {
    //if button does not display text of 'edit title',
    //then user is in the middle of creating a new memo or loading a saved memo
    //alert user and deny loading the selected memo
    $('#alertText').text("*Update 'title' or cancel")
  }
})


//listen for a click on save content button, when clicked updatet the conent value refrenced in displayedIndex
$(document).on('click', '#saveVoicelyBtn', function () {
  saveCurrentVoicely()
})


$('.collection').on('click', '.secondary-content', function () {
  var displayedTitle = $('#voicelyTitle').val()
  //grab the title text and save it in a variable
  var thisTitle = $(this).prev().text()
  var thisIndex
  //comfirm with user if they would like to delete

  //find the index location wher 'thisTitle' is held and store index number it in 'thisIndex'
  for (let i = 0; i < memoList.length; i++) {
    if (memoList[i].title === thisTitle) {
      thisIndex = i
    }
  }
  console.log(thisIndex)
  $('#listItem-' + thisIndex).append($('<p>', {id: 'delete'}))
  $('#delete').text('Delete Memo?').css('color', 'red')
  $('#delete').append($('<button>', { class: 'btn cyan accent-3 waves-effect waves-light deleteBtn', id: 'yesBtn' }))
  $('#yesBtn').css('margin', '0 20px').text('yes')
  $('#delete').append($('<button>', { class: 'btn cyan accent-3 waves-effect waves-light deleteBtn', id: 'noBtn' }))
  $('#noBtn').text('no')

  $('#listItem-' + thisIndex).on('click', '.deleteBtn', function () {
    if ($(this).text() === 'yes') {
      //scenario where the idem displayed is the item being deleted
      if (thisTitle === displayedTitle) {
        //function to remove the deleted index from memoList
        memoList.splice(thisIndex, 1)
        //console.log to confirm deletion for dev purposes
        console.log(memoList)
        //update page scene since displayed content was just deleted
        pageStart = true
        updatePageScene()
        //reset scene variable
        pageStart = false
        displayedIndex = null
        // if memo being deleted is not the current memo displayed
      } else {
        //remove the memo from the index
        memoList.splice(thisIndex, 1)
        console.log(memoList)
      }
      //update localstorage to reflect deleted memo
      setLocalStorage()
      //rebuild the memo list to reflect deleted memo
      loadMemoList()
    }else{
      loadMemoList()
    }
  })
})

$('#content').on('click', '#recordVoicelyBtn', function (){
  if($(this).text().toLowerCase() === 'record title' ){
    console.log('clicked')
  }
})


// load saved memo list on page startup
loadMemoList()
