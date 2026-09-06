<?php
session_start();
require_once 'php/userFunc.php';

if(isset($_SESSION['username'])) {
printf($_SESSION['username']);
if ($_SESSION['username'] == 'admin') {   
if ($_SERVER["REQUEST_METHOD"] == "POST") {
       
     $formname = $_POST['form'];   
        
     if ($formname == 'searchUser') {
         $username = $_POST['userSearch'];
         $exists = usernameExists($username, $db);
         if ($exists) { 
         $results = getUserName($username, $db);
         echo '<h3 class="resTitle">Search Results:</h3><div id="resultID" class="results"><span>';
        foreach ($results as $key=>$value) {
          echo $key , ' is ' , $value , '<br>'; 
       }    
echo '</span></div>';      
     } else {echo '<h3 class="resTitle">Search Results:</h3><span class="results">No user with that username exists!</span>';}   
 }
      if ($formname == 'searchEmail') {
        $email = $_POST['emailSearch'];
        $exists = emailExists($email, $db);
         if ($exists) { 
          $results = getUserEmail($email, $db); 
          echo '<h3 class="resTitle">Search Results:</h3><div id="resultID" class="results"><span>';
          foreach ($results as $key=>$value) {
          echo $key , ' is ' , $value , '<br>'; 
         } 
          echo '</span></div>'; 
       } else {echo '<h3 class="resTitle">Search Results:</h3><span class="results">No user with that email exists!</span>';}
   }
    if ($formname == 'deleteUser') {
        $username = $_POST['userSearch'];
        deleteUser($username, $db);     
     }
    if ($formname == 'givePrem') {
        $username = $_POST['userSearch'];
        if (typeOfUser($username, $db) == '0') {
        givePrem($username, $db); 
          } else {echo '<h3 class="resTitle">Search Results:</h3><span class="results">User already has Premium!</span>';}
     }
     if ($formname == 'createUser') {
         
    $username = $_POST['username'];
    $password = $_POST['password'];
    $password2 = $_POST['password2'];
    $email = $_POST['email'];
    
if (usernameExists($username, $db)) {
echo '<h3 class="resTitle">Register error:</h3><span class="results">Username already exists!</span>';    
} else if ($password !== $password2) {
echo '<h3 class="resTitle">Register error:</h3><span class="results">The passwords dont match!</span>';
} else if (verifyEmail($email) == false) {
    echo '<h3 class="resTitle">Register error:</h3><span class="results">You must enter a valid email address!</span>';
} else if (emailExists($email, $db) == true) {
    echo '<h3 class="resTitle">Register error:</h3><span class="results">Email adress is already registered!</span>';
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
   echo '<h3 class="resTitle">Register Success:</h3><span class="results">New user created!</span>';     
      }
    }
  }

//Printar ut regular user list
$result = getAllRegUsers($db);
$userCountQuery = countRegUsers($db);
while ($row = mysqli_fetch_assoc($userCountQuery)) {
foreach($row as $value) {    
$userCount = $value;
   }
}
echo '<h3 class="regUsersTitle">' . $userCount . ' Regular Users: </h3><div class="UserList"><ul>';
while ($row = mysqli_fetch_assoc($result))
{
echo '<li>';    
foreach($row as $key=>$value) {
echo $key , ' is ' , $value , '<br>';
}
echo '</li>'; 
}
echo '</ul></div>';

//Printar ut premium user list
$result = getAllPremUsers($db);
$userCountQuery = countPremUsers($db);
while ($row = mysqli_fetch_assoc($userCountQuery)) {
foreach($row as $value) {    
$userCount = $value;
   }
}
echo '<h3 class="premUsersTitle">' . $userCount . ' Premium Users: </h3><div class="premUserList"><ul>';
while ($row = mysqli_fetch_assoc($result))
{
echo '<li>';    
foreach($row as $key=>$value) {
echo $key , ' is ' , $value , '<br>';
}
echo '</li>'; 
}
echo '</ul></div>';
    
echo '<!doctype html>';
echo '<html>';
echo '<head>';
echo '<meta charset="utf-8">';
echo '<link rel="stylesheet" href="css/admin.css">';
echo '<script type="text/javascript" src="js/admin.js"></script>';
echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>';
echo '</head>';   
echo '<body>';
echo '<div class="loginDiv">';         
    if (isset($_SESSION['username'])) {echo 'Inloggad som: ' . $_SESSION['username'];}
    else {echo 'du är inte inloggad kuken!';}  
echo '</div>';       
echo '<div class=forms>'; 
echo '<div class="searchFormUser" id="searchFormUser">'; 
echo '<form action="';
echo htmlspecialchars($_SERVER["PHP_SELF"]);
echo '" method="post">'; 
echo '<input type="hidden" name="form" value="searchUser"/>';   
echo '<label for="userSearch">Search for Username:</label><br>'; 
echo '<input class="formInput" id="userSearch" type="text" name="userSearch"><br><br>';  
echo '<input class="formSubmit" type="submit" value="searchUser">';
echo '</form>'; 
echo '</div>'; 
echo '<div class="searchFormEmail" id="searchFormEmail">'; 
echo '<form action="';
echo htmlspecialchars($_SERVER["PHP_SELF"]);
echo '" method="post">'; 
echo '<input type="hidden" name="form" value="searchEmail"/>';  
echo '<label for="emailSearch">Search for Email:</label><br>'; 
echo '<input class="formInput" id="emailSearch" type="text" name="emailSearch"><br><br>'; 
echo '<input class="formSubmit" type="submit" value="searchEmail">'; 
echo '</form>'; 
echo '</div>'; 
echo '<div class="RegisterForm" id="RegisterForm">'; 
echo '<span class="RegisterTextTop">Create User</span><br>'; 
echo '<form action="';
echo htmlspecialchars($_SERVER["PHP_SELF"]);
echo '" method="post">'; 
echo '<input type="hidden" name="form" value="createUser"/>';    
echo '<label for="Uname">Username:</label><br>'; 
echo '<input class="formInput" id="Uname" type="text" name="username"><br>';
echo '<label for="Pword">Password:</label><br>'; 
echo '<input class="formInput" id="Pword" type="text" name="password"><br>'; 
echo '<label for="Pword2">Password again:</label><br>'; 
echo '<input class="formInput" id="Pword2" type="text" name="password2"><br>';     
echo '<label for="email">Email:</label><br>'; 
echo '<input class="formInput" id="email" type="text" name="email"><br><br>'; 
echo '<input class="formSubmit" type="submit" value="Register!">'; 
echo '</form>'; 
echo '</div>';       
echo '</div>'; 
echo '<script type="text/javascript">\ndocument.addEventListener("DOMContentLoaded", function () {\ncreateDelete();\ncreateGivePrem();\n});\n</script>'; 
echo '</body>';
echo '</html>';       
    
} else {
echo '<span class="results">You need to be logged in as an admin to view this page</span>';     
    }  
}
?>

