<?php
require_once ('userFunc.php'); 

//hanterar register input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
//input
$user = $_POST['user'];
    
echo "<ul>";
getInvites($user, $db);
echo "</ul>";
} 
?>
 