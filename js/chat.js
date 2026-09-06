var msgArea = document.getElementById('msg');
var msgForm = document.getElementById('msgForm');
    msgArea.onkeyup = isEnter;

function isEnter (keypress) {
    if (keypress.key == 'Enter') {
     msgForm.submit();
    }
}    