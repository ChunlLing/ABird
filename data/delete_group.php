<?php 
	require 'config.php';
	$group = array(
		'master'  => $_POST['user'],
		'id' =>$_POST['id']
	);
	$query = "DELETE FROM `group` WHERE id = {$group['id']} AND master = '{$group['master']}'";
	mysqli_query($conn, $query);
	$query = "DELETE FROM note_group WHERE gid = {$group['id']} AND master = '{$group['master']}'";
	mysqli_query($conn, $query);
	mysqli_close($conn);
?>