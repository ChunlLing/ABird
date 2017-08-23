<?php 
	require 'config.php';
	$group = array(
		'master'  => $_POST['user'],
		'id' =>$_POST['id']
	);
	$query = "DELETE FROM grouptable WHERE id = {$group['id']} AND master = '{$group['master']}'";
	mysqli_query($conn, $query);
	echo mysqli_query($conn, $query);
	mysqli_close($conn);
?>