<?php 
	require 'config.php';
	$start = $_POST['start'];
	if (!isset($start)) {
		$start = 0;
	}
	$count = $_POST['count'];
	$user = $_POST['user'];
	$sql = "SELECT id, name, title, label, content, txt, date FROM notetable WHERE name = '{$user}' ORDER BY date DESC LIMIT $start, $count";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>