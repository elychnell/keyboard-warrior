var chatRepeat = '';
var inviteRepeat = '';

//Login Lightbox
function showLogin () {
var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
    
LightboxCont.innerHTML = '<div class="LoginDim" id="LoginDim">\n<div class="LoginBox" id="LoginBox">\n<div class="LoginCloseBox" id="LoginCloseBox" onmouseover="loginBorderOn()" onmouseout="loginBorderOff()" onclick="hideLogin()">\n<a class="LoginClose" id="LoginClose">X</a>\n</div>\n<div class="LoginForm" id="LoginForm">\n<span class="LoginTextTop">Please log in</span>\n<form action="php/login.php" method="post">\n<label for="Uname">Username:</label><br>\n<input class="formInput" id="loginUname" type="text" name="username"><br>\n<label for="loginPword">Password:</label><br>\n<input class="formInput" id="loginPword" type="password" name="password"><br><br>\n<input type="hidden" class="PageInput" id="PageLoginInput" name="PageLoginInput" value="index">\n<input class="formSubmit" type="submit" value="Log in">\n</form>\n<span class="LoginTextBottom">Keyboard Warrior!</span>\n<a class="RegisterLink" id="RegisterLink" onclick="showRegister()">Need an account: Register here!</a>\n</div>\n</div>\n</div>';    
    
}

function RemoveLightbox () {
var LightboxCont = document.getElementById('LightboxContainer');
LightboxCont.remove();    
}

function loginBorderOn () {
document.getElementById('LoginBox').classList.add('hover');    
}

function loginBorderOff () {
document.getElementById('LoginBox').classList.remove('hover');    
}

//Register Lightbox
function showRegister () {
RemoveLightbox();
    
var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
    
LightboxCont.innerHTML = '<div class="RegisterDim" id="RegisterDim">\n<div class="RegisterBox" id="RegisterBox">\n<div class="RegisterCloseBox" id="RegisterCloseBox" onmouseover="RegisterBorderOn()" onmouseout="RegisterBorderOff()" onclick="hideRegister()">\n<a class="RegisterClose" id="RegisterClose">X</a>\n</div>\n<div class="RegisterForm" id="RegisterForm">\n<span class="RegisterTextTop">Please enter the following details</span>\n<form action="php/register.php" method="post">\n<label for="Uname">Username:</label><br>\n<input class="formInput" id="regUname" type="text" name="username"><br>\n<label for="Pword">Password:</label><br>\n<input class="formInput" id="regPword" type="text" name="password"><br>\n<label for="Pword2">Password again:</label><br>\n<input class="formInput" id="regPword2" type="text" name="password2"><br>\n<label for="email">Email:</label><br>\n<input class="formInput" id="email" type="text" name="email"><br><br>\n<input class="formSubmit" type="submit" value="Register!">\n</form>\n<span class="RegisterTextBottom">Welcome Keyboard Warrior!</span>\n</div>\n</div>\n</div>';
}

function hideLogin () { RemoveLightbox(); }

function hideRegister () {
RemoveLightbox();
showLogin();
}

function RegisterBorderOn () {
document.getElementById('RegisterBox').classList.add('hover');    
}

function RegisterBorderOff () {
document.getElementById('RegisterBox').classList.remove('hover');    
}

//Add Friend Lightbox
function showAddFriend () {
var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
    
LightboxCont.innerHTML = '<div class="addFriendDim" id="addFriendDim">\n<div class="addFriendBox" id="addFriendBox">\n<div class="addFriendCloseBox" id="addFriendCloseBox" onmouseover="addFriendBorderOn()" onmouseout="addFriendBorderOff()" onclick="hideAddFriend()">\n<a class="addFriendClose" id="addFriendClose">X</a>\n</div>\n<div class="addFriendForm" id="addFriendForm">\n<span class="addFriendTextTop">Search for Friend:</span>\n<form action="php/addFriend.php" method="post">\n<label for="friendUname">Username:</label><br>\n<input class="formInput" id="friendUname" type="text" name="friendUserName">\n<input type="hidden" class="userName" id="userName" name="userName" value="<?php if (isset($_SESSION[\'username\'])) { echo $_SESSION[\'username\']; };?>">\n<input class="formSubmit" type="submit" value="Register!"><br><br>\n</form>\n<span class="RegisterTextBottom">Welcome Keyboard Warrior!</span>\n</div>\n</div>\n</div>';  
}

function hideAddFriend () { RemoveLightbox(); }

function addFriendBorderOn () {
document.getElementById('addFriendBox').classList.add('hover');    
}

function addFriendBorderOff () {
document.getElementById('addFriendBox').classList.remove('hover');    
}
//Accept Invite LightBox
function acceptInviteBorderOn () {
document.getElementById('acceptInviteBox').classList.add('hover');   
}

