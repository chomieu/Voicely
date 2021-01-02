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
    // console.log( a );
    console.log(emojiList);
    // If the emoji API server is down, use the response stored in "emoji.json" as a backup 
  }).fail(function () {
    emojiList = emojiS;
  }).then(function () {
    // Always adds the content of characters.json.
    characterS.forEach((obj) => emojiList.push(obj));
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

    
  // Search for and show memos that match the search term, hide all others
  $("#search").keyup(function () {
    var filter = $("#search").val().toUpperCase();
    $("li > span").each( function() {
      if ($(this).text().toUpperCase().indexOf(filter) > -1) {
        $(this).parent().show()
      } else {
        $(this).parent().hide()
      }
    })
  })


  // Clicking the X in a modal
  $( "#close" ).on( "click", function() {
    closeModal();
  });

})

/* Functions for modals */
function modalConfirm( text, trueFunc, falseFunc ) {
  $( "#custom-modal-header" ).text( "Confirm" );
  $( "#custom-modal" ).css( "display", "block" );
  var confirmButton = $( "<button>", { class: "modal-button", id: "custom-modal-confirm-button" } ).text( "Confirm" );
  var denyButton = $( "<button>", { class: "modal-button", id: "custom-modal-deny-button" } ).text( "Cancel" );
  confirmButton.attr( "data-bool", true );
  denyButton.attr( "data-bool", false );
  $( "#custom-modal-content" ).append( confirmButton );
  $( "#custom-modal-content" ).append( denyButton );
  $( ".modal-button" ).click( function() {
    if ( $( this ).attr( "data-bool" ) == "true" ) {
      trueFunc();
    } else {
      falseFunc();
    }
    closeModal();
  })
}

function modalPrompt( text, func ) {
  $( "#custom-modal-header" ).text( "Prompt" );
  $( "#custom-modal-text" ).text( text );
  var customContent = $( "#custom-modal-content" );
  var form = $( "<form>", { class: "modal-form", id: "custom-modal-form", method: "POST" } );
  var formInput = $( "<input>", { class: "modal-input", id: "custom-modal-input" } );
  customContent.append( form );
  form.append( formInput );
  $( "#custom-modal" ).css( "display", "block" );
  form.on( "submit", function( e ) {
    e.preventDefault();
    var data = $( "#custom-modal-input" ).val();
    func( data );
    closeModal( form );
  })
}

function modalAlert( text ) {
  $( "#custom-modal-header" ).text( "Alert" );
  $( "#custom-modal-text" ).text( text );
  $( "#custom-modal" ).css( "display", "block" );
}

function closeModal() {
  // Collects all non-standard elements (modals past children[ 2 ])
  var modalElements = $( "#custom-modal-content" )[ 0 ].children;
  // Delete all non-standard elements in the modal. Loop must be run backwards so we don't delete as we're iterating.
  for ( i = modalElements.length - 1; i > 2; i-- ) {
    modalElements[ i ].remove();
  }
  $( "#custom-modal-header" ).text( "" );
  $( "#custom-modal-text" ).text( "" );
  $( "#custom-modal" ).css( "display", "none" );
}