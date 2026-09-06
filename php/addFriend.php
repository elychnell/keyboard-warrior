<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$userTwo = $_POST['friendUserName'];
$userOne = $_POST['userName'];     

echo 'Användare: ' . $userOne . '<br>Vill bli vänn med: ' . $userTwo;     


if (usernameExists($userTwo, $db)) {
echo '<br>Användaren finns!<br>';
echo 'Friend request sent!!!<br>';    
FriendRequest($userOne, $userTwo, $db);                
}
    
else { echo "<br>Användarnamnet finns ej!"; }
}

?>