function acceptInviteBorderOff () {
document.getElementById('acceptInviteBox').classList.remove('hover');   
}

function hideAcceptInvite () { RemoveLightbox(); 
                             }

//Message Lightbox
function messageBorderOn () {
document.getElementById('messageBox').classList.add('hover');   
}

function messageBorderOff () {
document.getElementById('messageBox').classList.remove('hover');   
}

function hideMessage () {
RemoveLightbox();
endChat();
}

//Friends list hoover
function friendBorderOn (friend) {
document.getElementById(friend).classList.add('hover');    
}

function friendBorderOff (friend) {
document.getElementById(friend).classList.remove('hover');      
}

function prevURL () {
console.log('previous url is: ' + window.history.previous.href);   
}

var xPos = 0;
var yPos = 0;
var fMenuActive = false;
var array;
var menu;

function friendMenu (user, friend) {

document.addEventListener('mousedown', function (e) {
xPos = e.pageX;
yPos = e.pageY;

var friend_element = document.getElementById('friend_' + friend);
var friend_element_span = document.getElementById('friend_' + friend + '_span');     
var menuId = '';

if (e.target == friend_element && fMenuActive == false || e.target == friend_element_span && fMenuActive == false )  {
fMenuActive = true;
var friendMenu = document.createElement('div');
friendMenu.id = 'friendMenu_' + friend;
friendMenu.className = 'friendMenu';
friendMenu.innerHTML = '<ul><li id="friendMenu1" onclick="sendH2H(\'' + user + '\', \'' + friend + '\');"><span id="friendMenu1span">Invite to Head 2 Head</span></li><li id="friendMenu2" onclick="sendMulti(\'' + user + '\', \'' + friend + '\');"><span id="friendMenu2span">Invite to multiplayer</span></li><li id="friendMenu3" onclick="sendMsg(\'' + user + '\', \'' + friend + '\');"><span id="friendMenu3span">Send message</span></li><li id="friendMenu4"><span id="friendMenu4span" onclick="removeFriend(\'' + user + '\', \'' + friend + '\');">Remove friend</span></li></ul>';
yPos = yPos - 10;
xPos = xPos - 50;
menuId = friendMenu.id; 

friendMenu.setAttribute('style', 'top:' + yPos + 'px;left:' + xPos + 'px;');
document.body.appendChild(friendMenu);
 
var friendMenu1 =  document.getElementById('friendMenu1');
var friendMenu1span = document.getElementById('friendMenu1span');
var friendMenu2 =  document.getElementById('friendMenu2');
var friendMenu2span = document.getElementById('friendMenu2span');
var friendMenu3 = document.getElementById('friendMenu3');  
var friendMenu3span = document.getElementById('friendMenu3span');
var friendMenu4 = document.getElementById('friendMenu4'); 
var friendMenu4span = document.getElementById('friendMenu4span');
menu = document.getElementById(menuId);
       
array = [friendMenu1, friendMenu1span, friendMenu2, friendMenu2span, friendMenu3, friendMenu3span, friendMenu4, friendMenu4span]
    
} else if (fMenuActive == true && array.includes(e.target) == false) {

menu.parentNode.removeChild(menu); 
fMenuActive = false;
                     }                           
  });
}

function chatHistory (user, friend) {
  
//Printing chat history   
$("#chatHistoryList").load("php/chatHistory.php", {
    "user": user,
    "friend": friend
}, function() {
  //Scrolling to bottom
  var element = document.getElementById('chatHistory');
  element.scrollTop = element.scrollHeight;  
    
  console.log('chatHistory load for U: ' + user + ' F: ' + friend);
});  

}

function startChat(user, friend) {
console.log('Starting Chat!');
chatHistory(user, friend);
chatRepeat = setInterval(function func () {chatHistory(user, friend)}, 3000);
}

function endChat() {
clearInterval(chatRepeat);
console.log('Ended Chat!');
}

function startInvites(user, friend) {
console.log('Starting invites!');
getInvites(user);
console.log('Starting AcepptedGames!');
getAcceptedGames(user);
console.log('Starting ReadyGames!');
getReadyGames(user);
inviteRepeat = setInterval(function func () {
    getInvites(user);
    getAcceptedGames(user);
    getReadyGames(user);
} , 5000);
}

function getAcceptedGames(user) {
$(document).load("php/getAcceptedGames.php", {
    "user": user,
}, function() {
  console.log( 'getAcceptedGames load for: ' + user); 
});
    
}

function player2Ready(user) {
$(document).load("php/player2Ready.php", {
    "user": user
}, function() {
  console.log( "player 2 is ready." ); 
}); 
}

