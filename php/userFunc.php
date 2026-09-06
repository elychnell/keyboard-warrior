<?php

$db = mysqli_connect('localhost', 'root', '', 'wordsdb');

//kollar om användaren som är inne på sidan är inloggad
function isLoggedIn () {
    if(isset($_SESSION['username'])) {
        return true;
    } else {
        return false;
    }   
}

//kollar om användaren har prem
function typeOfUser ($username, $db) {
    $username = $db->real_escape_string($username);
    $premUser = $db->query("SELECT Premium FROM users WHERE userName='$username'");
    $row = $premUser->fetch_assoc();
      
    return $row['Premium'];
}
// ger premium till en användare
function givePrem($username, $db) {
$db->query("UPDATE users SET Premium='1' WHERE userName='$username'");   
}


//Kollar så att emailen är i korrekt format
function verifyEmail($email) {
 if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    } else {
        return true;
    }
}
//kollar om emailen redan är registrerad 
function emailExists($email, $db) {
    $email = $db->real_escape_string($email);
    $query1 = $db->query("SELECT * FROM users WHERE Email='$email'");
    
    //om något hittats skickas true tillbaka annars false
    if ($query1->num_rows == 1) {
        return true;
    } else {
        return false;
    }
}

//kollar om användarnamnet är taget 
function usernameExists($username, $db) {
    $username = $db->real_escape_string($username);
    $query1 = $db->query("SELECT userName FROM users WHERE userName='$username'");
    
    //om något hittats skickas true tillbaka annars false
    if ($query1->num_rows == 1 ) {
        return true;
    } else {
        return false;
    }
}

function encrypt(&$input) {
    $input['Salt'] = substr(sha1(mt_rand()),0,22);
    $input['Password'] = sha1($input['Salt'] . $input['Password']);
}

function inputFilter($value, $db) {
    $newVal = trim($value);
    $newVal = htmlspecialchars($newVal);
    $newVal = mysqli_real_escape_string($db, $newVal);
    return $newVal;
}

function escapeInput(&$input, $db) {
    foreach ($input as $key => $value) {
    $input[$key] = inputFilter($value, $db);          
}
return $input;
}

function inputToSQL($input) {
    $result = implode("', '",$input);
    $values = "'" . $result . "'";
    return $values;
}
//förbereder allting innan man lägger in användaren i databasen
function prepareRegistration($input, $db) {
    
    //gör inputen till escape strings för att skydda från sql injection
    escapeInput($input, $db);
    encrypt($input);
    //gör om arrayens värden till en sträng.
    $values = inputToSQL($input);
    
    return $values;
}

//förbereder allting innan man lägger in request i databasen
function prepareRequest($input, $db) {
    
    //gör inputen till escape strings för att skydda från sql injection
    escapeInput($input, $db);
    //gör om arrayens värden till en sträng.
    $values = inputToSQL($input);
    
    return $values;
}

function prepareMessage($input, $db) {
    
    //gör inputen till escape strings för att skydda från sql injection
    escapeInput($input, $db);
    //gör om arrayens värden till en sträng.
    $values = inputToSQL($input);
    
    return $values;
}
//uppdaterar en User
function updateUser($input, $username, $db){
    
    $userInfo = getUserinfo($username, $db);
    $salt = $userInfo['salt'];
    $input['password'] = sha1($salt . $input['password']);
    
    $db->query("UPDATE employees SET , pNumber='{$input['pNumber']}', email='{$input['email']}', phone='{$input['phone']}', password='{$input['password']}', salt='$salt' WHERE userName='$username'");
}

//ny användare
function uploadUser($values, $db) {
    $db->query("INSERT INTO users (userName, Password, Email, Salt, WPMRecord, Premium, Image) VALUES ($values)");
}

//hanterar inloggning
function checkPassword($username, $password, $db) {
    
    $loginInfo = getUserName($username, $db);
    
    $salt = $loginInfo['Salt'];
    $correctPassword = $loginInfo['Password'];
    
    $password = sha1($salt . $password);
    
    return ($password == $correctPassword) ? true : false;
}

