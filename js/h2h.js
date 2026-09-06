document.addEventListener("DOMContentLoaded", function () {
 
    // variables
    var inputField = document.getElementById('input-field');
    var textField = document.getElementById('main-text-field');
    var letters = document.getElementsByClassName('letter');
    var cursor = document.getElementsByClassName('cursor');
    var lettersContainer = document.getElementById('ltrcontainer');
    var infoMsgText = document.getElementById('infoMsg');
    var scoreField = document.getElementById('score');
    var wrongField = document.getElementById('wrong');
    var WPMField = document.getElementById('WPM');
    var CPMField = document.getElementById('CPM');
    var infoWPM = document.getElementById('infoWPM');
    var Player1ProgressBar = document.getElementById('P1Progress');
    var BarP1Prog = document.getElementById('BarP1Prog');
    var TimerMin = document.getElementById('TimerMin');
    var TimerSec = document.getElementById('TimerSec');
    var adBoardLeft = document.getElementById('adBoardLeft');
    var logoLeft = document.getElementById('logoLeft');
    var profileImgCont = document.getElementById('profileImgCont');
    var profileImg = document.getElementById('profileImg');
    var MWPMSeconds = 0;
    var MWPMScore = 0;
    var swedishWords;
    var englishWords;
    var score = 0;
    var wrong = 0;
    var blinksActive = 0;
    var blinky;
    var _WPMseconds;
    var WPMactive = 0;
    var WPMscore = 0;
    var charPM = 0;
    var seconds = 0;
    var TimerSeconds = 0;
    var TimerMinutes = 0;
    var PreviousKey;
    var PreviousLocation;
    var stringOfWords = '';
    var Progress = 0;
    var ProgScore = 0;
    var interval = null;
    var called = false;
    
    // BUG! OLD WORDS BLIR KVAR VID SPRÅKBYTE
    // Ifsats för om settings är satt annars default english
    $.getJSON("php/h2hWords.json", function (data) {
      h2hWords = JSON.parse(JSON.stringify(data));
     var count = Object.keys(h2hWords).length;
     if (firstVisit === 'true') { 
        GenerateWords(h2hWords, count);
         
        firstVisit = 'false';
        } else if (firstVisit === 'false' && localStorage.getItem('oldWords') !== null) {
         lettersContainer.innerHTML = localStorage.getItem('oldWords');  
        } else {
        GenerateWords(h2hWords, count);
        }
    });
    
    //if click
    document.addEventListener('click', function (e) {

        if (e.target == textField || e.target == lettersContainer || e.target == infoMsgText) {
              
            // InputField är aktiv
            inputField.focus();
            textField.classList.add('active');
            infoMsgText.style.display = 'none';
            inputBlink();
            WordsPerMinute(seconds, 'on');
        } else {
            // InputField är inte aktiv
            inputField.blur();
            textField.classList.remove('active');
            infoMsgText.style.display = 'block';
            inputBlink();
            WordsPerMinute(seconds, 'off');
        }
    });

    //actual blink
    function blink() {
        for (var i = 0; i < cursor.length; i++) {
            if (!cursor[i].classList.contains('input-blink')) {
            cursor[i].classList.add('input-blink');    
            } else if (cursor[i].classList.contains('input-blink')) {
                cursor[i].classList.remove('input-blink');
            }  
        }
    }

    //input blinking function
    function inputBlink() {
        if (textField.classList.contains('active')) {
            blinksActive = blinksActive + 1
            if (blinksActive == 1) {
                blinky = setInterval(blink, 350);
            }
        } else {
            clearInterval(blinky);
            for (var i = 0; i < cursor.length; i++) {
                if (cursor[i].classList.contains('input-blink')) {
                    cursor[i].classList.remove('input-blink');
                }
            }
            blinksActive = 0;
        }
    }

    //onkeyup på input kör logKey
    inputField.onkeyup = logKeyUp;
    inputField.onkeydown = logKeyDown;
    
    function doBackSpace(keyCode) {
    console.log('BS triggered!');
    for (var i = 0; i < cursor.length; i++) {
    for (var n = 0; n < letters.length; n++) {
                    if (cursor[i].id == letters[n].id) {
                        var lettersLength = letters.length - 1;
                        if (n !== lettersLength) {
                            var prev = n - 1
                            
                            if (prev > -1) {
                            console.log(prev + ' > 0'); 
                            letters[n].classList.remove('cursor');
                            
                            //Släcker NextKeyLight om inte 2 bokstaver i rad
                            if (letters[prev].innerHTML !== letters[n].innerHTML) {
                            NextKeyLight(letters[n].innerHTML, 'off');
                            MoveFinger(letters[n].innerHTML, 'off');
                            }
                            
                            //Föregående boxtav: Ny NextKey och flytta markör
                            NextKeyLight(letters[prev].innerHTML, 'on');
                            MoveFinger(letters[prev].innerHTML, 'on');
                            letters[prev].classList.remove('past');
                            letters[prev].classList.add('cursor');
                            letters[prev].classList.add('input-blink');
                            } else {
                            console.log(prev + ' < 0');
                            console.log('EJ triggad!');    
                            }
                            
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            break;
                            }
                }
            } 
        }        
    }
    
    //input hantering KEYDOWN!!
    function logKeyDown (keypress) {
      
    //Backspace handling    
    if (keypress.keyCode == 8) {    
    doBackSpace(keypress.keyCode);
            
    }

    //Preventing Tabbing
     if (keypress.keyCode == 9) {
    keypress.preventDefault();
                                }
    //Preventing Alt fuckery
     if (keypress.keyCode == 18) {
    keypress.preventDefault();
                                }
    //Setting CapsLock state
    if (keypress.keyCode == 20) {
     var CapsLock = document.getElementById('CapsLock');
    if (keypress.getModifierState('CapsLock')) {
    CapsLock.classList.add('Active');
     } else {
     CapsLock.classList.remove('Active');
     }  
    }
    //Setting NumLock state  
    if (keypress.keyCode == 144) {
     var CapsLock = document.getElementById('NumLock');
    if (keypress.getModifierState('NumLock')) {
    CapsLock.classList.add('Active');
     } else {
     CapsLock.classList.remove('Active');
     }  
    }     
    KeyboardLight(keypress.keyCode, 'down', keypress.location);
    }
    
    //input hantering KEYUP!!
    function logKeyUp (keypress) {
    
    // remove keyboardlight on keyup
    KeyboardLight(keypress.keyCode, 'up', keypress.location);
        
    //Matcha mot ord
    for (var i = 0; i < cursor.length; i++) {
            
         
            //IF MATCHED WITH KEY
            if (cursor[i].innerHTML == keypress.key && keypress.key !== 'Shift' && keypress.key !== 'Control' && keypress.key !== 'CapsLock' && keypress.key !== 'Alt' && keypress.key !== 'AltGraph' && keypress.key !== 'Backspace') {
                
                for (var n = 0; n < letters.length; n++) {
                    if (cursor[i].id == letters[n].id) {
                        
                        score = score + 1;
                        scoreField.innerHTML = score;
                        var lettersLength = letters.length - 1;
                        if (n !== lettersLength) {
                            PlayerProgress(letters.length);
                            var next = n + 1
                            letters[n].classList.add('past');
                            letters[n].classList.remove('cursor');
                            
                            if (letters[n].classList.contains('wrong')) {
                            letters[n].classList.remove('wrong');    
                            }
                            
                            //Släcker NextKeyLight om inte 2 bokstaver i rad
                            if (letters[next].innerHTML !== letters[n].innerHTML) {
                            NextKeyLight(letters[n].innerHTML, 'off');
                            MoveFinger(letters[n].innerHTML, 'off');
                            }
                            
                            //Nästa boxtav: Ny NextKey och flytta markör
                            NextKeyLight(letters[next].innerHTML, 'on');
                            MoveFinger(letters[next].innerHTML, 'on');
                            letters[next].classList.add('cursor');
                            letters[next].classList.add('input-blink');
                            
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            break;
                            } 
                        
                else {
                            console.log('End of letters! w');
                            letters[n].classList.remove('cursor');
                            NextKeyLight(letters[n].innerHTML, 'off');
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            PlayerProgressReset();
                           GenerateWords(englishWords, 30);
                         //GenerateWords(swedishWords, 30);
                            break;
                        }
                    }
                }
            }
            //ELSE IF MATCHED TO WRONGSPACE
            else if (cursor[i].innerHTML == createWrongspace(TextSize) && keypress.key == ' ' && keypress.key !== 'Shift' && keypress.key !== 'Control' && keypress.key !== 'CapsLock' && keypress.key !== 'Alt' && keypress.key !== 'AltGraph' && keypress.key !== 'Backspace') {          
                               
                console.log('MATCH TO WrongSpace! Cursor html: ' + cursor[i].innerHTML + " = Keypress.key:" + keypress.key);
                             
                NextKeyLight(' ', 'off');
                
                for (var n = 0; n < letters.length; n++) {
                    if (cursor[i].id == letters[n].id) {
                                        
                        score = score + 1;
                        scoreField.innerHTML = score;
                        var lettersLength = letters.length - 1;
                        if (n !== lettersLength) {
                            var next = n + 1
                            cursor[i].innerHTML = removeWrongspace(TextSize);
                            NextKeyLight(letters[next].innerHTML, 'on');
                            letters[n].classList.remove('cursor');
                            letters[next].classList.add('cursor');
                            letters[next].classList.add('input-blink');
                            
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            break;
                        } else {
                            console.log('End of letters! w');
                            letters[n].classList.remove('cursor');
                            NextKeyLight(letters[n].innerHTML, 'off');
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            PlayerProgressReset();
                            GenerateWords(englishWords, 30);
                            //GenerateWords(swedishWords, 30);
                            break;
                        }
                    }
                }
            //ELSE IF NOT MACHED (REST)
            } else if (cursor[i].innerHTML !== keypress.key && keypress.key !== 'Shift' && keypress.key !== 'Control' && keypress.key !== 'CapsLock' && keypress.key !== 'Alt' && keypress.key !== 'AltGraph' && keypress.key !== 'Backspace') {               
                console.log('NOT A MATCH (rest)!!! Cursor html: ' + cursor[i].innerHTML + " = Keypress.key:" + keypress.key);
                
                KeyboardLight(keypress.keyCode, 'wrong', keypress.location);
                
                for (var n = 0; n < letters.length; n++) {
                    if (cursor[i].id == letters[n].id) {
                        wrong = wrong + 1;
                        next = n + 1;
                        wrongField.innerHTML = wrong;
                        if (cursor[i].innerHTML == ' ') {
                            cursor[i].innerHTML = createWrongspace(TextSize);
                            letters[n].classList.add('wrong');
                            letters[n].classList.remove('cursor');
                            NextKeyLight(letters[n].innerHTML, 'off');
                            letters[next].classList.add('cursor');
                            
                           if (letters[n].classList.contains('input-blink')) {
                            letters[n].classList.remove('input-blink');
                            } 
                        
                        } else {
                            letters[n].classList.add('wrong');
                            letters[n].classList.remove('cursor');
                            NextKeyLight(letters[n].innerHTML, 'off');
                            if (next !== letters.length) {
                            letters[next].classList.add('cursor');
                            } else {
                            PlayerProgressReset();    
                            GenerateWords(englishWords, 30);
                            }
                            
                           if (letters[n].classList.contains('input-blink')) {
                            letters[n].classList.remove('input-blink');
                            }  
                        }
                        var lettersLength = letters.length - 1;
                        if (n !== lettersLength) {
                            break;
                        } 
                        
                        /*
                        else {
                            console.log('End of letters! f');
                            letters[n].classList.remove('cursor');
                            NextKeyLight(letters[n].innerHTML, 'off');
                            if (letters[n].classList.contains('input-blink')) {
                                letters[n].classList.remove('input-blink');
                            }
                            PlayerProgressReset();
                            //GenerateWords(englishWords, 30);
                            GenerateWords(swedishWords, 30);
                            break;
                        }
                        */
                        
                    }
                }
            }
            break;
        }
    }
    
    //Genererar ord från JSON  
    function GenerateWords(wordJSON, wordAmount) {
        var wordsArray = [];
        var lettersArray = [];
        var bigArray = [];
        var bigHTML = '';
        var count = Object.keys(wordJSON).length;
        console.log('wordJSON Count = '+ count);
        for (i = 0; i < wordAmount; i++) {
            rand = Math.floor(Math.random() * count);
            if (i == 0) {
                stringOfWords = wordJSON[rand].word;
            } else {
                stringOfWords = stringOfWords + ' ,' + wordJSON[rand].word
            }
        }
        console.log('string: ' + stringOfWords);
        wordsArray = stringOfWords.split(",");

        for (k = 0; k < wordsArray.length; k++) {
            lettersArray = wordsArray[k].split("");
            bigArray[k] = lettersArray     
        }
        
        NextKeyLight(bigArray[0][0], 'on');
        MoveFinger(bigArray[0][0], 'on');
        
        var id = 1;
        var bigId = 0;
        // id behöver vara site wide och inte per letter array
        for (l = 0; l < bigArray.length; l++) {
            for (j = 0; j < bigArray[l].length; j++) {
                if (j == 0 && l == 0) {

                    bigHTML = bigHTML + '<span id="Ltr' + id + '" class="letter cursor">' + bigArray[l][j] + '</span>';
                    id = id + 1;
                } else if (bigArray[l][j] == ' ') {
                    bigHTML = bigHTML + '<span id="Ltr' + id + '" class="letter specialChar space">' + bigArray[l][j] + '</span>';
                    id = id + 1;
                } else {
                    bigHTML = bigHTML + '<span id="Ltr' + id + '" class="letter">' + bigArray[l][j] + '</span>';
                    id = id + 1;
                }

            }
            bigId = bigId + id;
        }
        localStorage.setItem('oldWords', bigHTML);      
        lettersContainer.innerHTML = bigHTML;
    }
    
    function WordsPerMinute(seconds, state) {
        if (state === 'on' && WPMactive == 0) {
            WPMactive = WPMactive + 1;
           _WPMseconds = setInterval(WPMseconds, 1000);        
            console.log('WPM STATE = ' + state);
        } else if (state === 'off') {
            WPMactive = 0;
            clearInterval(_WPMseconds);
            console.log('WPM STATE = ' + state);
        }
    }

    function WPMseconds() {
        seconds = seconds + 1;
        TimerTick();
        WPMminutes = seconds / 60;
        WPMwords = scoreField.innerHTML / 5;
        charPM = scoreField.innerHTML / WPMminutes;
        WPMscore = WPMwords / WPMminutes;
        WPMField.innerHTML = Math.round(WPMscore);
        
        if (charPM > CPMField.innerHTML ) {
        CPMField.innerHTML = Math.round(charPM);
        }
        if (Math.round(WPMscore) > infoWPM.innerHTML ) {
        infoWPM.innerHTML = Math.round(WPMscore);    
        }
        
        }
    
    function TimerTick () {
       if (TimerSeconds === 59) {
        TimerSeconds = 0;   
        TimerSec.innerHTML = ':0' + TimerSeconds;   
        TimerMinutes = TimerMinutes + 1;
        TimerMin.innerHTML = TimerMinutes;   
       }   
        TimerSeconds = TimerSeconds + 1;
        if ( TimerSeconds < 10 ) {
        TimerSec.innerHTML = ':0' + TimerSeconds;   
        } else {
        TimerSec.innerHTML = ':' + TimerSeconds;  
        }     
   }
     
    function clearWrongKey(keyId)  {
    keyId.classList.remove('fade');
    }
    
    function NextKeyLight(key, state) {
    switch (key) {
    //Swedish keyboard
    //ROW 1
    case '§': case '½':
    var keyId = document.getElementById('Backquote');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '1': case '!':
    var keyId = document.getElementById('num1');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '2': case '"': case '@':
    var keyId = document.getElementById('num2');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '3': case '#': case '£':
    var keyId = document.getElementById('num3');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '4': case '¤': case '$':
    var keyId = document.getElementById('num4');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '5': case '%':
    var keyId = document.getElementById('num5');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '6': case '&':
    var keyId = document.getElementById('num6');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '7': case '/': case '{':
    var keyId = document.getElementById('num7');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '8': case '(': case '[':
    var keyId = document.getElementById('num8');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '9': case ')': case ']':
    var keyId = document.getElementById('num9');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '0': case '=': case '}':
    var keyId = document.getElementById('num0');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '+': case '?': case '\\':
    var keyId = document.getElementById('Plus');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case '´': case '`':
    var keyId = document.getElementById('Accent');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;           
    
    // Not added: / * - (numpad)      
            
    //ROW 2        
    // TAB Not added
    case 'Q': case 'q': 
    var keyId = document.getElementById('KeyA');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'W': case 'w': 
    var keyId = document.getElementById('KeyW');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'E': case 'e': 
    var keyId = document.getElementById('KeyE');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'R': case 'r': 
    var keyId = document.getElementById('KeyR');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'T': case 't': 
    var keyId = document.getElementById('KeyT');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'Y': case 'y': 
    var keyId = document.getElementById('KeyY');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'U': case 'u': 
    var keyId = document.getElementById('KeyU');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'I': case 'i': 
    var keyId = document.getElementById('KeyI');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'O': case 'o': 
    var keyId = document.getElementById('KeyO');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'P': case 'p': 
    var keyId = document.getElementById('KeyP');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'Å': case 'å': 
    var keyId = document.getElementById('KeyÅ');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break; 
    case '¨': case '^': case '~':
    var keyId = document.getElementById('Diaeresis');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    // ENTER Not added
    // Numpad 7 8 9 + Not added         
            
    //ROW 3        
    case 'A': case 'a': 
    var keyId = document.getElementById('KeyA');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'S': case 's': 
    var keyId = document.getElementById('KeyS');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'D': case 'd': 
    var keyId = document.getElementById('KeyD');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'F': case 'f': 
    var keyId = document.getElementById('KeyF');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'G': case 'g': 
    var keyId = document.getElementById('KeyG');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'H': case 'h': 
    var keyId = document.getElementById('KeyH');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'J': case 'j': 
    var keyId = document.getElementById('KeyJ');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'K': case 'k': 
    var keyId = document.getElementById('KeyK');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'L': case 'l': 
    var keyId = document.getElementById('KeyL');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'Ö': case 'ö': 
    var keyId = document.getElementById('KeyÖ');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'Ä': case 'ä': 
    var keyId = document.getElementById('KeyÄ');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case '\'': case '*': 
    var keyId = document.getElementById('Apostrophe');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    // Not added 4 5 6 (numpad)
            
    //Row 4
    case '<': case '>': case '|':
    var keyId = document.getElementById('< | >');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    case 'Z': case 'z':
    var keyId = document.getElementById('KeyZ');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;        
    case 'X': case 'x':
    var keyId = document.getElementById('KeyX');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case 'C': case 'c':
    var keyId = document.getElementById('KeyC');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case 'V': case 'v':
    var keyId = document.getElementById('KeyV');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case 'B': case 'b':
    var keyId = document.getElementById('KeyB');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case 'N': case 'n':
    var keyId = document.getElementById('KeyN');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break; 
    case 'M': case 'm':
    var keyId = document.getElementById('KeyM');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case ',': case ';':
    var keyId = document.getElementById('Comma');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;         
    case '.': case ':':
    var keyId = document.getElementById('Period');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break; 
    case '-': case '_':
    var keyId = document.getElementById('Hyphen');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;  
    // Not added: ArrowUp 1 2 3 (numpad)        
    // ROW 5
    case ' ':
    var keyId = document.getElementById('Space');
    if (state === 'on') { keyId.classList.add('NextKey'); }
    if (state === 'off') { keyId.classList.remove('NextKey'); }
    break;
    //Not added: LeftCtrl LeftAlt RightAlt RightCtrl Arrow: left down right Numpad: 0 ,         
    default:    
    break;            
    }    
        
    }
    
    function MoveFinger(key, state) {
    var Finger1 = document.getElementById('FingerMark1');
    var Finger2 = document.getElementById('FingerMark2');
    var Finger3 = document.getElementById('FingerMark3');
    var Finger4 = document.getElementById('FingerMark4');    
    var Finger5 = document.getElementById('FingerMark5');  
    var Finger6 = document.getElementById('FingerMark6');
    var Finger7 = document.getElementById('FingerMark7');
    var Finger8 = document.getElementById('FingerMark8');    
    var Finger9 = document.getElementById('FingerMark9');
    var Finger10 = document.getElementById('FingerMark10');
        
    //NO SPECIAL CHARS ADDED JOBBA HÄR    
    switch (key) {
    // ROW 1 (numerals) not added (yet)
    // ROW 2
    case 'Q': case 'q':
    if (state === 'on') {        
    Finger1.setAttribute('x', 28);
    Finger1.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger1.setAttribute('x', 35);
    Finger1.setAttribute('y', 45);   
    }
    break;   
                  
    case 'W': case 'w':
    if (state === 'on') {        
    Finger2.setAttribute('x', 70);
    Finger2.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger2.setAttribute('x', 76);
    Finger2.setAttribute('y', 45);   
    }
    break;   
        
    case 'E': case 'e':
    if (state === 'on') {        
    Finger3.setAttribute('x', 112);
    Finger3.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger3.setAttribute('x', 119);
    Finger3.setAttribute('y', 45);   
    }
    break;
    
    case 'R': case 'r':
    if (state === 'on') {        
    Finger4.setAttribute('x', 154);
    Finger4.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger4.setAttribute('x', 160);
    Finger4.setAttribute('y', 45);   
    }
    break;
            
    case 'T': case 't':
    if (state === 'on') {        
    Finger4.setAttribute('x', 196);
    Finger4.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger4.setAttribute('x', 160);
    Finger4.setAttribute('y', 45);   
    }
    break;
    
    case 'Y': case 'y':
    if (state === 'on') {        
    Finger6.setAttribute('x', 238);
    Finger6.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger6.setAttribute('x', 286);
    Finger6.setAttribute('y', 45);   
    }
    break;        
    
    case 'U': case 'u':
    if (state === 'on') {        
    Finger6.setAttribute('x', 280);
    Finger6.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger6.setAttribute('x', 286);
    Finger6.setAttribute('y', 45);   
    }
    break;           
    
    case 'I': case 'i':
    if (state === 'on') {        
    Finger7.setAttribute('x', 322);
    Finger7.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger7.setAttribute('x', 327);
    Finger7.setAttribute('y', 45);   
    }
    break;        
    
    case 'O': case 'o':
    if (state === 'on') {        
    Finger8.setAttribute('x', 364);
    Finger8.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger8.setAttribute('x', 370);
    Finger8.setAttribute('y', 45);   
    }
    break;           
     
    case 'P': case 'p':
    if (state === 'on') {        
    Finger9.setAttribute('x', 406);
    Finger9.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger9.setAttribute('x', 413);
    Finger9.setAttribute('y', 45);   
    }
    break;              
    
    case 'Å': case 'å':
    if (state === 'on') {        
    Finger9.setAttribute('x', 448);
    Finger9.setAttribute('y', 4);
    } else if (state === 'off') {
    Finger9.setAttribute('x', 413);
    Finger9.setAttribute('y', 45);   
    }
    break;
            
    //ROW 3
    // A S D F Not needed        
    case 'G': case 'g':
    if (state === 'on') {        
    Finger4.setAttribute('x', 203);
    Finger4.setAttribute('y', 45);
    } else if (state === 'off') {
    Finger4.setAttribute('x', 160);
    Finger4.setAttribute('y', 45);   
    }
    break;        
    
    case 'H': case 'h':
    if (state === 'on') {        
    Finger6.setAttribute('x', 245);
    Finger6.setAttribute('y', 45);
    } else if (state === 'off') {
    Finger6.setAttribute('x', 286);
    Finger6.setAttribute('y', 45);   
    }
    break;            
    
    // J K L Ö Not needed        
    case 'Ä': case 'ä':
    if (state === 'on') {        
    Finger9.setAttribute('x', 455);
    Finger9.setAttribute('y', 45);
    } else if (state === 'off') {
    Finger9.setAttribute('x', 413);
    Finger9.setAttribute('y', 45);   
    }
    break; 
    
    // ROW4
    case 'Z': case 'z':
    if (state === 'on') {        
    Finger1.setAttribute('x', 57);
    Finger1.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger1.setAttribute('x', 35);
    Finger1.setAttribute('y', 45);   
    }
    break; 
    
    case 'X': case 'x':
    if (state === 'on') {        
    Finger2.setAttribute('x', 99);
    Finger2.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger2.setAttribute('x', 76);
    Finger2.setAttribute('y', 45);   
    }
    break;         
            
    case 'C': case 'c':
    if (state === 'on') {        
    Finger3.setAttribute('x', 141);
    Finger3.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger3.setAttribute('x', 119);
    Finger3.setAttribute('y', 45);   
    }
    break;          
    
    case 'V': case 'v':
    if (state === 'on') {        
    Finger4.setAttribute('x', 183);
    Finger4.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger4.setAttribute('x', 160);
    Finger4.setAttribute('y', 45);   
    }
    break;         
    
    case 'B': case 'b':
    if (state === 'on') {        
    Finger4.setAttribute('x', 225);
    Finger4.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger4.setAttribute('x', 160);
    Finger4.setAttribute('y', 45);   
    }
    break;         
     
    case 'N': case 'n':
    if (state === 'on') {        
    Finger6.setAttribute('x', 267);
    Finger6.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger6.setAttribute('x', 286);
    Finger6.setAttribute('y', 45);   
    }
    break;          
    
    case 'M': case 'm':
    if (state === 'on') {        
    Finger6.setAttribute('x', 309);
    Finger6.setAttribute('y', 89);
    } else if (state === 'off') {
    Finger6.setAttribute('x', 286);
    Finger6.setAttribute('y', 45);
    }
    break;     
            
    default:    
    break;       
    }
    }
    function KeyboardLight(key, state, location) {
         
  switch (key) {
  //ROW 1
  case 220:
    var keyId = document.getElementById('Backquote');
    var keyIdFade = document.getElementById('BackquoteFade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 49:
    var keyId = document.getElementById('num1');
    var keyIdFade = document.getElementById('num1Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 50:
    var keyId = document.getElementById('num2');
    var keyIdFade = document.getElementById('num2Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 51:
    var keyId = document.getElementById('num3');
    var keyIdFade = document.getElementById('num3Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 52:
    var keyId = document.getElementById('num4');
    var keyIdFade = document.getElementById('num4Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 53:
    var keyId = document.getElementById('num5');
    var keyIdFade = document.getElementById('num5Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 54:
    var keyId = document.getElementById('num6');
    var keyIdFade = document.getElementById('num6Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 55:
    var keyId = document.getElementById('num7');
    var keyIdFade = document.getElementById('num7Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 56:
    var keyId = document.getElementById('num8');
    var keyIdFade = document.getElementById('num8Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 57:
    var keyId = document.getElementById('num9');
    var keyIdFade = document.getElementById('num9Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 48:
    var keyId = document.getElementById('num0');
    var keyIdFade = document.getElementById('num0Fade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 187:
    var keyId = document.getElementById('Plus');
    var keyIdFade = document.getElementById('PlusFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 219:
    var keyId = document.getElementById('Accent');
    var keyIdFade = document.getElementById('AccentFade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;         
  case 8:
    var keyId = document.getElementById('Backspace');
    var keyIdFade = document.getElementById('BackspaceFade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 45:          
    if (location == 0) {
    var keyId = document.getElementById('Insert');
    var keyIdFade = document.getElementById('InsertFade');    
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('Numpad0');
    var keyIdFade = document.getElementById('Numpad0Fade');
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') { keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
    keyIdFade.classList.add('fade');
    setTimeout(() => clearWrongKey(keyIdFade), 750);
                   }
    }                 
    break;
  case 36:
    if (location == 0) {
    var keyId = document.getElementById('Home');
    var keyIdFade = document.getElementById('HomeFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('Numpad7');
    var keyIdFade = document.getElementById('Numpad7Fade');
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') { keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
    keyIdFade.classList.add('fade');
    setTimeout(() => clearWrongKey(keyIdFade), 750);
                   }
    }              
    break;
  case 33:
    if (location == 0) {
    var keyId = document.getElementById('PageUp');
    var keyIdFade = document.getElementById('PageUpFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('Numpad9');
    var keyIdFade = document.getElementById('Numpad9Fade');   
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') { keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
    keyIdFade.classList.add('fade');
    setTimeout(() => clearWrongKey(keyIdFade), 750);
                   }
    }         
    break;
  case 144:
    var keyId = document.getElementById('NumLock');
    var keyIdFade = document.getElementById('NumLockFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 111:
    var keyId = document.getElementById('NumpadDivide');
    var keyIdFade = document.getElementById('NumpadDivideFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 106:
    var keyId = document.getElementById('NumpadMultiply');
    var keyIdFade = document.getElementById('NumpadMultiplyFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 109:
    var keyId = document.getElementById('NumpadSubtract');
    var keyIdFade = document.getElementById('NumpadSubtractFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
    //ROW 2
  case 9:
    var keyId = document.getElementById('Tab');
    var keyIdFade = document.getElementById('TabFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 81:
    var keyId = document.getElementById('KeyQ');
    var keyIdFade = document.getElementById('KeyQFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 87:
    var keyId = document.getElementById('KeyW');
    var keyIdFade = document.getElementById('KeyWFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 69:
    var keyId = document.getElementById('KeyE');
    var keyIdFade = document.getElementById('KeyEFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 82:
    var keyId = document.getElementById('KeyR');
    var keyIdFade = document.getElementById('KeyRFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 84:
    var keyId = document.getElementById('KeyT');
    var keyIdFade = document.getElementById('KeyTFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 89:
    var keyId = document.getElementById('KeyY');
    var keyIdFade = document.getElementById('KeyYFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }                 
    break;
  case 85:
    var keyId = document.getElementById('KeyU');
    var keyIdFade = document.getElementById('KeyUFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }   
    break;
  case 73:
    var keyId = document.getElementById('KeyI');
    var keyIdFade = document.getElementById('KeyIFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 79:
    var keyId = document.getElementById('KeyO');
    var keyIdFade = document.getElementById('KeyOFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 80:
    var keyId = document.getElementById('KeyP');
    var keyIdFade = document.getElementById('KeyPFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 221:
    var keyId = document.getElementById('KeyÅ');
    var keyIdFade = document.getElementById('KeyÅFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 186:
    var keyId = document.getElementById('Diaeresis');
    var keyIdFade = document.getElementById('DiaeresisFade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 13:
    if (location == 0) {
    var keyId = document.getElementById('Enter');
    var keyIdFade = document.getElementById('EnterFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }    
    }
    if (location == 3) {
    var keyId = document.getElementById('NumpadEnter');
    var keyIdFade = document.getElementById('NumpadEnterFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }    
    }
    break;       
  case 46:
    if (location == 0) {
    var keyId = document.getElementById('Delete');
    var keyIdFade = document.getElementById('DeleteFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('NumpadDecimal');
    var keyIdFade = document.getElementById('NumpadDecimalFade');
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
    document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
    document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') { keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
    keyIdFade.classList.add('fade');
    setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }       
    break;

  case 35:
    if (location == 0) {
    var keyId = document.getElementById('End');
    var keyIdFade = document.getElementById('EndFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('Numpad1');
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') { keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
 document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
 document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }         
    break;
  case 34:
    if (location == 0) {
    var keyId = document.getElementById('PageDown');
    var keyIdFade = document.getElementById('PageDownFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 3) {
    var keyId = document.getElementById('Numpad3');
    var keyIdFade = document.getElementById('Numpad3Fade');
    if (state === 'down') { keyId.classList.add('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
    document.getElementById('ShiftLeft').classList.add('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
    document.getElementById('ShiftRight').classList.add('pressed');
                   }
        }
    if (state === 'up') {
    keyId.classList.remove('pressed');
    if (PreviousKey == 16 && PreviousLocation == 1) {
    document.getElementById('ShiftLeft').classList.remove('pressed');
                   }
    if (PreviousKey == 16 && PreviousLocation == 2) {
    document.getElementById('ShiftRight').classList.remove('pressed');
                   }
        }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }                  
    break;
  case 103:
    var keyId = document.getElementById('Numpad7');
    var keyIdFade = document.getElementById('Numpad7Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 104:
    var keyId = document.getElementById('Numpad8');
    var keyIdFade = document.getElementById('Numpad8Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 105:
    var keyId = document.getElementById('Numpad9');
    var keyIdFade = document.getElementById('Numpad9Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 107:
    var keyId = document.getElementById('NumpadAdd');
    var keyIdFade = document.getElementById('NumpadAddFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  //ROW 3
  case 20:
    var keyId = document.getElementById('CapsLock');
    var keyIdFade = document.getElementById('CapsLockFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 65:
    var keyId = document.getElementById('KeyA');
    var keyIdFade = document.getElementById('KeyAFade');
    var FingerMarkId = document.getElementById('FingerMark1');
    if (state === 'down') { 
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
          
        }
    break;
  case 83:
    var keyId = document.getElementById('KeyS');
    var keyIdFade = document.getElementById('KeySFade');
    var FingerMarkId = document.getElementById('FingerMark2');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {       
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }          
    break;
  case 68:
    var keyId = document.getElementById('KeyD');
    var keyIdFade = document.getElementById('KeyDFade');      
    var FingerMarkId = document.getElementById('FingerMark3');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
        }                
    break;
  case 70:
    var keyId = document.getElementById('KeyF');
    var keyIdFade = document.getElementById('KeyFFade');      
    var FingerMarkId = document.getElementById('FingerMark4');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
        }   
    break;
  case 71:
    var keyId = document.getElementById('KeyG');
    var keyIdFade = document.getElementById('KeyGFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 72:
    var keyId = document.getElementById('KeyH');
    var keyIdFade = document.getElementById('KeyHFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 74:
    var keyId = document.getElementById('KeyJ');
    var keyIdFade = document.getElementById('KeyJFade');      
    var FingerMarkId = document.getElementById('FingerMark5');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');                 
       }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
        }
    break;
  case 75:
    var keyId = document.getElementById('KeyK');
    var keyIdFade = document.getElementById('KeyKFade');      
    var FingerMarkId = document.getElementById('FingerMark6');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {    
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
    }
    break;
  case 76:
    var keyId = document.getElementById('KeyL');
    var keyIdFade = document.getElementById('KeyLFade');      
    var FingerMarkId = document.getElementById('FingerMark7');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
        }
    break;
  case 192:
    var keyId = document.getElementById('KeyÖ');
    var keyIdFade = document.getElementById('KeyÖFade');      
    var FingerMarkId = document.getElementById('FingerMark8');
    if (state === 'down') {
        keyId.classList.add('pressed');
        FingerMarkId.classList.add('pressed');
    }
    if (state === 'up') {
        keyId.classList.remove('pressed');
        FingerMarkId.classList.remove('pressed');
    }
    if (state === 'wrong') {     
        keyIdFade.classList.add('fade');
        
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        
        }           
    break;
  case 222:
    var keyId = document.getElementById('KeyÄ');
    var keyIdFade = document.getElementById('KeyÄFade');      
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 191:
    var keyId = document.getElementById('Apostrophe');
    var keyIdFade = document.getElementById('ApostropheFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 100:
    var keyId = document.getElementById('Numpad4');
    var keyIdFade = document.getElementById('Numpad4Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 101:
    var keyId = document.getElementById('Numpad5');
    var keyIdFade = document.getElementById('Numpad5Fade');  
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 102:
    var keyId = document.getElementById('Numpad6');
    var keyIdFade = document.getElementById('Numpad6Fade');   
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
    //ROW4
  case 16:
    if (location == 1) {
    var keyId = document.getElementById('ShiftLeft');
    var keyIdFade = document.getElementById('ShiftLeftFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }
    if (location == 2) {
    var keyId = document.getElementById('ShiftRight');
    var keyIdFade = document.getElementById('ShiftRightFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    }         
    break;
  case 226:
    var keyId = document.getElementById('< | >');
    var keyIdFade = document.getElementById('< | >Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 90:
    var keyId = document.getElementById('KeyZ');
    var keyIdFade = document.getElementById('KeyZFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 88:
    var keyId = document.getElementById('KeyX');
    var keyIdFade = document.getElementById('KeyXFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 67:
    var keyId = document.getElementById('KeyC');
    var keyIdFade = document.getElementById('KeyCFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 86:
    var keyId = document.getElementById('KeyV');
    var keyIdFade = document.getElementById('KeyVFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 66:
    var keyId = document.getElementById('KeyB');
    var keyIdFade = document.getElementById('KeyBFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 78:
    var keyId = document.getElementById('KeyN');
    var keyIdFade = document.getElementById('KeyNFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 77:
    var keyId = document.getElementById('KeyM');
    var keyIdFade = document.getElementById('KeyMFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 188:
    var keyId = document.getElementById('Comma');
    var keyIdFade = document.getElementById('CommaFade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 190:
    var keyId = document.getElementById('Period');
    var keyIdFade = document.getElementById('PeriodFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 189:
    var keyId = document.getElementById('Hyphen');
    var keyIdFade = document.getElementById('HyphenFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 38:
    var keyId = document.getElementById('ArrowUp');
    var keyIdFade = document.getElementById('ArrowUpFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 97:
    var keyId = document.getElementById('Numpad1');
    var keyIdFade = document.getElementById('Numpad1Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 98:
    var keyId = document.getElementById('Numpad2');
    var keyIdFade = document.getElementById('Numpad2Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 99:
    var keyId = document.getElementById('Numpad3');
    var keyIdFade = document.getElementById('Numpad3Fade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
    //ROW 5
  case 17:
    if (location == 1) {
               if (state === 'down') {
document.getElementById('ControlLeft').classList.add('pressed');
        }
    if (state === 'up') {
document.getElementById('ControlLeft').classList.remove('pressed');
        }  
    }
               if (location == 2) {
               if (state === 'down') {
document.getElementById('ControlRight').classList.add('pressed');
        }
    if (state === 'up') {
document.getElementById('ControlRight').classList.remove('pressed');
        }  
    }       
    break;
  case 18:
    if (location == 1) {
               if (state === 'down') {
document.getElementById('AltLeft').classList.add('pressed');
        }
    if (state === 'up') {
document.getElementById('AltLeft').classList.remove('pressed');
        }  
    }
    if (location == 2) {
    if (state === 'down') {
document.getElementById('AltRight').classList.add('pressed');
document.getElementById('ControlLeft').classList.remove('pressed');
        }
    if (state === 'up') {
document.getElementById('AltRight').classList.remove('pressed');
        }  
    }         
    break;
  case 32:
    var keyId = document.getElementById('Space');
    var keyIdFade = document.getElementById('SpaceFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 37:
    var keyId = document.getElementById('ArrowLeft');
    var keyIdFade = document.getElementById('ArrowLeftFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 40:
    var keyId = document.getElementById('ArrowDown');
    var keyIdFade = document.getElementById('ArrowDownFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 39:
    var keyId = document.getElementById('ArrowRight');
    var keyIdFade = document.getElementById('ArrowRightFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 96:
    var keyId = document.getElementById('Numpad0');
    var keyIdFade = document.getElementById('Numpad0Fade'); 
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
  case 110:
    var keyId = document.getElementById('NumpadDecimal');
    var keyIdFade = document.getElementById('NumpadDecimalFade');
    if (state === 'down') { keyId.classList.add('pressed'); }
    if (state === 'up') { keyId.classList.remove('pressed'); }
    if (state === 'wrong') {
        keyIdFade.classList.add('fade');
        setTimeout(() => clearWrongKey(keyIdFade), 750);
        }
    break;
    default:
               
    break;
        }
   PreviousKey = key;
   PreviousLocation = location;
   }
    
   function PlayerProgress(ProgLetters) {
   console.log('ProgScore: ' + ProgScore);
   console.log('Letters.lenght: ' + ProgLetters);
   if ( ProgScore < ProgLetters ) {
   ProgScore++;
   Progress = ProgScore / ProgLetters * 100;
   Player1ProgressBar.style = 'width: ' + Progress + '%;';
   BarP1Prog.innerHTML = Math.round(Progress);
   console.log(Progress +'%');
      }
   }    
       
   function PlayerProgressReset() {
       ProgLetters = 0;
       ProgScore = 0;
       Progress = 0;
       Player1ProgressBar.style = 'width: ' + Progress + '%;';
       BarP1Prog.innerHTML = Progress;
    }  
    
   function removeWrongspace(TextSize) {
    switch (TextSize) {     
    case '16px':
    return ' ';
    break;
  
    case '20px':
    return ' ';  
    break;    
    
    case '25.34px':
    return ' ';  
    break;
       
    case '32px':
    return ' ';  
    break;
     
    case '36px':
    return ' ';  
    break;
           
    case '40px':
    return ' ';  
    break;
       
    case '48px':
    return ' ';  
    break;
    
    case '53.3333px':
    return ' ';  
    break;
     
    case '61.335px':
    return ' ';  
    break;
      
    case '76px':
    return ' '; 
    break;
                 
    }
   }
    
    function createWrongspace(TextSize) {
    switch (TextSize) {     
    case '16px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 12 v 3 h 7 v -3"></path></svg>';
    break;
  
    case '20px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 16 v 3 h 10 v -3"></path></svg>';  
    break;    
    
    case '25.34px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 21 v 3 h 11 v -3"></path></svg>';  
    break;
       
    case '32px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 23 v 3 h 12 v -3"></path></svg>';  
    break;
     
    case '36px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 27 v 3 h 12 v -3"></path></svg>';  
    break;
           
    case '40px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 3 32 v 3 h 16 v -3"></path></svg>';  
    break;
       
    case '48px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 40 v 3 h 16 v -3"></path></svg>';  
    break;
    
    case '53.3333px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 44 v 3 h 18 v -3"></path></svg>';  
    break;
     
    case '61.335px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 52 v 3 h 20 v -3"></path></svg>';  
    break;
    
    //Här   
    case '76px':
    return '<svg class="WrongSpace"><path x="0" y="0" d="m 0 66 v 3 h 22 v -3"></path></svg>'; 
    break;
                 
    }   
       
   }    
});