<?php

$db = mysqli_connect('localhost', 'root', '', 'wordsdb');

$sql = "SELECT * FROM swedishwords";

$result = mysqli_query($db, $sql);

$swedishWords = array();

while ($row = mysqli_fetch_assoc($result))
{
$swedishWords[] = $row;
}

$sql = "SELECT * FROM englishwords";

$result = mysqli_query($db, $sql);

$englishWords = array();

while ($row = mysqli_fetch_assoc($result))
{
$englishWords[] = $row;
}

$englishWordsJSON = json_encode($englishWords, JSON_UNESCAPED_UNICODE);
file_put_contents('php/englishWords.json', $englishWordsJSON);

$swedishWordsJSON = json_encode($swedishWords, JSON_UNESCAPED_UNICODE);
file_put_contents('php/swedishWords.json', $swedishWordsJSON);
?>