$(function() {

    // if(id != 0){
    //     $.ajax({
    //         type: 'GET',
    //         url: '/api/v1/user/'+ id,
    //         success: function(response) {
    //             if(response.status == 200){
    //                 let data = response.data[0];

    //                 $('#name').val(data.name);
    //                 $('#username').val(data.username);
    //                 $('#preview-img').attr('src' ,'/uploads/user/' + data.file);
    //                 // $('#password').val(data.password);
    //                 $('#id').val(data.id);
    //             } else {
    //                 alert(response.message);
    //             }
    //         }
    //     });
    // }

    //edit user
    $("#frmUser").on("submit", function (e) {
        e.preventDefault();
        $('#validationName, #validationUserName, #validationPassword').hide();

        let name = $('#name').val(),
        username = $('#username').val(),
        password = $('#password').val(),
        isValidate = true;

        if(typeof name === 'undefined' || name == null || name == ''){
            $('#validationName').text('Name should not be empty').show();
            isValidate = false;
        } else if(name.length <= 6){
            $('#validationName').text('Name should be more than 6 character').show();
            isValidate = false;
        }

        if(typeof username === 'undefined' || username == null || username == ''){
            $('#validationUserName').text('Username should not be empty').show();
            isValidate = false;
        } else if(username.length < 6) {
            $('#validationUserName').text('Username should be more than 6 character').show();
            isValidate = false;
        }

        if(typeof password === 'undefined' || password == null || password == ''){
            $('#validationPassword').text('Password should not be empty').show();
            isValidate = false;
        } else if(password.length < 6) {
            $('#validationPassword').text('Password should be more than 6 character').show();
            isValidate = false;
        }

        // var form = $('#frmUser')[0];
        // var formdata = new FormData(form);
        // formdata.append('file', $('#file')[0].files[0]);
        // var formdata = $("#frmUser").serialize();

       var formdata = new FormData($("#frmUser")[0]); 
       var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            type: method,
            url: url,
            data: formdata,
            contentType: false, 
            processData: false, 
            headers: {
                'CSRF-Token': token
            },
            success: function(response) {
                if(response.status == 200){
                    window.location.href = "http://127.0.0.1:8001/user";
                } else if(response.status == 401){

                    let errors = response.data.errors;
                    $.each(errors, function( index, error) {
                        if(error.param == 'name'){
                            $('#validationName').text(error.msg).show();
                        } else if(error.param == 'username'){
                            $('#validationUserName').text(error.msg).show();
                        } else if(error.param == 'password'){
                            $('#validationPassword').text(error.msg).show();
                        }
                    });
                } else if(response.status == 302) {
                        $('#validationUserName').text(response.message).show();
                } else {
                    alert(response.message);
                }
            }
        });
    });

    //delete user
    $("#btn_delete").on("click", function (e) {
        e.preventDefault();
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/user/delete/' + id,
            headers: {
                'CSRF-Token': token 
            },
            success: function(response) {
                if(response.status == 200){
                    window.location.href = "http://127.0.0.1:8001/user";
                } else {
                    alert(response.message);
                }
            }
        });
    });

    $("#btn_cancel").on("click", function (e) {
        window.location.href = "http://127.0.0.1:8001/user";
    });
    
});


function deleteImage(id){
    if(id > 0)
    {
        let message = "Are you sure you want to remove this image?";

        var result = confirm(message);
        if(result){
            var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            $.ajax({
                url: "/api/v1/user/deleteImage/"+id,
                headers: {
                    'CSRF-Token': token 
                },
                method:"DELETE",
                success: (data, textStatus, jqXHR) => {
                    if (jqXHR.status.toString().charAt(0) == 2) {
                        //location.href = "/app-content-settings";
                        location.reload();
                    }
                },
                error: (jqXHR, exception) => {       
                    if (jqXHR.responseJSON) {
                        if (jqXHR.status == 400) {                   
                        } else if (jqXHR.status == 500) {            
                        } else if (jqXHR.status == 401) {
                            location.reload();
                        }
                    }
                },
            });      
        }
    }
};