
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
	$.ajax({
		url: '/api/delete/' + task_id,
		type: 'DELETE',
		success: function() { $('li#' + task_id).slideUp() }
	});
}

function change_status(task_id, status) {
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
		}
	});
}

function add_task(task_name) {
		if (task_name.trim() == "") {
				return;
		}
	$.ajax({
		url: '/api/add',
		type: 'POST',
		contentType : 'application/json',
		data: JSON.stringify( { "title" : task_name } ),
		success: function(id) {
			$('ul').prepend('<li id="'+id+'">'+task_name+'<span class="delete">delete</span></li>');
			$('ul').add('h1');
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
				title = this.title;
				css_class = '';
				if (this.done)	{css_class = "done"};
				$('ul').prepend('<li id="'+id+'" class="'+css_class+'">'+title+'<span class="delete">delete</span></li>');
			});
		}
	});
}
