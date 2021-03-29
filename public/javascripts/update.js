// update company ajax
$('#updateForm').on('submit', function (e) {
    e.preventDefault();

    const data = {
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(),
        username: $('#username').val(),
        nationalNumber: $('#nationalNumber').val(),
        gender: $('#gender').val(),
    };

    $.ajax({
        type: "PATCH",
        url: 'http://localhost:8000/user/update',
        data,
        success: function (response) {
            validation(response);
        }
    });
});

function validation(response) {
    creationResult(response);

    if (response === 'updated') setTimeout(() => location.href = 'http://localhost:8000/user/profile', 2000);
}


function creationResult(status) {
    switch (status) {
        case 'updated':
            displayAlert('updated successfully.', '00a331');
            break;
        case 'updated-changed':
            displayAlert('updated and manager changed!', '00a331');
            break;
        default:
            displayAlert(status, 'da2c2c');
            break;
    }
}

function displayAlert(statusMsg, color) {
    $('.result').css({
        'opacity': '1',
        'background-color': `#${color}`
    });

    $('.result').html(`<p>${statusMsg}</p>`);

    setTimeout(function () {
        $('.result').css({
            'opacity': '0'
        });
    }, 2000);
}