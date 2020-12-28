  //--------START---Dynamically add list items to the page----------
  //variable to track current index position being used for title and text area
  var currentIndex
  //example object for storing titles and content
  var listItems = [{
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

    for (let i = 0; i < listItems.length; i++) {
      //if x === 11 then reset x to 0 to loop color pattern again
      if (x === 11){
        x=0
      }
      //append new list item & add text
      $('#savedList').append($('<li>', {class: 'collection-item cyan ' + colorClass[x] , id:'listItem-'+i}))
      $('#listItem-'+i).text(listItems[i].title)
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
  
  
  //listen for 'click' to add new voicly session title
  $(document).on('click', '#newVoicelyBtn', function(event){
    //save the text value of the title input
    var newTitle = $(this).prev().val()
    var titleApproved = true
    console.log(`New title name: ${newTitle}`)

      if( newTitle === ''){
        titleApproved = false
        alert(`Title can not be blank, please enter a title name.`)
      }

      if (titleApproved){
        for (let i = 0; i < listItems.length; i++) {
          if( listItems[i].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim() ){
            titleApproved = false
            console.log(`The title: '${listItems[i].title}', already exists at index ${i}`)
            alert(`"${newTitle}" already exists, please enter a different title.`)
          }
        }
      }

      if(titleApproved){
        var newObject = {
            title: newTitle,
            content: ''
          }
          //add the new session to our listItems
          listItems.push(newObject)
          //update currentIndex to refrence our newly created index
          currentIndex = listItems.length-1
          console.log(`current index is ${currentIndex}, title: ${listItems[currentIndex].title}`)
          loadList()
      }
        console.log(`new title approved: ${titleApproved}`)
        titleApproved = true
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
  //compare selectedTitle 'text' to our titles in our listItems array, if it matches, save the index location to currentIndex
  for (let i = 0; i < listItems.length; i++) {
    if(listItems[i].title === selectedTitle){
      currentIndex = i
      console.log(`index-${currentIndex}; title: ${listItems[currentIndex].title}`)
    }
  }

  loadListItem()
})

//refrencing the currentIndex, load the title and content values to the screen of whatever  list item the user clicks
function loadListItem(){
  $('#voicelyTitle').val(listItems[currentIndex].title)
  $('#phraseDiv').val('')
  $('#phraseDiv').val(listItems[currentIndex].content)
}

//listen for a click on save content button, when clicked updatet the conent value refrenced in currentIndex
$(document).on('click', '#saveVoicelyBtn', function(){
  var updateContent = $('#phraseDiv').val()
  console.log(updateContent)
  listItems[currentIndex].content = updateContent
  console.log(listItems[currentIndex])
})

//------END------load/save content------------