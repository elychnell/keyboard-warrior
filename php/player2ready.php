<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$userOne = $_POST['userOne'];     
$userTwo = $_POST['userTwo'];
$type = $_POST['type'];
$userAction = $_POST['userAction'];
    
player2Ready($userOne, $userTwo, $type, $userAction, $db);
  
} 
?>