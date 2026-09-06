<?php
require_once ('userFunc.php'); 

//hanterar register input
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    //input
    $username = $_POST['username'];
    $password = $_POST['password'];
    $password2 = $_POST['password2'];
    $email = $_POST['email'];
    
if (usernameExists($username, $db)) {
echo 'Användarnamnet finns redan! Ya duche!';    
} else if ($password !== $password2) {
echo 'Lösenorden matchar inte! Ya duche!';
} else if (verifyEmail($email) == false) {
    echo 'Du måste skriva en korrekt email address! Ya duche!';
} else if (emailExists($email, $db) == true) {
    echo 'Email addressen är redan registrerad! Ya duche!';
} else {
    $input = array (     
    'userName' => $username, 
    'Password' => $password,
    'Email' => $email,   
    'Salt' => '', 
    'WPMRecord' => '0',  
    'Premium' => '0',  
    'Image' => ''
                   );
  
$values = prepareRegistration($input, $db);
uploadUser($values, $db); 
   echo 'Ny user skapad! Ya ducheeee!';     
    }
}

?>