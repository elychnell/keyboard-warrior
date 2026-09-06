<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
$user = $_POST['user'];
$friend = $_POST['friend'];

getChatHistory ($db, $user, $friend);
}

?>
