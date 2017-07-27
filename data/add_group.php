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

	echo json_encode($group);
	mysqli_close($conn);
?>