//hämtar all information om en user
function getUserName($username, $db) { 
    $result = $db->query("SELECT * FROM users WHERE userName='$username'");
    return mysqli_fetch_assoc($result);
}

function getUserNameFromId($userId, $db) {
$result = $db->query("SELECT userName FROM users WHERE ID='$userId'");   
$row = $result->fetch_assoc();

$username = (string) $row['userName'];
return $username;
    
}

function getUserEmail($email, $db) { 
    $result = $db->query("SELECT * FROM users WHERE Email='$email'");
    return mysqli_fetch_assoc($result);
}
//byter ut användarens profilbild
function changeProfileImage($email, $imageName, $imageTemp, $db) {
    
    //skapar filvägen där bilden ska ligga
    $imagePath = 'assets/img/profile/' . $imageName;
    move_uploaded_file($imageTemp, $imagePath);
    $db->query("UPDATE $users SET image='$imagePath' WHERE email='$email'");    
}

function deleteUser($username, $db) {
    $db->query("DELETE FROM users WHERE userName='$username'");
}

function getAllRegUsers($db) {
    return $db->query("SELECT * FROM users where Premium='0'");   
}
function countRegUsers($db) {
    return $db->query("SELECT COUNT(*) FROM users where Premium='0'");  
}

function getAllPremUsers($db) {
    return $db->query("SELECT * FROM users where Premium='1'");
}

function countPremUsers($db) {
    return $db->query("SELECT COUNT(*) FROM users where Premium='1'");
}

function getFriends($db, $userOne) {    
return $db->query("SELECT * FROM relations WHERE userOne='$userOne' AND type='friend' OR userTwo='$userOne' AND type='friend' AND status='1'");
}

function getReadyGames($user, $db) {
$sql = "SELECT * FROM relations WHERE userOne='$user' AND (type='Head2Head' OR type='Multiplayer') AND status='2' AND userAction='$user'";
$result = mysqli_query($db, $sql);

if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_assoc($result)) {
 
echo "<script>gameFound('" . $row['userTwo'] . "','";
echo $row['type'] . "','". $row['userOne'] . "');";
echo "</script>";

}    
}
}

function getAcceptedGames($user, $db) {
$sql = "SELECT * FROM relations WHERE userOne='$user' AND (type='Head2Head' OR type='Multiplayer') AND status='1' AND userAction='$user'";
$result = mysqli_query($db, $sql);

if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_assoc($result)) {
 
echo "<script>gameAccepted('" . $row['userTwo'] . "','";
echo $row['type'] . "','". $row['userOne'] . "');";
echo "</script>";

}    
}
}

function getInvites($user, $db) {    
$sql = "SELECT * FROM relations WHERE userTwo='$user' AND (type='Head2Head' OR type='Multiplayer') AND status='0' AND NOT userAction='$user'";
$result = mysqli_query($db, $sql);
    
if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_assoc($result)) {
echo '<li onclick="inviteClick(\'' . $row['userOne'] . "','" . $row['userTwo'] . "','" . $row['type'] . "','" . $row['userAction'] . "');\">";
echo "<span class='inviteType'>" . $row['type'] . ' game';
echo "</span><br><span class='inviteSender'>From: " . $row['userOne'];
echo "</span></li>";          
  }
} else {
echo "<span class='noInviteText'>No current invites</span>";  
}    
       
}

function multiRequestExists($db, $userOne, $userTwo) {
    $result = $db->query("SELECT * FROM relations WHERE userOne='$userOne' AND userTwo='$userTwo' AND type='Multiplayer' AND status='0' AND userAction='$userOne'");
    
      if ($result->num_rows == 1) {
          return true;
    } else { 
        return false;
    }
}

function h2hRequestExists($db, $userOne, $userTwo) {
    $result = $db->query("SELECT * FROM relations WHERE userOne='$userOne' AND userTwo='$userTwo' AND type='Head2Head' AND status='0' AND userAction='$userOne'");
    
    if ($result->num_rows == 1) {
        return true;
    } else {
        return false;   
    }
    }

