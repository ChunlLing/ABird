<?php 
	// sleep(3);
	require "config.php";
	$note = array(
		'user' => $_POST['user'],
		'title' => $_POST['title'],
		'type' => $_POST['type'],
		'label' => $_POST['label'],
		'content' => $_POST['content'],
		'txt' => $_POST['txt'],
		'trigger' => $_POST['trigger'],
		'id' => $_POST['id']
	);
	if ($note['trigger'] == 'note-edit') {
		$query = "DELETE FROM note_person WHERE id = {$note['id']}";
		mysqli_query($conn, $query);
	}
	$query = "INSERT INTO note_person (name, title, type, label, content, txt, date) VALUES ('{$note['user']}', '{$note['title']}', '{$note['type']}', '{$note['label']}', '{$note['content']}', '{$note['txt']}', NOW())";
	mysqli_query($conn, $query);

	$query = "SELECT * FROM note_person ORDER BY id DESC LIMIT 1";
	$result = mysqli_fetch_assoc(mysqli_query($conn, $query));

	$note['id'] = $result['id'];
	$note['date'] = $result['date'];

	echo json_encode($note);
	mysqli_close($conn);
?>