function getReadyGames(user) {
$("#inviteList").load("php/getReadyGames.php", {
    "user": user,
}, function() {
  console.log( 'getReadyGames load for: ' + user); 
});   
}

function getInvites(user) {
$("#inviteList").load("php/getInvites.php", {
    "user": user,
}, function() {
  console.log( 'getInvites load for: ' + user); 
});   
}

function removeFriend(user, friend) {
console.log('Removing friend: ' + friend + ' from: ' + user + 's friendslist!');

$(document).load("php/removeFriend.php", {
    "user": user,
    "friend": friend
}, function() {
  console.log( "removeFriend load was performed." ); 
});   
}

function sendH2H(user, friend) {
console.log('Sending H2H request to: ' + friend + ' from: ' + user);
$(document).load("php/requestH2H.php", {
    "user": user,
    "friend": friend
}, function() {
  console.log( "sendH2H load was performed." );  
});      
}

function sendMulti(user, friend) {
console.log('Sending Multi request to: ' + friend + ' from: ' + user);
$(document).load("php/requestMulti.php", {
    "user": user,
    "friend": friend
}, function() {
  console.log( "sendMulti load was performed." );  
});          
}

function chatSubmit () {

var user = document.getElementById('user').value;
var friend = document.getElementById('friend').value;    
var msg = document.getElementById('msg').value;
var PageMsgInput = document.getElementById('PageMsgInput').value;
var region = '';    

$.get("https://api.ipdata.co?api-key=fb3a3f5b6e9f14d711efd89ff82e5c750055f63aecc610110dbb544f", function(response) {
    console.log('chat submit region: ' + response.country_name);
   /*
    switch (response.country_name) {
    
       case 'Sweden':
           KeyboardType = 'Swedish';
           DefaultKeyboard(KeyboardType);
           break;
       case 'USA':
           KeyboardType = 'English';
           DefaultKeyboard(KeyboardType);
           break;
       default:
           KeyboardType = 'English';
           DefaultKeyboard(KeyboardType);
           break;
    }
    */       
   
}, "jsonp");    
       
sendChat (user, friend, msg, PageMsgInput, region);    
}

function sendChat (user, friend, msg, PageMsgInput, region) {
console.log('Sending Multi request to: ' + friend + ' from: ' + user);

$.ajax({
        type: 'post',
        url: 'php/messageFriend.php',
        method: 'POST',
        data: { 
        user: user,
        friend: friend,
        msg: msg,
        PageMsgInput: PageMsgInput,
        region: region },
        success: function (data) {
        console.log('MSG Sent!');
        console.log(data);
        }
});    
    
/*    
$.post("php/messageFriend.php", {
    

}, function(data) {
  console.log( "sendMessage was performed!" );  
}); 
*/
}

function gameFound (userTwo, type, userOne) { 

if (type === 'Head2Head') {    
console.log(userTwo + ' has aceppted your invite!\nStarting a ' + type + ' game!');

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'head2head.php';
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'userOne';
        input.value = userOne;
        form.appendChild(input);
    var input2 = document.createElement('input');
        input2.type = 'hidden';
        input2.name = 'userTwo';
        input2.value = userTwo;
        form.appendChild(input2);
    var input3 = document.createElement('input');
        input3.type = 'hidden';
        input3.name = 'pageInput';
        input3.value = 'index.php';
        form.appendChild(input3);
    var input4 = document.createElement('input');
        input4.type = 'hidden';
        input4.name = 'firstVisit';
        input4.value = 'true';
        form.appendChild(input4);
    var input5 = document.createElement('input');
        input5.type = 'hidden';
        input5.name = 'fromGF';
        input5.value = 'true';
        form.appendChild(input5);    
    document.body.appendChild(form);
    form.submit();
}
      
}

function inviteClick(userOne, userTwo, type, userAction) {
var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
LightboxCont.innerHTML = '<div id="acceptInviteDim" class="acceptInviteDim">\n<div class="acceptInviteBox" id="acceptInviteBox">\n<div class="acceptInviteCloseBox" id="acceptInviteCloseBox" onmouseover="acceptInviteBorderOn()" onmouseout="acceptInviteBorderOff()" onclick="hideAcceptInvite()">\n<a class="acceptInviteClose" id="acceptInviteClose">X</a></div>\n<span class="inviteBoxText">' + userOne + ' has invited you to a ' + type + ' game!</span>\n<br><button class="button" onclick="inviteAccept(\'' + userOne + '\',\'' + userTwo + '\',\'' + type + '\',\'' + userAction + '\');">I am ready!</button></div>\n</div>';
}

//Jobba här!

