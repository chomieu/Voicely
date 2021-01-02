$( "#smsBtn" ).on( "click", function () {
    modalPrompt( "Enter the phone number you'd like to send a text to: ", sendSMS );
});

function sendSMS( phoneNumber ) {
    // Get the title, then add a newline and colon so it's clearly separated from the message body.
    var title = $( "#voicelyTitle" ).val() + ":\\n";
    // Get the message, but replace newlines with escaped versions so they don't mess up the JSON.
    var msg = $( "#phraseDiv" ).val().replace( /\n/g, "\\n" );

    // Build our settings call to the ClickSend API. Splitting up the data property onto different lines screwed things up, so I left it as one big one.
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://clicksend.p.rapidapi.com/sms/send",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "authorization": "Basic dGltb3RoeS5tLmtlbGxlckBnbWFpbC5jb206UEV4JngzMzoqbkxfUz5haA==",
            "x-rapidapi-key": "a2a34f4933msh333c2c428bc117bp12a9bcjsn34c45b2ac466",
            "x-rapidapi-host": "clicksend.p.rapidapi.com"
        },
        "processData": false,
        "data": "{\n\"messages\":[\n{\n\"source\":\"mashape\",\n\"from\": \"Voicely\",\n\"body\":\"" + title + msg + "\",\n\"to\": \"+" + phoneNumber + "\",\n\"schedule\": \"1452244637\",\n\"custom_string\": \"\"\n}\n]\n}"
    };

    // User feedback to show the button is working. Also keeps people from spamming the SMS button.
    $( "#smsBtn" ).text( "Sending..." );
    $( '#smsBtn' ).prop( "disabled", true );

    $.ajax( settings ).done( function ( response ) {
        console.log( response );
        // This API doesn't give fail responses for many unsent message results, so we need to build them into the section for successful ones.
        if ( response.data.messages[ 0 ].status == "SUCCESS" ) {
            $( "#smsBtn" ).text( "Sent!" );
            setTimeout( function() {
                resetSmsButton();
            }, 3000 );
        } else {
            modalAlert( "Message failed: " + response.data.messages[ 0 ].status );
            resetSmsButton();
        }
    // Only happens if the API bugs out or something's wrong with our key.
    }).fail( function( e ) {
        console.log( e );
        modalAlert( "Message failed: " + e.responseJSON.http_code + ": " + e.responseJSON.response_msg );
        resetSmsButton();
    });
}

// We need to reset the content and disabled status of the SMS button so much, might as well make a function.
function resetSmsButton() {
    $( "#smsBtn" ).text( "Send SMS" );
    $( '#smsBtn' ).prop( "disabled", false );
}