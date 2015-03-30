
// DOM Ready =============================================================
$(document).ready(function() {

    $('#register-button').click(function(event) {
        event.preventDefault();
        $('#register-form').show();
    });

    // Register User
    $('#btnRegisterUser').on('click', registerUser);

    // Create Team
    $('#btnCreateTeam').on('click', createTeam);

    // Add Team Members
    var source = $("#NewTeamMemberTemplate").html();
    var template = Handlebars.compile(source);
    var teamMemberId = 0;
    $('#btnAddTeamMember').click(function(event) {
        event.preventDefault();
        teamMemberId++;
        $('#inputTeamMembers').append(template({id: teamMemberId}));
    });
    $('#inputTeamMembers').on('click', '.removeTeamMember', removeTeamMember);

    // Join Team
    $('#btnJoinTeam').on('click', joinTeam);

});

// Functions =============================================================

// REGISTER USER

function registerUser(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#registerUser input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still 0.
    if (errorCount === 0) {
        var newUser = {
            'email': $('#registerUser fieldset input#inputEmail').val(),
            'first_name': $('#registerUser fieldset input#inputFirstName').val(),
            'last_name': $('#registerUser fieldset input#inputLastName').val(),
            'status': 'registered'
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
            // Clear the form inputs
            $('#registerUser fieldset input').val('');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + res.msg);
        }
    });
}

// CREATE TEAM

function createTeam(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#createTeam input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still 0.
    if (errorCount === 0) {
        var newUserForTeam = {
            'team_name': $('#createTeam fieldset input#inputCreateTeamName').val(),
            'user_email': $('#createTeam fieldset input#inputCreateTeamEmail').val()
        }
        createTeamWithUser(newUserForTeam);
    } else {
        alert('Please fill in all fields');
        return false;
    }
}

function removeTeamMember(event) {
    event.preventDefault();
    event.target.parentElement.remove();
}

function createTeamWithUser(newUserForTeam) {
    // Use AJAX to post the object to addteam service
    $.ajax({
        type: 'POST',
        data: newUserForTeam,
        url: '/teams/addteam',
        dataType: 'JSON'
    }).done(function(res) {
        // Check for successful (blank) response
        if (res.msg === '') {
            // Clear the form inputs
            $('#registerUser fieldset input').val('');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + res.msg);
        }
    });
}

// JOIN TEAM

function joinTeam(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#joinTeam input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still 0.
    if (errorCount === 0) {
        var newUserForTeam = {
            'team_name': $('#joinTeam fieldset input#inputJoinTeamName').val(),
            'user_email': $('#joinTeam fieldset input#inputJoinTeamEmail').val(),
        }
        addUserToTeam(newUserForTeam);
    } else {
        alert('Please fill in all fields');
        return false;
    }
}

function addUserToTeam(userForTeam) {
    // Use AJAX to post the object to addteam service
    $.ajax({
        type: 'POST',
        data: userForTeam,
        url: '/teams/jointeam',
        dataType: 'JSON'
    }).done(function(res) {
        // Check for successful (blank) response
        if (res.msg === '') {
            // Clear the form inputs
            $('#registerUser fieldset input').val('');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + res.msg);
        }
    });
}

