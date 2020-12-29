  //--------START---Dynamically add list items to the page----------
  //variable to track current index position being used for title and text area
  var currentIndex
  var newTitle
  var newTitleBtnToggle = true
  var editTitleBtnToggle = false
  var phraseDivEnabled = false
  //example object for storing titles and content
  var memoList = [{
    title: 'GroceryList',
    content: 'snacks',
  },{
    title:'Christmas List',
    content: 'World peace',
  },{
    title:'To Do',
    content: 'Work on Voicely project',
  },{
    title:'Why Westley is the cutest',
    content: 'Facts',
  },{
    title:'5 Cutest Wildcat Species',
    content: 'Sandcats'
  }]

  // display all listItem[x].title to the screen
  function loadList(){
    //clear contents of list
    $('#savedList').empty()
    // color class names ordered to create the list item background fade effect
    var colorClass = ['lighten-3','lighten-2','lighten-1','','darken-1','darken-2','darken-3','darken-2','darken-1','','lighten-1','lighten-2']
    //start on colorClass index 0
    var x=0

    for (let i = 0; i < memoList.length; i++) {
      //if x === 11 then reset x to 0 to loop color pattern again
      if (x === 11){
        x=0
      }
      //append new list item & add text
      $('#savedList').append($('<li>', {class: 'collection-item cyan ' + colorClass[x] , id:'listItem-'+i}))
      $('#listItem-'+i).text(memoList[i].title)
      //append link to new li
      $('#listItem-'+i).append($('<a>', { href:'#!', class: 'secondary-content', id:'listLink-'+i}))
      //append icon to link
      $('#listLink-'+i).append($('<i>', {class: 'material-icons', id:'listIcon-'+i,}))
      //set icon text to clear
      $('#listIcon-'+i).text('clear')
      //increment x for the next line item color pattern
      x++
    }
  }
  
  loadList()

function changePageScene() {

    // console.log(`newBtn = ${newTitleBtnToggle}, editBtn = ${editTitleBtnToggle}`)

    //START-UP - Scene to create a new Voicely or load a saved session
    if (newTitleBtnToggle === false && editTitleBtnToggle === false && phraseDivEnabled === false ) {
        $('#editTitleBtn').text('Edit title')
        $("#voicelyTitle").prop("disabled", true)
        $("#editTitleBtn").prop("disabled", true)
        $('#editTitleBtn').text('Edit title')
        $("#newVoicelyBtn").prop("disabled", false)
        $("#newVoicelyBtn").text("new entry")
        $('#phraseDiv').prop("disabled", true)

        console.log('Scene: START-UP - Create new Voicely or select a  saved session')
        return
    }

    //LOAD - Scene to create a new Voicely memo, or cancel and return to START-UP SCREEN
    if (newTitleBtnToggle === true && editTitleBtnToggle === true && phraseDivEnabled === false) {
        $("#voicelyTitle").prop("disabled", false)
        $("#editTitleBtn").prop("disabled", false)
        $('#editTitleBtn').text('Save title')
        $("#newVoicelyBtn").prop("disabled", false)
        $("#newVoicelyBtn").text("cancel")
        $('#phraseDiv').prop("disabled", true)
        $('#recordVoicelyBtn').prop("disabled", true)
        $('#saveVoicelyBtn').prop("disabled", true)
        
        console.log('Scene: LOADING - Create a new Voicely Memo or cancel to return to startup')
        return
    }

    if (newTitleBtnToggle === true && editTitleBtnToggle === false) {
        
        console.log('')
        return
    }

    //EDIT TITLE - Scene to edit the title of an existing memo
    if (newTitleBtnToggle === false && editTitleBtnToggle === true && phraseDivEnabled === false) {
        $("#voicelyTitle").prop("disabled", false)
        $("#editTitleBtn").prop("disabled", false)
        $('#editTitleBtn').text('Save title')
        
        console.log('Scene: EDIT TITLE - Edit the title of current memo')
        return
    }
    //EDIT MEMO - Scene for working on a current Voicely memo
    if (newTitleBtnToggle === false && editTitleBtnToggle === false && phraseDivEnabled === true) {
        $('#editTitleBtn').text('Edit title')
        $("#voicelyTitle").prop("disabled", true)
        $("#editTitleBtn").prop("disabled", false)
        $('#editTitleBtn').text('Edit title')
        $("#newVoicelyBtn").prop("disabled", false)
        $("#newVoicelyBtn").text("new entry")
        $('#phraseDiv').prop("disabled", false)
        $('#recordVoicelyBtn').prop("disabled", false)
        $('#saveVoicelyBtn').prop("disabled", false)

        console.log('Scene: EDIT MEMO - edit current memo')

        return
    }
    
}


