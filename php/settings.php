<?php

session_start();
require_once('userFunc.php');

//hanterar settings
if (isset($_POST) == true) {
    
 $PageInput = $_POST['PageInput'];
 $TextLang = $_POST['TextLang'];
 $TextFont = $_POST['TextFont'];  
 $KeyboardType = $_POST['KeyboardType'];
 $TextSize = $_POST['TextSize'];
 $sColor = $_POST['sColor'];

$settings = array($TextLang,$KeyboardType,$TextSize,$TextFont,$sColor);
$values = implode(',',$settings);
    
setcookie('settings', $values, time() + (86400 * 14), "/"); // 86400 = 1 day    
}

//redirect
if(isset($_POST['PageInput'])) {
    
if ($PageInput == 'index') {
    header("Location: http://localhost/kbWarrior/index.php");
}
else if ($PageInput == 'Multi') {
    header("Location: http://localhost/kbWarrior/multiplayer.php");
}
else if ($PageInput == 'Head') {
    header("Location: http://localhost/kbWarrior/head2head.php");
}
    
}

?>