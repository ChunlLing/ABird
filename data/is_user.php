<?php 
	require 'config.php';
	$user = array(
		'user' => $_POST['user'],
		'status' => true
	);
	$sql = "SELECT name FROM user WHERE name = '{$user['user']}'";
	$result = mysqli_query($conn, $sql);
	if (($row = mysqli_fetch_assoc($result)) == NULL) {
		$user['status'] = false;
	}
	echo json_encode($user);
	mysqli_close($conn);
?>