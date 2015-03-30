// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page oad
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);

	// Delete user link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

function populateTable() {
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/users/userlist', function(data) {
		userListData = data;
		// For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
	});
}

function showUserInfo(event) {
	event.preventDefault();

	// Retrive username from link rel attribute
	var thisUsername = $(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) {
		return arrayItem.username;
	}).indexOf(thisUsername);

	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}

function addUser(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if ($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still 0.
	if (errorCount === 0) {
		// Compile all user info into one object
		var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to adduser service
        $.ajax({
        	type: 'POST',
        	data: newUser,
        	url: '/users/adduser',
        	dataType: 'JSON'
        }).done(function(res) {
        	// Check for successful (blank) response
        	if (res.msg === '') {
        		// Clear the form inputs
        		$('#addUser fieldset input').val('');

        		// Update the table
        		populateTable();
        	} else {
        		// If something goes wrong, alert the error message that our service returned
        		alert('Error: ' + res.msg);
        	}
        });
	} else {
		alert('Please fill in all fields');
		return false;
	}
}

function deleteUser(event) {
	event.preventDefault();

	// Pop up confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(res) {
			if (res.msg === '') {
				// Empty.
			} else {
				alert('Error: ' + res.msg);
			}

			// Update table
			populateTable();
		});
	} else {
		return false;
	}
}