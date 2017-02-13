<?php 
	// 设置编码格式，防止出现中文乱码
	header('Content-Type:text/html; charset=utf-8');

	// 服务器IP地址
	define('DB_HOST', 'localhost');

	// mySQL用户名
	define('DB_USER', 'root');

	// mySQL密码
	define('DB_PWD', 'fwork0310');

	// mySQL数据库
	define('DB_NAME', 'abrid');

	// 连接MySQL
	$conn = @mysql_connect(DB_HOST, DB_USER, DB_PWD) or die('数据库连接失败：'.mysql_error());

	// 连接数据库
	@mysql_select_db(DB_NAME) or die('数据库错误：'.mysql_error());

	@mysql_query('SET NAMES UTF8') or die('字符集错误：'.mysql_error());
 ?>