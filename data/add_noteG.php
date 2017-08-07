<?php 
	// sleep(3);
	require "config.php";
	$note = array(
		'user' => $_POST['user'],
		'title' => $_POST['title'],
		'label' => $_POST['label'],
		'content' => $_POST['content'],
		'txt' => $_POST['txt'],
		'team' => $_POST['team'],
		'master' => $_POST['master'],
		'id' => $_POST['id']
	);
	$query = "INSERT INTO groupnotetable (name, title, label, content, txt, team, master, date) VALUES ('{$note['user']}', '{$note['title']}', '{$note['label']}', '{$note['content']}', '{$note['txt']}', '{$note['team']}', '{$note['master']}', NOW())";
	mysqli_query($conn, $query);

	$query = "SELECT * FROM groupnotetable ORDER BY id DESC LIMIT 1";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));

	$note['id'] = $result['id'];
	$note['date'] = $result['date'];

	echo json_encode($note);
	mysqli_close($conn);
?>