<?php 
	require 'config.php';
	$user = array(
		'user' => $_POST['user'],
		'teamId' => $_POST['teamId'],
		'status' => true,
		'isMember' => true
	);
	$sql = "SELECT name FROM user WHERE name = '{$user['user']}'";
	$result = mysqli_query($conn, $sql);
	if (($row = mysqli_fetch_assoc($result)) == NULL) {
		$user['status'] = false;
	} else {
		$sql = "SELECT t1.uid FROM group_member AS t1 JOIN user AS t2 ON (t1.uid = t2.id AND t1.gid = '{$user['teamId']}') WHERE t2.name = '{$user['user']}'";
		$result = mysqli_query($conn, $sql);
		if (($row = mysqli_fetch_assoc($result)) == NULL) {
			$user['isMember'] = false;
		}
	}
	echo json_encode($user);
	mysqli_close($conn);
?>