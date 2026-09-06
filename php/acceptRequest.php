<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$userOne = $_POST['userOne'];     
$userTwo = $_POST['userTwo'];
$type = $_POST['type'];
$userAction = $_POST['userAction'];
    
acceptRequest($userOne, $userTwo, $type, $userAction, $db);
if ($_POST['type'] == 'h2h') {
    createh2hGame($userOne, $userTwo, $db);
}
if ($_POST['type'] == 'Multi') {
    createMultiGame($userOne, $userTwo, $db);
}   
    
} 
?>