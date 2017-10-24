let tempTaskCount = 0;
$(function() {

	$('input').focus();

	get_tasks();

	$('ul').on('click', 'li', function() {
		task_id = $(this).attr('id');
		// delete_task(task_id)
		status = !$(this).hasClass('done');
		change_status(task_id, status)
	});

	$('ul').on('click', '.delete', function() {
		task_id = $(this).parent('li').attr('id');
		delete_task(task_id)
	});

	$('input').keyup(function(e){
		if(e.keyCode == 13) {
			task_name = $(this).val();
			$(this).val('');
			add_task(task_name);
		}
	});
});

function delete_task(task_id) {
	if (!$('li#' + task_id).hasClass('busy')) {
		$('li#' + task_id).addClass('busy');
		$.ajax({
			url: '/api/delete/' + task_id,
			type: 'DELETE',
			success: function() {
				$('li#' + task_id).slideUp(400, function() {
					$('li#' + task_id).remove();
				});
			}
		});
	}
}

function change_status(task_id, status) {
	if (!$('li#' + task_id).hasClass('busy')) {
		$('li#' + task_id).addClass('busy');
		$.ajax({
			url: '/api/status/' + task_id,
			type: 'PUT',
			contentType : 'application/json',
			data: JSON.stringify( { "status" : status } ),
			success: function(new_status) {
				if (new_status) {
					$('li#' + task_id).addClass('done');
				}
				else {
					$('li#' + task_id).removeClass('done');
				}
				$('li#' + task_id).removeClass('busy');
			}
		});
	}
}

function add_task(task_name) {
	if (task_name.trim() == "") {
			return;
	}
	let tempId = tempTaskCount = tempTaskCount + 1;
	$('ul').prepend('<li id="'+tempId+'" class="busy">'+task_name+'<span class="delete">delete</span></li>');
	$('ul').add('h1');
	$.ajax({
		url: '/api/add',
		type: 'POST',
		contentType : 'application/json',
		data: JSON.stringify( { "title" : task_name } ),
		success: function(id) {
			$('li#' + tempId).attr('id', id);
			$('li#' + id).removeClass('busy');
		}
	});
}

function get_tasks() {
	$.ajax({
		url: '/api/tasks',
		type: 'GET',
		success: function(data) {
			$(data).each(function(){
				id = this.id;
				if (parseInt(id) >= tempTaskCount) {
					tempTaskCount = id + 1;
				}
				title = this.title;
				css_class = '';
				if (this.done)	{css_class = "done"};
				$('ul').prepend('<li id="'+id+'" class="'+css_class+'">'+title+'<span class="delete">delete</span></li>');
			});
		}
	});
}
