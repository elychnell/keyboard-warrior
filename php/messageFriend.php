<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$PageInput = $_POST['PageMsgInput'];
$message = $_POST['msg'];
$user = $_POST['user'];     
$friend = $_POST['friend'];
$region = $_POST['region'];
    
//needs timezone logic 
$time = date("h:i:s");
$date = date("Y:m:d"); 
       
sendMessage($user, $friend, $message, $time, $date, $db);
} 
?>