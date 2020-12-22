// status fields and start button in UI
var startRecognizeOnceAsyncButton;

// subscription key and region for speech services.
var SpeechSDK;
var recognizer;

$("document").ready(function () {
  // Collect variables
  startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");

  $("#startRecognizeOnceAsyncButton").on("click", function() {
    $("#startRecognizeOnceAsyncButton").prop("disabled", true)
    $("#phraseDiv").empty()

    // Use the subscription key and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig
    speechConfig = SpeechSDK.SpeechConfig.fromSubscription("20bad3c2c2a34e2a9ada0c04f778f495", "eastus");
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
        $("#startRecognizeOnceAsyncButton").prop("disabled", false)
        // 
        $("#phraseDiv").text(result.text)
        window.console.log(result)

        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        $("#startRecognizeOnceAsyncButton").prop("disabled", false)
        // Add the error to the div that spells out text
        $("#phraseDiv").text(err)
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
    $("#startRecognizeOnceAsyncButton").prop("disabled", false)

    // Now remove warning and show the content block again.
    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';
  }
});