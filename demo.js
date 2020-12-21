// List of pitches in the fourth octave
// [ 261.6256 ], // C4
// [ 277.1826 ], // C#4
// [ 293.665 ], // D4
// [ 311.1270 ], // D#4
// [ 329.6276 ], // E4
// [ 349.2282 ], // F4
// [ 369.9944 ], // F#4
// [ 391.9954 ], // G4
// [ 415.3047 ], // G#4
// [ 440.0000 ], // A4
// [ 466.1638 ], // A#4
// [ 493.8833 ] // B4

score = [
    [ 329.6276, 500 ], // E4
    [ 329.6276, 500 ], // E4
    [ 349.2282, 500 ], // F4
    [ 391.9954, 500 ], // G4
    [ 391.9954, 500 ], // G4
    [ 349.2282, 500 ], // F4
    [ 329.6276, 500 ], // E4
    [ 293.665, 500 ], // D4
    [ 261.6256, 500 ], // C4
    [ 261.6256, 500 ], // C4
    [ 293.665, 500 ], // D4
    [ 329.6276, 500 ], // E4
    [ 329.6276, 750 ], // E4
    [ 293.665, 250 ], // D4
    [ 293.665, 1000 ] // D4
]

// score = [
//     [ 329.6276, 1000 ], // E4
//     [ 293.665, 750 ], // D4
//     [ 261.6256, 500 ], // C4
//     [ 293.665, 250 ], // D4
//     [ 329.6276, 500 ], // E4
//     [ 329.6276, 500 ], // E4
//     [ 329.6276, 1000 ] // E4
// ]

var button = $( "<button>" );
button.text( "Click Me" );

$( "body" ).append( button );

$( button ).click( function() {
    var beatIndex = 0;
    var duration;
    var timer = setInterval( function() {
        console.log( score[ beatIndex ] );
        console.log( score[ beatIndex ][ 0 ] );
        console.log( score[ beatIndex ][ 1 ] );
        duration = score[ beatIndex ][ 1 ];
        var context = new AudioContext();
        var o = context.createOscillator();
        var g = context.createGain();
        o.connect( g );
        g.connect( context.destination );
        o.type = "square";
        o.frequency.value = score[ beatIndex ][ 0 ];
        o.connect(context.destination);
        o.start( 0 );

        setTimeout( function() {
            g.gain.exponentialRampToValueAtTime( 0.00001, context.currentTime + 0.04 );
            o.stop();
        }, score[ beatIndex ][ 1 ] ); // length the note is held for

        beatIndex++;

        if ( beatIndex >= score.length ) {
            clearInterval( timer );
        }
    }, score[ beatIndex ][ 1 ] );
});