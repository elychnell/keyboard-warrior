<?php
session_start();
require_once('php/db.php');
require_once('php/userFunc.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // collect value of input field
  $pageInput = $_POST['pageInput'];
  $firstVisit = $_POST['firstVisit'];
  if (isset($_POST['user'])) {
      $user = $_POST['user'];
  }
  if (isset($_POST['friend'])) {
      $friend = $_POST['friend'];
  }  
} else {
$pageInput = '';
$user = '';
$friend = '';
$firstVisit = 'true';
       }
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>    
<script type="text/javascript" src="js/settings.js"></script>    
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="js/words.js"></script>

<script type="text/javascript">    
var oldURL = '<?php echo $pageInput; ?>';
var user = '<?php echo $user; ?>';
var friend = '<?php echo $friend; ?>';
var firstVisit = '<?php echo $firstVisit; ?>';
var userId = <?php if ($user !== '') { echo getUserID($db, $user); } else { echo 0; } ?>;
var friendId = <?php if ($friend !== '') { echo getUserID($db, $friend); } else { echo 0; } ?>;
    
document.addEventListener("DOMContentLoaded", function () {  
if (oldURL == 'messageFriend.php') { 
sendMsg(user, friend);                                  }
});
</script>     
</head>
<body>
    
<div class="pageContent">
<header class="header">
<div class="logoLeft"><img src="img/kbwlogo.png"/></div>
 
<div class="logoMiddle">
<div class="scoredisplay">
<span class="playerName"><span id="Pname">
<?php if (isset($_SESSION['username'])) {
echo $_SESSION['username'];} else {echo 'Guest';}
?>
</span></span>    
<span class="scorefield">Score:<br><span id="score">0</span></span>
<span class="wrongfield">Error:<br><span id="wrong">0</span></span>
</div>
<span class="WPMfield">WPM: <span id="WPM">0</span></span>
</div>  

<div class="adBoardTop"><img src="img/LeaderAd.png"/></div>
<hr class="topHR"/>     
</header>

<!-- LEFTSIDETOP -->
<aside class="leftSideTop">
    
<div class="loginDiv">   
    <?php       
    if (isset($_SESSION['username'])) {
        echo 'Logged in as: ' . $_SESSION['username'] .'<br>';
        if ($_SESSION['userType'] == 'Prem') { 
        echo $_SESSION['username'] . ' has premium';
        } else {echo $_SESSION['username'] . ' no premium';} 
    }
    else {echo 'Not logged in';}
    ?>
</div>

<div class="MenuLeft">
<ul class="BtnRow">
<li><a class="button" href="index.php">Practice</a></li>
<li><a class="button" href="multiplayer.php">Multiplayer</a></li>
<li><a class="button" href="head2head.php">Head 2 Head</a></li>
<li><a class="button" onclick="showLogin()">Log in</a></li>
<li><a class="button" onclick="showSettings()">Settings</a></li>
<li><a class="button" href="admin.php">Admin</a></li>
</ul>
</div>    
</aside>
    
<!-- RIGHTSIDE -->    
<aside class="leftSideBottom">

<?php      
if (isset($_SESSION['username'])) { 
echo '<div class="FriendsBox">';
$friendCountQuery = countFriends($db, $_SESSION['username']); 
while ($row = mysqli_fetch_assoc($friendCountQuery)) {
foreach($row as $value) { $friendCount = $value; } }

echo '<h5 class="friendCount">' . $friendCount . ' Friends</h5>';
echo '<span class="friendsTitle">Friends</span>';
echo '<button class=addFriend onclick="showAddFriend()"><span>+</span></button>';
    
$result = getfriends($db, $_SESSION['username']);    
echo '<div class="friendList"><ul>';
while ($row = mysqli_fetch_assoc($result))
{ 
foreach ($row as $key=>$value) {
if ($key == 'userTwo' && $value !== $_SESSION['username'] || $key == 'userOne' && $value !== $_SESSION['username']) {
    
    echo '<li id="friend_' . $value . '" class="friend" onmouseover="friendBorderOn(\'friend_'. $value .'\');" onmouseout="friendBorderOff(\'friend_'. $value .'\');" onclick="friendMenu(\'' . $_SESSION['username'] . '\', \'' . $value . '\');">'; 
    echo '<span class="friendSpan" id="friend_' . $value . '_span">' . $value . '</span>';
    }   
}
echo '</li>'; 
}
echo '</ul></div></div>';  
}
else {
echo '<div class="adBoardRightSide"><img src="img/reklam.png"/></div>';
}
?>    
  
