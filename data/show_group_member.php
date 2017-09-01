<?php 
	require 'config.php';
	$teamId = $_POST['teamId'];
	$sql = "SELECT name FROM user AS t1 JOIN group_member AS t2 ON t1.id = t2.uid WHERE t2.gid = '{$teamId}' ORDER BY t2.date";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>