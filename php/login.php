<?php
session_start();
require_once('userFunc.php');
//hanterar inloggningsprocessen
if (isset($_POST) == true) {
    
    //input
    $PageLoginInput = $_POST['PageLoginInput'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    //validering
    if(isset($username) == false || isset($password) == false) {        
        echo "Du måste fylla i alla fält.";
        $errors[] = "Du måste fylla i alla fält.";
    } 
    else if (usernameExists($username, $db) == false) {
        echo "Kunde inte hitta användaren.";
        $errors[] = "Kunde inte hitta användaren.";
    } 
    else {
        
        //kollar så lösenordet stämmer
        $login = checkPassword($username, $password, $db);
        
        if ($login == false) {
            $errors[] = "Fel lösenord.";
            echo "Fel lösenord.";
        } 
        else {
            
            //skapar session
            $_SESSION['username'] = $username;
            echo 'username = ' . $_SESSION['username'] . '<br>';
            $typeOfUser = typeOfUser($username, $db);
            
            if($typeOfUser == 1) {
                $_SESSION['userType'] = "Prem";
            }
            else if($typeOfUser == 0) {
                $_SESSION['userType'] = "NonPrem";
            }
            echo 'userType = ' . $_SESSION['userType'] . '<br>';
            echo "<br>Du är nu inloggad";
            $messages[] = "Du är nu inloggad";
        }
    }
//redirect
if(isset($_POST['PageLoginInput'])) {
    
if ($PageLoginInput == 'index') {
    header("Location: http://localhost/kbWarrior/index.php");
}
else if ($PageLoginInput == 'Multi') {
    header("Location: http://localhost/kbWarrior/multiplayer.php");
}
else if ($PageLoginInput == 'Head') {
    header("Location: http://localhost/kbWarrior/head2head.php");
  }  
 }

} else { $errors[] = "Ingen data skickades."; }

?>