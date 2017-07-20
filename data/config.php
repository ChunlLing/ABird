<?php
	header('Content-Type:text/html; charset=utf-8');
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PWD', '');
	define('DB_NAME', 'abird');
	$conn = mysqli_connect(DB_HOST, DB_USER, DB_PWD, DB_NAME);
	$sql = "SET NAMES UTF8";
	mysqli_query($conn, $sql);
?>