function friendRequestExists($db, $userOne, $userTwo) {
    $result = $db->query("SELECT * FROM relations WHERE userOne='$userOne' AND userTwo='$userTwo' AND type='friend' AND status='0' AND userAction='$userOne'");
    if ($result->num_rows == 1) {
        return true;
    } else {
        return false;
    }
    }

function h2hGameExists($db, $userOne, $userTwo) {
    $result = $db->query("SELECT * FROM h2hgames WHERE playerOne='$userOne' AND playerTwo='$userTwo' OR playerOne='$userTwo' AND playerTwo='$userOne'");
    if ($result->num_rows == 1) {
        return true;
    } else {
        return false;   
    }
    }

function uploadRequest($db, $values) {
$db->query("INSERT INTO relations (userOne, userTwo, type, status, userAction) VALUES ($values)");   
}

function MultiRequest($userOne, $userTwo, $db) {
$input = array (     
    'userOne' => $userOne, 
    'userTwo' => $userTwo,
    'type' => 'Multiplayer',
    'status' => 0,  
    'userAction' => $userOne 
               );

if (multiRequestExists($db, $userOne, $userTwo)) {
echo 'Multiplayer match already requested';        
} else {
$values = prepareRequest($input, $db);
uploadRequest($db, $values);
       }
}

function FriendRequest($userOne, $userTwo, $db) {
$input = array (     
    'userOne' => $userOne, 
    'userTwo' => $userTwo,
    'type' => 'friend',
    'status' => 0,  
    'userAction' => $userOne 
               );
if (friendRequestExists($db, $userOne, $userTwo)) {    
echo 'Already requested ' . $userTwo . ' as a friend';
} else {
$values = prepareRequest($input, $db);
uploadRequest($db, $values);       
       }
}

function H2HRequest($userOne, $userTwo, $db) {
$input = array (     
    'userOne' => $userOne, 
    'userTwo' => $userTwo,
    'type' => 'Head2Head',
    'status' => 0,  
    'userAction' => $userOne 
               );
if (h2hRequestExists($db, $userOne, $userTwo)) {    
echo 'Head to head match already requested';
} else {    
$values = prepareRequest($input, $db);
uploadRequest($db, $values); 
}
}

function acceptRequest($userOne, $userTwo, $type, $userAction, $db) {
$db->query("UPDATE relations SET status = 1 WHERE userOne='$userOne' AND userTwo='$userTwo' AND type='$type' AND userAction='$userAction'");    
}

function player2Ready($userOne, $userTwo, $type, $userAction, $db) {
$db->query("UPDATE relations SET status = 2 WHERE userOne='$userOne' AND userTwo='$userTwo' AND type='$type' AND userAction='$userAction'");    
}

function startGame($userOne, $userTwo, $type, $db) {
$db->query("UPDATE relations SET status = 3 WHERE userTwo='$userTwo' AND userOne='$userOne' AND type='$type'");   
}

function createh2hGame ($userOne, $userTwo, $db) {
$db->query("INSERT INTO h2hgames (playerOne, playerOneCurrent, playerTwo, playerTwoCurrent) VALUES ('$userOne', '0', '$userTwo', '0')");  

$sql = "SELECT LAST_INSERT_ID()";
$result = mysqli_query($db, $sql);
    
while ($row = mysqli_fetch_assoc($result)) {
$resultArray[] = $row;
}   
$resultID = $resultArray[0];
    
$sql = "SELECT * FROM englishwords ORDER BY RAND() LIMIT 30";   
$result = mysqli_query($db, $sql);
    
$wordCount = 0;    
while ($row = mysqli_fetch_assoc($result))
{
$wordArray[] = $row['word'];  

$ID = $resultID["LAST_INSERT_ID()"];
    
$db->query("INSERT INTO h2hwords (gameID, word) VALUES ('$ID', '$wordArray[$wordCount]')");
$wordCount = $wordCount + 1; 
}

$sql = "SELECT * FROM h2hwords WHERE gameID=$ID";
$result = mysqli_query($db, $sql);
$h2hWords = array();
while ($row = mysqli_fetch_assoc($result))
{
$h2hWords[] = $row;
}

$h2hWordsJSON = json_encode($h2hWords, JSON_UNESCAPED_UNICODE);
file_put_contents('php/h2hWords.json', $h2hWordsJSON);

}

