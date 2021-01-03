// https://emoji-api.com/

// Takes in a string, matches a regex with any phrases in it, then returns emojis created from those matches to the #emoji-display div.
function voiceSearch( matchText, emojiObjects ) {
    // Undo Microsoft's questionable decision to replace "smiley face" with ":)".
    console.log( "Smiley face test match? ", /:\)/.test( matchText ) );
    if ( /:\)/.test( matchText ) ) {
        console.log( "Entered if statement for smiley match" );
        matchText = matchText.replace( /:\)/g, "slightly smiling face" );
    }
    // construct our RegEx of the keyphrase.
    // var regEx = /(S|s)ymbol[s]?[,]? (E\d0 )?[\w+( |,|\.|\?|!)]+?(E|e)moji/g;
    var regEx = /(V|v)oice[,]? (L|l)(ee||i)[s]?[,]? (E\d0 )?[\w+( |,|\.|\?|!)]+?((E|e)moji|(S|s)ymbol)\.?/g;
    console.log( "1. ******** NEW CALL OF voiceSearch ********");
    console.log( "2. Initial RegEx: ", regEx );
    console.log( "3. Text to match: ", matchText );
    var matchArray = matchText.match( regEx );
    var emojiArray = [];
    console.log( "Array of matched phrases: ", matchArray );
    // Gets the current contents of the div, in case there was already content there before running voiceSearch.
    var oldText = $( "#phraseDiv" ).val();
    console.log( "oldText:", oldText );
    // If the RegEx has at least one match AND an emojiObjects has been passed in (the latter shouldn't be a problem anymore since Chomie added the cached emoji.json file, but it's a nice failsafe in case we use this function in other contexts).
    if ( matchArray && emojiObjects ) {
        console.log( "4. Entered matchArray if statement" );
        // Iterate over matchArray and build an array of keywords to replace.
        for ( var i = 0; i < matchArray.length; i++ ) {
            /* This complicated line of code preps the matched string to be converted into an emoji or symbol slug. It takes the matched string and does the following: */
            // - The substring() method call removes the "speech tags" by removing everything BEFORE the SECOND instance of whitespace, and removing everything AFTER the LAST instance of whitespace.
            // - The trim() method removes all whitespace from either end of the string resulting from the substring() method. 
            // - The replace() method removes all commas.
            // - toLowerCase() converts everything to lowercase letters.
            var strippedString = matchArray[ i ].substring( matchArray[ i ].indexOf( " ", matchArray[ i ].indexOf( " " ) + 1 ), matchArray[ i ].lastIndexOf( " " ) ).trim().replace( /,/g, "" ).toLowerCase();
            console.log( "5. Matched string stripped of symbol words and commas, and set to lowercase: ", strippedString );
            // In case the user is using variants of the standard emojis.
            if ( /e\d0/.test( strippedString ) ) {
                /* Insert a space after the first number so that inserting dashes in the place of spaces gets us
                the proper format for an emoji slug. */
                strippedString = strippedString.slice( 0, 2) + " " + strippedString.slice( 2, strippedString.length );
            };
            console.log( "6. strippedString, with spaces inserted for emoji variant tag: ", strippedString );
            // Replaces all spaces with dashes to create a string that corresponds with the "slug" key for emojis in the emojiObjects array.
            var dashedString = strippedString.replace( /\s/g, "-" );
            console.log( "7. Matched string with dashes instead of spaces: ", dashedString );
            // Iterates over entire emojiObjects array looking for slugs that match the "dashed" version of what was said.
            var matchFound = false;
            for ( var j = 0; j < emojiObjects.length; j++ ) {
                // The following if statement first searches the "variant" property in emoji objects stored in
                // emojiObjects array.
                if ( "variants" in emojiObjects[ j ] ) {
                    var variantObj = emojiObjects[ j ].variants;
                    for ( var k = 0; k < variantObj.length; k++ ) {
                        if ( variantObj[ k ].slug == dashedString ) {
                            emojiArray.push( variantObj[ k ].character );
                            matchFound = true;
                        }
                    };
                };
                if ( emojiObjects[ j ].slug == dashedString ) {
                    emojiArray.push( emojiObjects[ j ].character );
                    matchFound = true;
                }
            };
            if ( !matchFound ) {
                emojiArray.push( undefined );
            }
        };
        console.log( "8. Array of emojis: ", emojiArray );
        // Iterate over matchArray, and replace all instances of matchArray[ i ] in matchText with emojiArray[ i ], where they exist.
        var newText = matchText;
        for ( var i = 0; i < matchArray.length; i++ ) {
            var regEx2 = new RegExp( matchArray[ i ] );
            console.log( "9. RegEx I'm using to replace content of newText with emoji: ", regEx2 );
            console.log( "10. The emoji I'm using for it: ", emojiArray[ i ] );
            if ( emojiArray[ i ] ) {
                newText = newText.replace( regEx2, emojiArray[ i ] );
            } else {
                newText = newText.replace( regEx2, strippedString );
            }
        }
        // Remove punctuation from new line speech tags that have them immediately afterward.
        // Periods (.) are already accounted for in the RegEx.
        newText = newText.replace( /\n(\?|!|,)(\s)?/, "\n" );
        newText = newText.replace( /- (\?|!|,)(\s)?/, "- ");
        // Place the result text in the #phraseDiv
        console.log( "11. Text to be placed in #phraseDiv: ", newText );
        $( "#phraseDiv" ).val( `${ oldText } ${ newText }`);
    } else if ( oldText ) {
        $( "#phraseDiv" ).val( `${ oldText } ${ matchText }` );
    } else {
        $( "#phraseDiv" ).val( `${ matchText }` );
    }
    console.log( "******** END ********");
}
  
$('#emoji-submit').on('click', function (event) {
    event.preventDefault(event)

    var emojiSearch = $(this).prev().val()
    console.log(emojiSearch)
    // requestEmoji(emojiSearch)
})