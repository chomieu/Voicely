// https://emoji-api.com/

function verifyInclude() {
    console.log( "text-parse.js successfully added!" );
};

function voiceSearch( term ) {
    keyword = ''
    //search term from voice is updated on 
    //remove the period from the search term
    keyword = term.slice(0, -1)
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