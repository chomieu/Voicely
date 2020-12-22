// https://emoji-api.com/

function verifyInclude() {
    console.log( "text-parse.js successfully added!" );
};

// Takes in a string, matches a regex with any phrases in it, then returns emojis created from those matches to the #emoji-display div.
function voiceSearch( matchText, emojiObject ) {
    // construct our RegEx of the keyphrase.
    var regEx = /symbol emoji \w+ emoji/g;
    console.log( "Initial RegEx: ", regEx );
    console.log( "Text to match: ", matchText );
    var matchArray = matchText.match( regEx );
    var emojiArray = []
    console.log( "Array of matched phrases: ", matchArray );
    if ( matchArray ) {
        // Iterate over matchArray and build an array of keywords to replace.
        for ( var i = 0; i < matchArray.length; i++ ) {
            var strippedString = matchArray[ i ].substring( 13, matchArray[ i ].length - 6 );
            console.log( "Matched string stripped of symbol words: ", strippedString );
            for ( var j = 0; j < emojiList.length; j++ ) {
                if ( emojiObject[ j ].unicodeName == strippedString ) {
                    emojiArray.push( emojiObject[ j ].character );
                }
            }
        };
        console.log( "Array of emojis: ", emojiArray );
        // Iterate over matchArray, and replace all instances of matchArray[ i ] in matchText with emojiArray[ i ].
        var newText = matchText;
        for ( var i = 0; i < matchArray.length; i++ ) {
            var regEx2 = new RegExp( matchArray[ i ] );
            console.log( regEx2 );
            newText = newText.replace( regEx2, emojiArray[ i ] );
            console.log( emojiArray[ i ] );
        }
        // Place the result text in the #phraseDiv
        console.log( "Text to be placed in #phraseDiv: ", newText );
        $( "#phraseDiv" ).text( newText );
    }
}
  
$('#emoji-submit').on('click', function (event) {
    event.preventDefault(event)

    var emojiSearch = $(this).prev().val()
    console.log(emojiSearch)
    // requestEmoji(emojiSearch)
})