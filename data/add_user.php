<?php 
	require 'config.php';
	$query = "INSERT INTO usertable (name, password, email, date, problem, answer) VALUES ('{$_POST['user']}', sha1('{$_POST['password']}'), '{$_POST['email']}', NOW(), '{$_POST['problem']}', '{$_POST['answer']}')";
	mysqli_query($conn, $query);
	// die('error: '.mysqli_error($conn));
	echo mysqli_affected_rows($conn);
	mysqli_close($conn);

 ?>