</aside>
<main id="main" class="main content">
<div class="Timer" id="Timer">
<span>Time: <span id="TimerMin">0</span><span id="TimerSec">:00</span></span>    
</div>
<div class="ProgressBarSection">

<div class="P1BarCont">
<span class="BarName" id="BarP1Name">
<?php if (isset($_SESSION['username'])) {
echo $_SESSION['username'];} else {echo 'Guest';}
?>
</span>    
<div class="P1ProgressBar" Id="P1Progress"></div>
</div></div>
    
<div class="input-div">
<input type="text" class="input-field" id="input-field" value="">
</div>    
<div class="text-view">
<div class="main-text-field" id="main-text-field">
<div class="ltrcontainer" id="ltrcontainer">
</div>
<p id="infoMsg" style="display:block;">Click the text field to play!</p>
</div>
</div>
<div class="KeyboardContainer" id="KeyboardContainer">    
<svg class="Keyboard FullKeyboard" viewBox="0 0 1000 250">
<defs><pattern id="key-zone-a" patternUnits="userSpaceOnUse" width="10" height="10">
<path class="Zone--background" d="M0 0h10v10H0z"></path>
<path class="Zone--foreground-a" d="M-1 1l2-2M0 10L10 0M9 11l2-2"></path></pattern>
<pattern id="key-zone-b" patternUnits="userSpaceOnUse" width="10" height="10">
<path class="Zone--background" d="M10 0H0v10h10z"></path>
<path class="Zone--foreground-b" d="M11 1L9-1m1 11L0 0m1 11l-2-2"></path>
</pattern></defs>
<rect class="Keyboard-frame" x="0" y="0" width="965" height="215" rx="10" ry="10"></rect>
<svg class="Keyboard-layout" x="3" y="3">
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z1" x="0" y="0" id="Backquote">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="15">§</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="30">½</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z1" x="42" y="0" id="num1">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">!</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">1</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z2" x="84" y="0" id="num2">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">@</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">2</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">"</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z3" x="126" y="0" id="num3">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">#</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">3</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">£</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="168" y="0" rx="5" id="num4">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">¤</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">4</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">$</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="210" y="0" id="num5">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">%</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">5</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="252" y="0" id="num6">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">&</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">6</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="294" y="0" id="num7">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">/</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">7</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">{</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z6" x="336" y="0" id="num8">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">(</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">8</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">[</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z7" x="378" y="0" id="num9">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">)</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">9</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">]</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="420" y="0" id="num0">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">=</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">0</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">}</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="462" y="0" id="Plus">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="21" y="18">?</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">+</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="30">\</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="504" y="0" id="Accent">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">´</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="18" y="18">`</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="546" y="0" id="Backspace">
<rect class="keyboardButton" x="0" y="0" width="83" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="10" y="25">Backspace</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="648" y="0" id="Insert">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="10" y="16">Ins</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="690" y="0" id="Home">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="2" y="16">Home</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="732" y="0" id="PageUp">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="4" y="16">Page</text>
<text class="KeyboardSymbol" x="8" y="30">Up</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="792" y="0" id="NumLock">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="4" y="16">Num</text>
<text class="KeyboardSymbol" x="5" y="28">Lock</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="834" y="0" id="NumpadDivide">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="18" y="20">/</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="876" y="0" id="NumpadMultiply">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="18" y="20">*</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="918" y="0" id="NumpadSubtract">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="18" y="18">−</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="0" y="42" id="Tab">
<rect class="keyboardButton" x="0" y="0" width="63" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="20" y="25">Tab</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z1" x="65" y="42" id="KeyQ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">Q</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z2" x="107" y="42" id="KeyW">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">W</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z3" x="149" y="42" id="KeyE">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">E</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="191" y="42" id="KeyR">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">R</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="233" y="42" id="KeyT">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">T</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="275" y="42" id="KeyY">
<rect class="keyboardButton" x="0" y="0" width="40" height="40"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">Y</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="317" y="42" id="KeyU">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">U</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z6" x="359" y="42" id="KeyI">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">I</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z7" x="401" y="42" id="KeyO">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">O</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="443" y="42" id="KeyP">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">P</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="485" y="42" id="KeyÅ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="23">Å</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="527" y="42" id="Diaeresis">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="20" y="18">^</text>  
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="10" y="18">¨</text>  
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="15" y="28">~</text></svg> 
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="569" y="42" id="Enter"> 
<path class="entergate" d="m 4 0 h 51 a 5 5 0 0 1 5 5 v 72 a 5 5 0 0 1 -5 5 h -40 a 5 5 0 0 1 -5 -5 v -34 a 5 5 0 0 0 -3 -3 h -3 a 5 5 0 0 1 -3 -3 v -34 a 3 3 0 0 1 3 -3 z" />  // BIG ENTER
<text class="KeyboardSymbol" x="15" y="25">Enter</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="648" y="42" id="Delete">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="8" y="16">Del</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="690" y="42" id="End">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="8" y="16">End</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="732" y="42" id="PageDown">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="3" y="16">Page</text>
<text class="KeyboardSymbol" x="2" y="30">Down</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="792" y="42" id="Numpad7">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">7</text>
<text class="KeyboardSymbol" x="39" y="32" text-anchor="end">Home</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="834" y="42" id="Numpad8">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">8</text>
<text class="KeyboardSymbol" x="35" y="32" text-anchor="end">↑</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="876" y="42" id="Numpad9">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">9</text>
<text class="KeyboardSymbol" x="39" y="32" text-anchor="end">Pg Up</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="918" y="42" id="NumpadAdd">
<rect class="keyboardButton" x="0" y="0" width="40" height="82" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="15" y="30">+</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="0" y="84" id="CapsLock">
<rect class="keyboardButton" x="0" y="0" width="70" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="18" y="18">Caps</text>
<text class="KeyboardSymbol" x="18" y="30">Lock</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z1" x="72" y="84" id="KeyA">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">A</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z2" x="114" y="84" id="KeyS">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">S</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z3" x="156" y="84" id="KeyD">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">D</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="198" y="84" id="KeyF">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">F</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="240" y="84" id="KeyG">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">G</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="282" y="84" id="KeyH">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">H</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="324" y="84" id="KeyJ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">J</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z6" x="366" y="84" id="KeyK">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">K</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--depressed KeyboardKey--zone-z7" x="408" y="84" id="KeyL">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">L</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="450" y="84" id="KeyÖ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="23">Ö</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="492" y="84" id="KeyÄ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="14" y="23">Ä</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="534" y="84" id="Apostrophe"> // ' * ENTEREDIT
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="11" y="22">'</text>
<text class="KeyboardSymbol" x="20" y="22">*</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="792" y="84" id="Numpad4">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">4</text>
<text class="KeyboardSymbol" x="35" y="32" text-anchor="end">←</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="834" y="84" id="Numpad5">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">5</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="876" y="84" id="Numpad6">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">6</text>
<text class="KeyboardSymbol" x="35" y="32" text-anchor="end">→</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="0" y="126" id="ShiftLeft">
<rect class="keyboardButton" x="0" y="0" width="50" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="10" y="25">Shift</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="52" y="126" id="< | >">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="5" y="16"><</text>
<text class="KeyboardSymbol" x="25" y="16">></text>
<text class="KeyboardSymbol" x="18" y="30">|</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z1" x="94" y="126" id="KeyZ">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">Z</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z2" x="136" y="126" id="KeyX">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">X</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z3" x="178" y="126" id="KeyC">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">C</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="220" y="126" id="KeyV">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">V</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z4" x="262" y="126" id="KeyB">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">B</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="304" y="126" id="KeyN">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="23">N</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z5" x="346" y="126" id="KeyM">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="13" y="17">M</text>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="29">µ</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z6" x="388" y="126" id="Comma">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="22" y="16">;</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="12" y="16">,</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z7" x="430" y="126" id="Period">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="22" y="16">:</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="12" y="16">.</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-z8" x="472" y="126" id="Hyphen">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="22" y="16">_</text>
<text class="KeyboardSymbol KeyboardSymbol--secondary" x="12" y="16">-</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="514" y="126" id="ShiftRight">
<rect class="keyboardButton" x="0" y="0" width="115" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="40" y="24">Shift</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="690" y="126" id="ArrowUp">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="20" y="20" text-anchor="middle">↑</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="792" y="126" id="Numpad1">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">1</text>
<text class="KeyboardSymbol" x="32" y="32" text-anchor="end">End</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="834" y="126" id="Numpad2">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">2</text>
<text class="KeyboardSymbol" x="22" y="33" text-anchor="end">↓</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="876" y="126" id="Numpad3">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="14" y="18">3</text>
<text class="KeyboardSymbol" x="39" y="32" text-anchor="end">Pg Dn</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="918" y="126" id="NumpadEnter">
<rect class="keyboardButton" x="0" y="0" width="40" height="82" rx="5"></rect>
<text class="KeyboardSymbol" x="4" y="36">Enter</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--depressed KeyboardKey--zone-null" x="0" y="168" id="ControlLeft">
<rect class="keyboardButton" x="0" y="0" width="63" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="20" y="25">Ctrl</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="65" y="168" id="AltLeft">
<rect class="keyboardButton" x="0" y="0" width="63" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="20" y="25">Alt</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="130" y="168" id="Space">
<rect class="keyboardButton" x="0" y="0" width="369" height="40" rx="5"></rect></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="501" y="168" id="AltRight">
<rect class="keyboardButton" x="0" y="0" width="63" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="13" y="25">Alt Gr</text></svg>
<svg class="KeyboardKey KeyboardKey--special KeyboardKey--zone-null" x="566" y="168" id="ControlRight">
<rect class="keyboardButton" x="0" y="0" width="63" height="40" rx="5"></rect>
<text class="KeyboardSymbol" x="20" y="25">Ctrl</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="648" y="168" id="ArrowLeft">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="20" y="18" text-anchor="middle">←</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="690" y="168" id="ArrowDown">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="20" y="18" text-anchor="middle">↓</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="732" y="168" id="ArrowRight">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="20" y="18" text-anchor="middle">→</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="792" y="168" id="Numpad0">
<rect class="keyboardButton" x="0" y="0" width="82" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="40" y="18">0</text>
<text class="KeyboardSymbol" x="55" y="30" text-anchor="end">Ins</text></svg>
<svg class="KeyboardKey KeyboardKey--simple KeyboardKey--zone-null" x="876" y="168" id="NumpadDecimal">
<rect class="keyboardButton" x="0" y="0" width="40" height="40" rx="5"></rect>
<text class="KeyboardSymbol KeyboardSymbol--primary" x="18" y="10">,</text>
<text class="KeyboardSymbol" x="30" y="28" text-anchor="end">Del</text></svg>
</svg>
<svg class="KeyboardZones" x="0" y="0">
<svg x="41" y="41">
<rect x="35" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger1"></rect>
<rect x="76" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger2"></rect>
<rect x="119" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger3"></rect>
<rect x="160" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger4"></rect>
<rect x="286" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger5"></rect>
<rect x="327" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger6"></rect>
<rect x="370" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger7"></rect>
<rect x="413" y="45" width="40" height="40" rx="5" opacity=0.4 class="FingerMark Finger8"></rect>
</svg>
</svg>
</div>    
</div>
    
<!-- LIGHTBOXXES -->
<div class="LoginDim hidden" id="LoginDim">
<div class="LoginBox" id="LoginBox">
<div class="LoginCloseBox" id="LoginCloseBox" onmouseover="loginBorderOn()" onmouseout="loginBorderOff()" onclick="hideLogin()">
<a class="LoginClose" id="LoginClose">X</a>
</div>
<div class="LoginForm" id="LoginForm">
<span class="LoginTextTop">Please log in</span>
<form action="php/login.php" method="post">
<label for="Uname">Username:</label><br>
<input class="formInput" id="loginUname" type="text" name="username"><br>
<label for="loginPword">Password:</label><br>
<input class="formInput" id="loginPword" type="password" name="password"><br><br>
<input type="hidden" class="PageInput" id="PageLoginInput" name="PageLoginInput" value="index">    
<input class="formSubmit" type="submit" value="Log in">
</form>
<span class="LoginTextBottom">Keyboard Warrior!</span>
<a class="RegisterLink" id="RegisterLink" onclick="showRegister()">Need an account: Register here!</a>
</div>
</div>   
</div>
<div class="RegisterDim hidden" id="RegisterDim">
<div class="RegisterBox" id="RegisterBox">
<div class="RegisterCloseBox" id="RegisterCloseBox" onmouseover="RegisterBorderOn()" onmouseout="RegisterBorderOff()" onclick="hideRegister()">
<a class="RegisterClose" id="RegisterClose">X</a>
</div>
<div class="RegisterForm" id="RegisterForm">
<span class="RegisterTextTop">Please enter the following details</span>
<form action="php/register.php" method="post">
<label for="Uname">Username:</label><br>
<input class="formInput" id="regUname" type="text" name="username"><br>
<label for="Pword">Password:</label><br>    
<input class="formInput" id="regPword" type="text" name="password"><br>
<label for="Pword2">Password again:</label><br>
<input class="formInput" id="regPword2" type="text" name="password2"><br>    
<label for="email">Email:</label><br>
<input class="formInput" id="email" type="text" name="email"><br><br>
<input class="formSubmit" type="submit" value="Register!">
</form>
<span class="RegisterTextBottom">Welcome Keyboard Warrior!</span>
</div>
</div>   
</div>    
<div class="SettingsDim hidden" id="SettingsDim">
<div class="SettingsBox" id="SettingsBox">
<div class="SettingsCloseBox" id="SettingsCloseBox" onmouseover="settingsBorderOn()" onmouseout="settingsBorderOff()" onclick="hideSettings()">
<a class="SettingsClose" id="LoginClose">X</a></div>
<div class="SettingsForm" id="SettingsForm">
<span class="SettingsTextTop">Settings: </span>
<form action="php/settings.php" method="post">
<label for="TextLang">Text language:</label><br>
<select class="formInput" id="TextLang" type="text" name="TextLang">
  <option value="English" selected>English</option>
  <option value="Swedish">Swedish</option>
</select><br>
<label for="KeyboardType">Keyboard type:</label><br>
<select class="formInput" id="KeyboardType" type="text" name="KeyboardType">
  <option value="English">English</option>
  <option value="Swedish" selected>Swedish</option>
</select><br>
    
<label for="TextSize">Text Size:</label><br>
<select class="formInput" id="TextSize" type="text" name="TextSize">
  <option value="16px">12 pt</option>
  <option value="20px">15 pt</option>
  <option value="25.34px">19 pt</option>  
  <option value="32px">24 pt</option>
  <option value="36px">27 pt</option>
  <option value="40px">30 pt</option>
  <option value="48px">36 pt</option>
  <option value="53.3333px">40 pt</option>
  <option value="61.335px">46 pt</option>
  <option value="76px">57 pt</option>
</select>  
<br>
<label for="TextFont">Text Font:</label><br>
<select class="formInput" id="TextFont" type="text" name="TextFont">
  <option value="Font1" selected>Font1</option>
  <option value="Font2">Font2</option>
  <option value="Font3">Font3</option>
  <option value="Font4">Font4</option>
  <option value="Font5">Font5</option>
</select>  
<br>
<label for="sColor">Site color:</label><br>
<select class="formInput" id="sColor" type="text" name="sColor">
  <option value="Green">Green</option>
  <option value="Blue">Blue</option>
</select><br><br>
<input type="hidden" class="PageInput" id="PageInput" name="PageInput" value="index">
<input class="formSubmit" type="submit" value="Save Settings">
</form>
<span class="SettingsTextBottom">Keyboard Warrior!</span>  
</div>
</div>   
</div>
<div class="addFriendDim hidden" id="addFriendDim">
<div class="addFriendBox" id="addFriendBox">
<div class="addFriendCloseBox" id="addFriendCloseBox" onmouseover="addFriendBorderOn()" onmouseout="addFriendBorderOff()" onclick="hideAddFriend()">
<a class="addFriendClose" id="addFriendClose">X</a>
</div>
<div class="addFriendForm" id="addFriendForm">
<span class="addFriendTextTop">Search for Friend:</span>
<form action="php/addFriend.php" method="post">
<label for="friendUname">Username:</label><br>
<input class="formInput" id="friendUname" type="text" name="friendUserName">
<input type="hidden" class="userName" id="userName" name="userName" value="<?php if (isset($_SESSION['username'])) {
        echo $_SESSION['username']; };?>">    
<input class="formSubmit" type="submit" value="Register!"><br><br>
</form>
<span class="RegisterTextBottom">Welcome Keyboard Warrior!</span>
</div>
</div>   
</div>           
</body>
</html>