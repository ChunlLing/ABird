<?php 
	require 'config.php';
	$start = $_POST['start'];
	$gid = $_POST['gid'];
	$count = $_POST['count'];
	$user = $_POST['user'];
	if (!isset($start)) {
		$start = 0;
	}
	$sql = "SELECT * FROM groupnotetable WHERE name = '{$user}' AND gid = '{$gid}' ORDER BY date DESC LIMIT $start, $count";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>