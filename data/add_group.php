<?php 
	// sleep(3);
	require "config.php";
	$group = array(
		'teamName' => $_POST['teamName'],
		'teamMaster' => $_POST['teamMaster'],
		'teamDescription' => $_POST['teamDescription']
	);
	$query = "INSERT INTO grouptable (team, master, description, date) VALUES ('{$group['teamName']}', '{$group['teamMaster']}', '{$group['teamDescription']}', NOW())";
	mysqli_query($conn, $query);

	$query = "SELECT * FROM grouptable ORDER BY id DESC LIMIT 1";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));

	/*$group['id'] = $result['id'];
	$group['date'] = $result['date'];*/

	echo json_encode($result);
	mysqli_close($conn);
?>