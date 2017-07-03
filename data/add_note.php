<?php
	// 模拟加载延迟
	sleep(1);
	
	// 加载核心文件
	require "config.php";
	
	// 获取新增数据
	$query = "INSERT INTO note (title, content, user, label, date) VALUES ('{$_POST['post_title']}', '{$_POST['post_content']}', '{$_POST['user']}', '{$_POST['post_label']}', NOW())";
	
	// 将数据插入数据库中
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>