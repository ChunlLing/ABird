<?php 
	require 'config.php';
	$user = array(
		'user' => $_POST['user'],
		'password' => $_POST['password'],
		'email' => $_POST['email'],
		'problem' => $_POST['problem'],
		'answer' => $_POST['answer']
	);
	$query = "INSERT INTO user (name, password, email, date, problem, answer) VALUES ('{$user['user']}', sha1('{$user['password']}'), '{$user['email']}', NOW(), '{$user['problem']}', '{$user['answer']}')";
	mysqli_query($conn, $query);
	echo json_encode($user);
	mysqli_close($conn);
?>