
$(function() {

	get_tasks();

	$('ul').on('click', 'li', function() {
		task_id = $(this).attr('id');
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

function add_task(task_name) {
	$.ajax({
		url: '/api/add',
		type: 'POST',
		contentType : 'application/json',
		data: JSON.stringify( { "title" : task_name } ),
		success: function(id) {
			$('ul').prepend('<li id="'+id+'">'+task_name+'</li>');
			$('ul').add('h1');
		}
	});
}

function get_tasks() {
	$.ajax({
		url: '/api/tasks',
		type: 'GET',
		success: function(data) {
			console.log(data);
			$(data).each(function(){
				console.log(this);
				$('ul').prepend('<li id="' + this.id + '">' + this.title + '</li>');
			});
		}
	});
}
