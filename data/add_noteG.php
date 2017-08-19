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
		'gid' => $_POST['gid'],
		'id' => $_POST['id']
	);
	if ($note['id']) {
		$query = "DELETE FROM groupnotetable WHERE id = {$note['id']}";
		mysqli_query($conn, $query);
	}
	$query = "INSERT INTO groupnotetable (name, title, label, content, txt, team, master, gid, date) VALUES ('{$note['user']}', '{$note['title']}', '{$note['label']}', '{$note['content']}', '{$note['txt']}', '{$note['team']}', '{$note['master']}', '{$note['gid']}', NOW())";
	mysqli_query($conn, $query);

	$query = "SELECT * FROM groupnotetable ORDER BY id DESC LIMIT 1";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));

	echo json_encode($result);
	mysqli_close($conn);
?>