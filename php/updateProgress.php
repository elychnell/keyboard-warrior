<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$userLogin = $_POST['userLogin'];   
$userOne = $_POST['userOne'];
$userTwo = $_POST['userTwo'];
$userProgress = $_POST['userProgress'];  
    
$gameID = geth2hGameID($userOne, $userTwo, $db);
updateh2hProgress($gameID, $userOne, $userTwo, $userLogin, $userProgress, $db);
      
}

?>