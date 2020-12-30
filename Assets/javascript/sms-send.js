// Via ClickSend

$( "#smsBtn" ).on( "click", function () {
    var title = $( "#voicelyTitle" ).val() + ":\\n";
    var msg = $( "#phraseDiv" ).val().replace( /\n/g, "\\n" );
    var phoneNumber = prompt( "Enter the number you wish to message, country code and area code first." );

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

    $( "#smsBtn" ).text( "Sending..." );
    $( '#smsBtn' ).prop( "disabled", true );

    $.ajax( settings ).done( function ( response ) {
        console.log( response );
        if ( response.data.messages[ 0 ].status == "SUCCESS" ) {
            $( "#smsBtn" ).text( "Sent!" );
            setTimeout( function() {
                $( "#smsBtn" ).text( "Send SMS" );
                $( '#smsBtn' ).prop( "disabled", false );
            }, 3000 );
        } else {
            alert( "Message failed: " + response.data.messages[ 0 ].status );
            $( '#smsBtn' ).prop( "disabled", false )
        }
    });
});

// // Via Msg91

// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://api.msg91.com/api/v5/flow/",
//     "method": "POST",
//     "headers": {
//       "authkey": "9176AT7HNzoyK5fece4edP123",
//       "content-type": "application/json"
//     },
//     "processData": false,
//     "data": "Testing testing testing!"
//   }
  
//   $.ajax(settings).done(function (response) {
//     console.log(response);
//   });