function loadh2hGame ($userOne, $userTwo, $db) {
$result = $db->query("SELECT * FROM h2hgames WHERE playerOne='$userOne' AND playerTwo='$userTwo' OR playerOne='$userTwo' AND playerTwo='$userOne'");
while ($row = mysqli_fetch_assoc($result))
{
$ID = $row['ID'];
}    
    
$sql = "SELECT * FROM h2hwords WHERE gameID=$ID";
$result = mysqli_query($db, $sql);
$h2hWords = array();
while ($row = mysqli_fetch_assoc($result))
{
$h2hWords[] = $row;
}

$h2hWordsJSON = json_encode($h2hWords, JSON_UNESCAPED_UNICODE);
file_put_contents('php/h2hWords.json', $h2hWordsJSON);
    
}

function geth2hGameID ($userOne, $userTwo, $db) {
$result = $db->query("SELECT * FROM h2hgames WHERE playerOne='$userOne' AND playerTwo='$userTwo' OR playerOne='$userTwo' AND playerTwo='$userOne'");
while ($row = mysqli_fetch_assoc($result))
{
$ID = $row['ID'];
}        
return $ID;    
}

function updateh2hProgress ($gameID, $userOne, $userTwo, $userLogin, $userProgress, $db) {

if ( $userLogin == $userOne ) {
$db->query("UPDATE h2hGames SET playerOneCurrent='$userProgress' WHERE ID='$gameID' AND playerOne='$userLogin'");       
} else if ( $userLogin == $userTwo ) {
$db->query("UPDATE h2hGames SET playerTwoCurrent='$userProgress' WHERE ID='$gameID' AND playerTwo='$userLogin'");       
}

}

function countFriends($db, $userOne) {
    return $db->query("SELECT COUNT(*) FROM relations WHERE (userOne='$userOne' OR userTwo='$userOne') AND type='friend' AND status='1'");
}

function getUserID ($db, $user) {
$result = $db->query("SELECT ID FROM users WHERE userName='$user'");    
$row = $result->fetch_assoc();

$id = (int) $row['ID'];   
return $id;
}

function uploadMessage ($db, $values) {
$db->query("INSERT INTO messages (userOneId, userTwoId, message, time, date) VALUES ($values)");
}

function getChatHistory ($db, $user, $friend) {

$userOneId = getUserID ($db, $user);
$userTwoId = getUserID ($db, $friend);

$sql = "SELECT * FROM messages WHERE userOneId='$userOneId' AND userTwoId='$userTwoId' UNION SELECT * FROM messages WHERE userOneId='$userTwoId' AND userTwoId='$userOneId' ORDER BY date, time DESC";
$result = mysqli_query($db, $sql);

if (mysqli_num_rows($result) > 0) {
while ($row = mysqli_fetch_assoc($result)) {

$str = implode(",",$row);
$strPosition = strpos($str,",");
$firstId = substr($str,0,$strPosition);
$offset = $strPosition + 1;
$strSecondPos = strpos($str, ',', $offset);
$strRealPos = $strPosition + 1;
$length = $strSecondPos - $strPosition - 1;
$secondId = substr($str, $strRealPos, $length);

$userName = getUserNameFromId($firstId, $db); 
$friendName = getUserNameFromId($secondId, $db);
 
echo '<li><span class="sender">From: ' . $userName . '</span>';  
echo '<span class="msgdate">Sent: ';
echo $row['date'] . ' ' . $row['time'] . '</span><br>';
echo '<span class=msg>' . $row['message'] . '</span></li>';         
  }
} else {
echo "No previous messages!";  
}

}

function sendMessage($user, $friend, $message, $time, $date, $db) {

    $userOneId = getUserID ($db, $user);
    $userTwoId = getUserID ($db, $friend); 
    
    $input = array (     
    'userOneId' => $userOneId, 
    'userTwoId' => $userTwoId,
    'message' => $message,  
    'Time' => $time,
    'date' => $date
               );
    
$values = prepareMessage($input, $db);
uploadMessage($db, $values);

}

?>