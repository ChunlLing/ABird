<?php 
	sleep(3);
	require "config.php";
	$note = array(
		'user' => $_POST['user'],
		'title' => $_POST['title'],
		'type' => $_POST['type'],
		'label' => $_POST['label'],
		'content' => $_POST['content']
	);
	$query = "INSERT INTO notetable (name, title, type, label, content, date) VALUES ('{$note['user']}', '{$note['title']}', '{$note['type']}', '{$note['label']}', '{$note['content']}', NOW())";
	mysqli_query($conn, $query);
	echo json_encode($note);
	mysqli_close($conn);
?>