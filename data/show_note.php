<?php 
	require 'config.php';
	$start = $_GET['start'];
	if (!isset($start)) {
		$start = 0;
	}
	$count = $_GET['count'];
	$user = $_GET['user'];
	$sql = "SELECT name, title, label, content, txt, date FROM notetable WHERE name = '{$user}' ORDER BY date DESC LIMIT $start, $count";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>