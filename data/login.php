<?php 
	require 'config.php';
	$user = array(
		'user' => $_POST['user'],
		'password' => sha1($_POST['password']),
		'status' => false
	);
	$query = "SELECT name, password, email FROM usertable WHERE name = '{$user['user']}' AND password = '{$user['password']}'";
	$result = mysqli_query($conn, $query);
	if (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$user['status'] = true;
		$user['email'] = $row['email'];
	}
	echo json_encode($user);
	mysqli_close($conn);
 ?>