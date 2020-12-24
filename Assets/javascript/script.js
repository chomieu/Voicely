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
  var emojiURL = `https://emoji-api.com/emojis?access_key=${ APIkey }`;

  $.get( emojiURL ).then( function ( emResponse ) {
    emojiList = emResponse;
    console.log( emojiList );
  })

  $("#recordVoicelyBtn").on("click", function() {
    $("#recordVoicelyBtn").prop("disabled", true)
    $("#phraseDiv").empty()
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
        voiceSearch( result.privText, emojiList );
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

  // Text Editor Tool
  tinymce.init({
    selector: '#phraseDiv',
    plugins: 'autolink lists media table',
    toolbar: 'addcomment showcomments casechange code formatpainter',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    inline: true,
    draggable_modal: true,
    mobile: {
      menubar: true
    }
  });
});