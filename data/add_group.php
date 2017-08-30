<?php 
	// sleep(3);
	require "config.php";
	$group = array(
		'teamName' => $_POST['teamName'],
		'teamMaster' => $_POST['teamMaster'],
		'teamDescription' => $_POST['teamDescription'],
		'teamId' => $_POST['teamId']
	);
	if ($group['teamId']) {
		$query = "UPDATE `group` SET team = '{$group['teamName']}', description = '{$group['teamDescription']}', date = NOW() WHERE id = '{$group['teamId']}'";
		mysqli_query($conn, $query);
		$query = "UPDATE note_group SET team = '{$group['teamName']}' WHERE gid = '{$group['teamId']}'";
		mysqli_query($conn, $query);
		$query = "SELECT * FROM `group` WHERE id = '{$group['teamId']}'";
	} else {
		$query = "INSERT INTO `group` (team, master, description, date) VALUES ('{$group['teamName']}', '{$group['teamMaster']}', '{$group['teamDescription']}', NOW())";
		mysqli_query($conn, $query);
		$query = "SELECT * FROM `group` ORDER BY id DESC LIMIT 1";
	}
	
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));

	echo json_encode($result);
	mysqli_close($conn);
?>