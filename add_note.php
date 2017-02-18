<?php
	// 模拟加载延迟
	sleep(1);
	
	// 加载核心文件
	require "config.php";
	
	// 获取新增数据
	$query = "INSERT INTO note (title, content, user, label, date) VALUES ('{$_POST['title']}', '{$_POST['content']}', '{$_POST['user']}', '{$_POST['label']}', NOW())";
	
	// 将数据插入数据库中
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>