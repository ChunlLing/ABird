<?php 
	require 'config.php';
	$user = $_POST['user'];
	$sql = "SELECT id, team, master, description, date FROM grouptable WHERE master = '{$user}' ORDER BY CONVERT( team USING gbk ) ASC";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>