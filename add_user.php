<?php 
	sleep(3);
	// 引入核心文件
	require 'config.php';
	
	// 新增的sql语句
	$query = "INSERT INTO user (user, pass, email, date) VALUES ('{$_POST['user']}', sha1('{$_POST['pass']}'), '{$_POST['email']}', NOW())";
	
	// 执行sql语句
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
 ?>