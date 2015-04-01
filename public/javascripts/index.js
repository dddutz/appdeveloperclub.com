
// DOM Ready =============================================================
$(document).ready(function() {

    $('#aboutHeader').click(function(event) {
        event.preventDefault();
        $('#aboutContent').toggle();
    });

    $('#registerHeader').click(function(event) {
        event.preventDefault();
        $('#registerContent').toggle();
    });

    // Register
    $('#btnRegisterSubmit').on('click', register);

});

// Functions =============================================================

// REGISTER
//
function register(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#registerContent input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });
    $('#registerContent textarea').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still 0.
    if (errorCount === 0) {
        var newUser = {
            'first_name': $('#inputFirstName').val(),
            'last_name': $('#inputLastName').val(),
            'email': $('#inputEmail').val(),
            'year': $('#inputYear').val(),
            'coursework': $('#inputRelevantCoursework').val(),
            'languages': $('#inputRelevantLanguages').val(),
            'leadership': $('#inputLeadership').val(),
            'projects': $('#inputProjects').val(),
            'ideas': $('#inputIdeas').val(),
            'status': 'applied'
        }
        addUser(newUser);
    } else {
        alert('Please fill in all fields');
        return false;
    }
}

function addUser(user) {
    // Use AJAX to post the object to adduser service
    $.ajax({
        type: 'POST',
        data: user,
        url: '/users/adduser',
        dataType: 'JSON'
    }).done(function(res) {
        // Check for successful (blank) response
        if (res.msg === '') {
            $('#registerContent').html('<h1>Thank you for your application. Expect to hear from us soon.</h1>');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + res.msg);
        }
    });
}
