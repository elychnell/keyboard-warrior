<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$user = $_POST['user'];
    
getAcceptedGames($user, $db);

} 
?>