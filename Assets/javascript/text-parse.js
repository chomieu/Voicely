// https://emoji-api.com/

// Takes in a string, matches a regex with any phrases in it, then returns emojis created from those matches to the #emoji-display div.
function voiceSearch( matchText, emojiObject ) {
    // construct our RegEx of the keyphrase.
    var regEx = /(S|s)ymbol[s]?[,]? (E\d0 )?[\w+( |,|\.|\?|!)]+?emoji/g;
    console.log( "1. ******** NEW CALL OF voiceSearch ********");
    console.log( "2. Initial RegEx: ", regEx );
    console.log( "3. Text to match: ", matchText );
    var matchArray = matchText.match( regEx );
    var emojiArray = [];
    console.log( "Array of matched phrases: ", matchArray );
    // Gets the current contents of the div, in case there was already content there before running voiceSearch.
    var oldText = $( "#phraseDiv" ).text();
    console.log( "oldText:", oldText );
    // If the RegEx has at least one match AND an emojiObject has been passed in (the latter shouldn't be a problem anymore since Chomie added the cached emoji.json file, but it's a nice failsafe in case we use this function in other contexts).
    if ( matchArray && emojiObject ) {
        console.log( "4. Entered matchArray if statement" );
        // Iterate over matchArray and build an array of keywords to replace.
        for ( var i = 0; i < matchArray.length; i++ ) {
            /* Small note that the strippedString declaration might cause trouble down the line. 
            It works well because the trim method strips the whitespace that can result from the 
            voice recognition API inserting commas after or pluralizing the word "symbol," but if both happen
            or users manage to do something else that inserts a second character after "symbol," it could 
            mess up the results being put into #phraseDiv. */
            var strippedString = matchArray[ i ].substring( 7, matchArray[ i ].length - 6 ).trim();
            if ( /E\d0/.test( strippedString ) ) {
                // Make everything lower-case and insert a space after the number.
                strippedString = strippedString.toLowerCase();
                strippedString = strippedString.slice( 0, 2) + " " + strippedString.slice( 2, strippedString.length );
            };
            console.log( "5. Matched string stripped of symbol words: ", strippedString );
            var dashedString = strippedString.replace( /\s/g, "-" );
            console.log( "6. Matched string with dashes instead of spaces: ", dashedString );
            // Iterates over entire emojiObject looking for slugs that match the "dashed" version of what was said.
            for ( var j = 0; j < emojiObject.length; j++ ) {
                if ( "variants" in emojiObject[ j ] ) {
                    var variantObj = emojiObject[ j ].variants;
                    for ( var k = 0; k < variantObj.length; k++ ) {
                        if ( variantObj[ k ].slug == dashedString ) {
                            emojiArray.push( variantObj[ k ].character );
                        };
                    };
                };
                if ( emojiObject[ j ].slug == dashedString ) {
                    emojiArray.push( emojiObject[ j ].character );
                };
            };
        };
        console.log( "7. Array of emojis: ", emojiArray );
        // Iterate over matchArray, and replace all instances of matchArray[ i ] in matchText with emojiArray[ i ].
        var newText = matchText;
        for ( var i = 0; i < matchArray.length; i++ ) {
            var regEx2 = new RegExp( matchArray[ i ] );
            console.log( "8. RegEx I'm using to replace content of newText with emoji: ", regEx2 );
            console.log( "9. The emoji I'm using for it: ", emojiArray[ i ] );
            if ( emojiArray[ i ] ) {
                newText = newText.replace( regEx2, emojiArray[ i ] );
            } else {
                newText = newText.replace( regEx2, strippedString );
            }
        }
        // Remove punctuation from new line speech tags that have them immediately afterward.
        newText = newText.replace( /\n(\.|\?|!)/, "\n" );
        newText = newText.replace( /- (\.|\?|!)/, "- ");
        // Place the result text in the #phraseDiv
        console.log( "10. Text to be placed in #phraseDiv: ", newText );
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