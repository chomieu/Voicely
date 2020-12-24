// https://emoji-api.com/

function verifyInclude() {
    console.log( "text-parse.js successfully added!" );
};

// Takes in a string, matches a regex with any phrases in it, then returns emojis created from those matches to the #emoji-display div.
function voiceSearch( matchText, emojiObject ) {
    // construct our RegEx of the keyphrase.
    var regEx = /(S|s)ymbol[s]?[,]? [\w+ ]+emoji/g;
    console.log( "1. ******** NEW CALL OF voiceSearch ********");
    console.log( "2. Initial RegEx: ", regEx );
    console.log( "3. Text to match: ", matchText );
    var matchArray = matchText.match( regEx );
    var emojiArray = []
    console.log( "Array of matched phrases: ", matchArray );
    var oldText = $( "#phraseDiv" ).text();
    if ( matchArray ) {
        console.log( "4. Entered matchArray if statement" );
        // Iterate over matchArray and build an array of keywords to replace.
        for ( var i = 0; i < matchArray.length; i++ ) {
            /* Small note that the strippedString declaration might cause trouble down the line. 
            It works well because the trim method strips the whitespace that can result from the 
            voice recognition API inserting commas after or pluralizing the word "symbol," but if both happen
            or users manage to do something else that inserts a second character after "symbol," it could 
            mess up the results being put into #phraseDiv. */
            var strippedString = matchArray[ i ].substring( 7, matchArray[ i ].length - 6 ).trim();
            console.log( "5. Matched string stripped of symbol words: ", strippedString );
            var dashedString = strippedString.replace( /\s/g, "-" );
            console.log( "6. Matched string with dashes instead of spaces: ", dashedString );
            for ( var j = 0; j < emojiObject.length; j++ ) {
                if ( emojiObject[ j ] == dashedString ) {
                    emojiArray.push( emojiObject[ j ].character );
                }
            }
        };
        console.log( "7. Array of emojis: ", emojiObject);
        // Iterate over matchArray, and replace all instances of matchArray[ i ] in matchText with emojiArray[ i ].
        var newText = matchText;
        for ( var i = 0; i < matchArray.length; i++ ) {
            var regEx2 = new RegExp( matchArray[ i ] );
            console.log( "8. RegEx I'm using to replace content of newText with emoji: ", regEx2 );
            console.log( "9. The emoji I'm using for it: ", emojiObject[ i ] );
            if ( emojiObject[ i ] ) {
                newText = newText.replace( regEx2, emojiObject[ i ] );
            } else {
                newText = newText.replace( regEx2, strippedString );
            }
        }
        // Place the result text in the #phraseDiv
        console.log( "10. Text to be placed in #phraseDiv: ", newText );
        var oldText = $( "#phraseDiv" ).text();
        $( "#phraseDiv" ).text( `${ oldText } ${ newText }`);
    } else if ( oldText ) {
        $( "#phraseDiv" ).text( `${ oldText } ${ matchText }` );
    } else {
        $( "#phraseDiv" ).text( `${ matchText }` );
    }
    console.log( "******** END ********");
}
  
$('#emoji-submit').on('click', function (event) {
    event.preventDefault(event)

    var emojiSearch = $(this).prev().val()
    console.log(emojiSearch)
    // requestEmoji(emojiSearch)
})