// API Documentation: https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest
var key = "20bad3c2c2a34e2a9ada0c04f778f495"
var region = "eastus"

// status fields and start button in UI
var phraseDiv;
var startRecognizeOnceAsyncButton;

// subscription key and region for speech services.
var subscriptionKey, serviceRegion;
var authorizationToken;
var SpeechSDK;
var recognizer;
//sjf added 12/14 - saves a single word recording to use in emoji search
var searchTerm;

document.addEventListener("DOMContentLoaded", function () {
  // Collect variables
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
  subscriptionKey = document.getElementById("subscriptionKey");
  serviceRegion = document.getElementById("serviceRegion");
  phraseDiv = document.getElementById("phraseDiv");

  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    startRecognizeOnceAsyncButton.disabled = true;
    phraseDiv.innerHTML = "";

    // if we got an authorization token, use the token. Otherwise use the provided subscription key
    // and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig;
    if (authorizationToken) {
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion.value);
    } else {
      if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
        alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
        return;
      }
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);
    }

    speechConfig.speechRecognitionLanguage = "en-US";
    // Add the user's microphone input
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    // Create the SpeechRecognizer object
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Start the voice recognition method. May need to replace with StartContinuousRecognitionAsync later on for more prolonged recognition
    recognizer.recognizeOnceAsync(
      // If we're successful.
      function (result) {
        // Make the button to start speech recognition work again.
        startRecognizeOnceAsyncButton.disabled = false;
        // 
        phraseDiv.innerHTML += result.text;
        window.console.log(result);

        //save result key work as a text field
        console.log(result)
        //sjf save search term in a variable
        searchTerm = result.privText
        //sjf run emoji search with voice term
        voiceSearch()


        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        startRecognizeOnceAsyncButton.disabled = false;
        // Add the error to the div that spells out text
        phraseDiv.innerHTML += err;
        // log error to the console.
        window.console.log(err);

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      });
  });

  // If window.SpeechSDK is present, set the SpeechSDK variable to point to it and make the button work.
  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    // Now remove warning and show the content block again.
    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';
  }
});

function voiceSearch() {
  keyword = ''
  //search term from voice is updated on 
  //remove the period from the search term
  keyword = searchTerm.slice(0, -1)
  console.log(keyword)
  requestEmoji(keyword)
}


var emojiSearch = ''
var emojiDisplay = ''

$('#emoji-submit').on('click', function (event) {
  event.preventDefault(event)

  var emojiSearch = $(this).prev().val()
  console.log(emojiSearch)
  requestEmoji(emojiSearch)
})


function requestEmoji(x) {
  //key option 1
  // var APIkey = '2b307e3e19a6de2e97c409b817d0a381eec4b0e1'
  //key option 2
  var APIkey = '8b4259ccd704fd17cd7ad399e0ee00b9dd83faab'
  var emojiURL = `https://emoji-api.com/emojis?search=${x}&access_key=${APIkey}`

  $.get(emojiURL).then(function (response) {
    console.log(response)
    var emojiArray = []

    $('#emoji-display').text('')

    if (emojiArray.length !== null) {

      //save emoji responses to an array
      for (let i = 0; i < response.length; i++) {
        emojiArray.push(response[i].character)
      }
      //display emoji's on screen
      $('#emoji-display').text(emojiArray)
    } else {
      $('#emoji-display').text('try again')
    }

  })

}
