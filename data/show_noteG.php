<?php 
	require 'config.php';
	$start = $_POST['start'];
	$team = $_POST['team'];
	$count = $_POST['count'];
	$user = $_POST['user'];
	if (!isset($start)) {
		$start = 0;
	}
	$sql = "SELECT id, name, title, label, content, txt, team, master date FROM groupnotetable WHERE name = '{$user}' AND team = '{$team}' ORDER BY date DESC LIMIT $start, $count";
	$result = mysqli_query($conn, $sql);
	$output = [];
	while (($row = mysqli_fetch_assoc($result)) !== NULL) {
		$output[] = $row;
	}
	echo json_encode($output);
?>