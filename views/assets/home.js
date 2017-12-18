$(() => {
    requestUsers();

    $('#add-submitButton').click(() => {
        let user = {
            name: $('input[name=name]').val(),
            email: $('input[name=email]').val(),
            phone: $('input[name=phone]').val(),
        }

        sendUser(user);
        findUserWithId(user);
        $('#add-page input').val("");

    })

    showHomePage();
    $('#listButton').click(showHomePage)
    $('#newButton').click(showAddPage)
})


function requestUsers() {
    $.ajax({
            type: 'GET',
            url: 'api/user',
            dataType: 'json',
        })
        .done(successHandler)
        .fail(errorHandler)

}

function sendUser(user) {
    $.ajax({
            type: 'POST',
            url: 'api/user',
            data: JSON.stringify(user),
            contentType: 'application/json',
            dataType: 'json',
        })
        .done(successHandler)
        .fail(errorHandler)
}

function deleteUser(id) {
    $.ajax({
            type: 'DELETE',
            url: `api/user/${id}`,
            dataType: 'json',
        })
        .done(successHandler)
        .fail(errorHandler)
}

function editUser(editedUser) {
    $.ajax({
            type: 'PUT',
            url: `api/user/${editedUser.id}`,
            data: JSON.stringify(editedUser),
            contentType: 'application/json',
            dataType: 'json',
        })
        .done(successHandler)
        .fail(errorHandler)
}

function findUserWithId(user) {
    // get existed data from server side
    $.ajax({
            type: 'POST',
            url: 'api/user/index',
            data: JSON.stringify(user),
            contentType: 'application/json',
            dataType: 'json',
        })
        .done(showDetailPage)
        .fail(errorHandler)
}



function successHandler(users) {
    console.log(`Response has ${users.length} users`)
    if (users.length == 0) {
        var $table = $("<table class='table table-striped'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Email</th><th scope='col'>Phone</th><th></th></tr></thead>");
    } else {
        var $table = $("<table class='table table-striped'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Email</th><th scope='col'>Phone</th><th></th></tr></thead>");
        for (let index = 0; index < users.length; index++) {
            const user = users[index]
            const $line = $("<tr></tr>")
            $line.append($("<td></td>").html(user.id))
            $line.append($("<td></td>").html(user.name))
            $line.append($("<td></td>").html(user.email))
            $line.append($("<td></td>").html(user.phone))
            const detailsButton = $("<button id='listButton' class='btn btn-default'>/button>").text('DETAILS');
            const editButton = $("<button id='listButton' class='btn btn-default'>/button>").text('EDIT');
            const deleteButton = $("<button id='listButton' class='btn btn-default'>/button>").text('DELETE');
            $line.append(detailsButton);
            $line.append(editButton);
            $line.append(deleteButton);

            // model -> different functions for each buttons
            deleteButton.click(() => {
                const choice = confirm("Are you sure to delete this contact member?")
                if (choice == true) {
                    deleteUser(user.id);
                    showHomePage();
                }
            })
            editButton.click(() => {
                showEditPage(user);

            });
            detailsButton.click(() => {
                findUserWithId(user);
            });

            $table.append($line)

            lastId = user.id;
        }
    }

    $('#table').empty()
    $table.appendTo($('#table'))
}


function errorHandler(jqXHR, textStatus, error) {
    $('#output').val("textStatus: " + textStatus + ". server error: " + error)
}


function showHomePage() {
    $("#home-page").show();
    $("#add-page").hide();
    $("#detail-page").hide();
    $("#edit-page").hide();
}


function showAddPage() {
    $("#home-page").hide();
    $("#add-page").show();
    $("#detail-page").hide();
    $("#edit-page").hide();
}


function showEditPage(user) {

    $('input[name=edit-name]:text').val(`${user.name}`);
    $('input[name=edit-email]:text').val(`${user.email}`);
    $('input[name=edit-phone]:text').val(`${user.phone}`);

    const submitButton = $("<button></button>").text('Submit');
    $('#edit-page').append(submitButton)
    submitButton.click(() => {
        let editedUser = {
            id: user.id,
            name: $('input[name=edit-name]').val(),
            email: $('input[name=edit-email]').val(),
            phone: $('input[name=edit-phone]').val(),
        }

        $('#edit-page button').remove();
        editUser(editedUser);
        showHomePage();
    })

    $("#home-page").hide();
    $("#add-page").hide();
    $("#detail-page").hide();
    $("#edit-page").show();
}

function showDetailPage(user) {
    $('#detail-page').empty()
    user = JSON.parse(user)

    $('#detail-page').append($("<h3></h3>").text("Contact"))
    $('#detail-page').append($("<p></p>").text(`Name: ${user.name}`))
    $('#detail-page').append($("<p></p>").text(`Email: ${user.email}`))
    $('#detail-page').append($("<p></p>").text(`Phone: ${user.phone}`))

    const editButton = $("<button></button>").text('EDIT');
    editButton.click(() => {
        showEditPage(user)
    });

    $('#detail-page').append(editButton)

    const deleteButton = $("<button></button>").text('DELETE');
    deleteButton.click(() => {
        const choice = confirm("Are you sure to delete this contact member?")
        if (choice == true) {
            deleteUser(user.id);
            showHomePage();
        }
    })
    $('#detail-page').append(deleteButton)

    $("#home-page").hide();
    $("#add-page").hide();
    $("#detail-page").show();
    $("#edit-page").hide();
}


function validateUser(user) {
    if (user.name.length == 0) {
        alert('Invalid name, please re-enter');
        return false;
    }
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(user.email) == false) {
        alert('Invalid email address, please re-enter');
        return false;
    }
    reg = /^[\+]?[(]?[2-9]{1}\d{2}[)]?[-\s\.]?[2-9]{1}\d{2}[-\s\.]?[0-9]{4,6}$/im
    if (reg.test(user.phone) == false) {
        alert('Invalid phone number, please re-enter');
        return false;
    }
    return true;
}