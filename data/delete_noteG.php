<?php 
	require "config.php";
	$note = array(
		'id' => $_POST['id']
	);
	$query = "DELETE FROM groupnotetable WHERE id = {$note['id']}";
	mysqli_query($conn, $query);
	mysqli_close($conn);
?>