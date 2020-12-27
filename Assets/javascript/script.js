// Global variables
var SpeechSDK;
var recognizer;
var emojiList;

$("document").ready(function () {

  // key option 1
  var APIkey = '2b307e3e19a6de2e97c409b817d0a381eec4b0e1'
  // key option 2
  // var APIkey = '8b4259ccd704fd17cd7ad399e0ee00b9dd83faab';
  // emojiURL option 1
  // var emojiURL = `https://emoji-api.com/emojis?search=${x}&access_key=${APIkey}`;
  // emojiURL option 2
  var emojiURL = `https://emoji-api.com/emojis?access_key=${APIkey}`;

  $.get(emojiURL).then(function (emResponse) {
    emojiList = emResponse;
    console.log(emojiList);
    // If the emoji API server is down, use the response stored in "emoji.json" as a backup 
  }).fail(function () {
    emojiList = emojiS;
  })

  $("#recordVoicelyBtn").on("click", function () {
    $("#recordVoicelyBtn").prop("disabled", true)
    // Use the subscription key and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("20bad3c2c2a34e2a9ada0c04f778f495", "eastus");
    // Set speech recognition language to US English
    speechConfig.speechRecognitionLanguage = "en-US"
    // Add the user's microphone input
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    // Create the SpeechRecognizer object
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Start the voice recognition method. May need to replace with StartContinuousRecognitionAsync later on for more prolonged recognition
    recognizer.recognizeOnceAsync(
      // If we're successful.
      function (result) {
        // Make the button to start speech recognition work again.
        $("#recordVoicelyBtn").prop("disabled", false)
        // Voicesearch takes the text results and the full list of emojis as arguments.
        voiceSearch(result.privText, emojiList);
        window.console.log(result)

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        $("#recordVoicelyBtn").prop("disabled", false)
        // Add the error to the div that spells out text
        $("#phraseDiv").text(err)
        // log error to the console.
        window.console.log(err);

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      });
  });


  //--------START---Dynamically add list items to the page----------
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

  function loadList(){
    //clear contents of list
    $('#savedList').empty()
    // lighten-3 to darken-3 to lighten-2 on loop cor continuous color pattern in new list items
    var colorClass = ['lighten-3','lighten-2','lighten-1','','darken-1','darken-2','darken-3','darken-2','darken-1','','lighten-1','lighten-2']
    //start on colorClass index 0
    var x=0

    for (let i = 0; i < listItems.length; i++) {
      //if x === 11 then reset x to 0 to loop color pattern
      if (x === 11){
        x=0
      }
      //append new list item & add text
      $('#savedList').append($('<li>', {class: 'collection-item cyan ' + colorClass[x] , id:'listItem-'+i}))
      $('#listItem-'+i).text(listItems[i].title)
      //append link to new li
      $('#listItem-'+i).append($('<a>', { href:'#!', class: 'secondary-content', id:'listLink-'+i}))
      //append icon to link
      $('#listLink-'+i).append($('<i>', {class: 'material-icons', id:'listIcon-'+i}))
      //set icon text to clear
      $('#listIcon-'+i).text('clear')
      //increment x for the next line item color pattern
      x++
    }
  }

  loadList()
  
  //listen for click to add new voicly session
  $(document).on('click', '#newVoicelyBtn', function(event){
    //save the text value of the title input
    var newTitle = $(this).prev().val()
    //if there is text content, add a new object with title name to our saved user data
    if (newTitle !== ''){
      var newObject = {
        title: newTitle,
        content: ''
      }
      listItems.push(newObject)
      //update user list
      loadList()
    }

  })
  
//------END---dynamically added list items------------
});