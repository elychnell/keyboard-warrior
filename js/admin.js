function createDelete () {
var result = document.getElementById('resultID');
var oldHtml = result.innerHTML;
var usernameHtml = oldHtml;
var userNamePos = oldHtml.search('userName is ')
realUserNamePos = userNamePos + 12;
var _usernameHtml = usernameHtml.slice(realUserNamePos);
var brPos = _usernameHtml.search('<br>');  
var username = _usernameHtml.substr(0, brPos);
result.innerHTML = oldHtml + '<form class="deleteForm" method="post" action="admin.php"><input type="hidden" name="form" value="deleteUser"><input type="hidden" name="userSearch" value="' + username + '"><input class="formSubmit" type="submit" value="DELETE!"></form>';
}


function createGivePrem () {
var result = document.getElementById('resultID');
var oldHtml = result.innerHTML;
var usernameHtml = oldHtml;
var userNamePos = oldHtml.search('userName is ')
realUserNamePos = userNamePos + 12;
var _usernameHtml = usernameHtml.slice(realUserNamePos);
var brPos = _usernameHtml.search('<br>');  
var username = _usernameHtml.substr(0, brPos);
result.innerHTML = oldHtml + '<form class="premForm" method="post" action="admin.php"><input type="hidden" name="form" value="givePrem"><input type="hidden" name="userSearch" value="' + username + '"><input class="formSubmit" type="submit" value="Give Premium!"></form>';   
}