<?php 
	require 'config.php';
	$msg = array(
		'memberName' => $_POST['memberName'],
		'teamId' => $_POST['teamId'],
		'teamMaster' => $_POST['teamMaster'],
		'memberInvitation' => $_POST['memberInvitation']
	);
	$query = "INSERT INTO group_member_message (member_name, team_id, member_invitation, date) VALUES ('{$msg['memberName']}', '{$msg['teamId']}', '{$msg['memberInvitation']}', NOW())";
	mysqli_query($conn, $query);
	echo json_encode($msg);
	mysqli_close($conn);
?>