function AcceptedInvite(userOne, userTwo, type, userAction) {

var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
LightboxCont.innerHTML = '<div id="inviteAcceptedDim" class="inviteAcceptedDim">\n<div class="inviteAcceptBox" id="inviteAcceptBox">\n<span class="inviteAcceptedBoxText">' + userTwo + ' has aceppted your invitation to a ' + type + ' game!</span>\n<br><button class="button" onclick=""player2Ready(\'' + userOne + '\',\'' + userTwo + '\',\'' + type + '\',\'' + userAction + '\');"">I am ready!</button></div>\n</div>';

}

function player2Ready(userOne, userTwo, type, userAction) {
    
    $.ajax({
        type: 'post',
        url: 'php/player2Ready.php',
        method: 'POST',
        data: { userOne: userOne, userTwo: userTwo, type: type, userAction: userAction },
        success: function (data) {
        console.log('Player 2 ready!');
        }
   });
    
   var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'head2head.php';
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'userOne';
        input.value = userOne;
        form.appendChild(input);
    var input2 = document.createElement('input');
        input2.type = 'hidden';
        input2.name = 'userTwo';
        input2.value = userTwo;
        form.appendChild(input2);
    var input3 = document.createElement('input');
        input3.type = 'hidden';
        input3.name = 'pageInput';
        input3.value = 'index.php';
        form.appendChild(input3);
    var input4 = document.createElement('input');
        input4.type = 'hidden';
        input4.name = 'firstVisit';
        input4.value = 'true';
        form.appendChild(input4);
    var input5 = document.createElement('input');
        input5.type = 'hidden';
        input5.name = 'fromGF';
        input5.value = 'true';
        form.appendChild(input5);    
    document.body.appendChild(form);
    form.submit();       
}

function inviteAccept(userOne, userTwo, type, userAction) {
console.log('User ' + userTwo + ' Has accepted ' + userOne + 's invite for a ' + type + ' game'); 
    
  $.ajax({
        type: 'post',
        url: 'php/acceptRequest.php',
        method: 'POST',
        data: { userOne: userOne, userTwo: userTwo, type: type, userAction: userAction },
        success: function (data) {
        console.log('Game accepted!');
        }
   });
    
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'head2head.php';
    var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'userOne';
        input.value = userOne;
        form.appendChild(input);
    var input2 = document.createElement('input');
        input2.type = 'hidden';
        input2.name = 'userTwo';
        input2.value = userTwo;
        form.appendChild(input2);
    var input3 = document.createElement('input');
        input3.type = 'hidden';
        input3.name = 'pageInput';
        input3.value = 'index.php';
        form.appendChild(input3);
    var input4 = document.createElement('input');
        input4.type = 'hidden';
        input4.name = 'firstVisit';
        input4.value = 'true';
        form.appendChild(input4);
    var input5 = document.createElement('input');
        input5.type = 'hidden';
        input5.name = 'fromGF';
        input5.value = 'true';
        form.appendChild(input5);    
    document.body.appendChild(form);
    form.submit();
}

function sendMsg (user, friend) {

//Marking slected option
var friendMenu3 = document.getElementById('friendMenu3');     
$(friendMenu3).css('background-color', 'white');
$(friendMenu3).css('border-color', 'white');    

//add chat Lightbox + HTML
var LightboxContainer = document.createElement('div');
LightboxContainer.id = 'LightboxContainer';
LightboxContainer.className = 'LightboxContainer';
  
document.body.appendChild(LightboxContainer);
var LightboxCont = document.getElementById('LightboxContainer');
    
LightboxCont.innerHTML = '<div id="msgFriendDim" class="msgFriendDim">\n<div class="messageBox" id="messageBox">\n<div class="messageCloseBox" id="messageCloseBox" onmouseover="messageBorderOn()" onmouseout="messageBorderOff()" onclick="hideMessage()">\n<a class="messageClose" id="messageClose">X</a>\n</div>\n<span id="friendname" class="friendname">Chat with: ' + friend + '</span>\n<div id="chatHistory" class="chatHistory">\n<ul id="chatHistoryList"></ul></div>\n<form id="msgForm" class="msgForm" onsubmit="event.preventDefault(); chatSubmit();"><span class="messageTextTop">Your message: </span>\n<textarea id="msg" name="msg" class="msgArea" maxlength = \'200\'></textarea>\n<input type="hidden" id="user" name="user" value="' + user + '"></input>\n <input type="hidden" id="friend" name="friend" value="' + friend + '"></input>\n<input type="hidden" id="PageMsgInput" name="PageMsgInput" value="index"></input></form>\n</div>';

    // Needs to be sent without reloading the page.
   // needs timezone logic that is sent to sendsmg php based on region
    
    
//add script to head    
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'js/chat.js';
document.head.appendChild(script);
startChat(user, friend);
}