$(document).on('click', '#newVoicelyBtn', function (event) {
    // from STARTUP Scene to LOAD Scene
    if (newTitleBtnToggle === true && editTitleBtnToggle === false && phraseDivEnabled === false) {
        editTitleBtnToggle = true
        console.log(`newTitle: ${editTitleBtnToggle}, editTitle: ${editTitleBtnToggle}, phraseDivEnabled: ${phraseDivEnabled}`)
        changePageScene()
        newTitleBtnToggle = false
        editTitleBtnToggle = false
        console.log(`newTitle: ${editTitleBtnToggle}, editTitle: ${editTitleBtnToggle}, phraseDivEnabled: ${phraseDivEnabled}`)
        return
    }
    
    if (newTitleBtnToggle === false && editTitleBtnToggle === false && phraseDivEnabled === true) {
      console.log(`newTitle: ${editTitleBtnToggle}, editTitle: ${editTitleBtnToggle}, phraseDivEnabled: ${phraseDivEnabled}`)
      newTitleBtnToggle = true
      editTitleBtnToggle = true
      phraseDivEnabled = false
        changePageScene()
        return
    }
})
  

function approveNewTitle() {
    var titleApproved = true
    editTitleBtnToggle = true
    console.log(`newTitle: ${editTitleBtnToggle}, editTitle: ${editTitleBtnToggle}, phraseDivEnabled: ${phraseDivEnabled}`)
    changePageScene()

    if (newTitle === '') {
        titleApproved = false
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
    if (titleApproved){
        createNewVoicely()
    }
}


function createNewVoicely(){
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
    newTitleBtnToggle = false
    editTitleBtnToggle = false
    phraseDivEnabled = true
    console.log(`newTitle: ${editTitleBtnToggle}, editTitle: ${editTitleBtnToggle}, phraseDivEnabled: ${phraseDivEnabled}`)
    changePageScene()
}


$(document).on('click', '#editTitleBtn', function (event) {
    //save the text value of the title input
    newTitle = $(this).prev().prev().val()
    approveNewTitle()
})


//------END-------dynamically added list items------------



//------START------load/save content-------------------

//listen for a click on any saved session
$('.collection').on('click', '.collection-item', function(){
  //collects text from the entire li 
  var selectedTitle = $(this).text()
  // I could not figure out how to only focus on the li text content (title name). It always included the icon text of 'clear' as well.
  //our 'x' icon contains the text 'clear', this is to  remove the word 'clear' from $(this).text()
  selectedTitle = selectedTitle.substring(0, selectedTitle.length - 5)
  //compare selectedTitle 'text' to our titles in our memoList array, if it matches, save the index location to currentIndex
  for (let i = 0; i < memoList.length; i++) {
    if(memoList[i].title === selectedTitle){
      currentIndex = i
      console.log(`index-${currentIndex}; title: ${memoList[currentIndex].title}`)
    }
  }

  loadVoicelyMemo()
})

//refrencing the currentIndex, load the title and content values to the screen of whatever list item the user clicks
function loadVoicelyMemo(){
  $('#voicelyTitle').val(memoList[currentIndex].title)
  $('#phraseDiv').val('')
  $('#phraseDiv').val(memoList[currentIndex].content)
}

function saveCurrentVoicely(){
    var updateContent = $('#phraseDiv').val()
    console.log(updateContent)
    memoList[currentIndex].content = updateContent
    console.log(memoList[currentIndex])

}

//listen for a click on save content button, when clicked updatet the conent value refrenced in currentIndex
$(document).on('click', '#saveVoicelyBtn', function(){
    saveCurrentVoicely()
})

//------END------load/save content------------