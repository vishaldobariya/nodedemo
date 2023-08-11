 $(function() {

    // if(id != 0){
    //     $.ajax({
    //         type: 'GET',
    //         url: '/api/v1/product/'+ id,
    //         success: function(response) {
    //             if(response.status == 200){
    //                 let data = response.data[0];

    //                 $('#name').val(data.name);
    //                 $('#product_number').val(data.product_number);
    //                 $('#preview-img').attr('src' ,'/uploads/product/' + data.file);
    //                 $('#id').val(data.id);
    //             } else {
    //                 alert(response.message);
    //             }
    //         }
    //     });
    // }

    //edit product
    $("#frmProduct").on("submit", function (e) {
        e.preventDefault();
        $('#validationProductName, #validationProductNumber').hide();
        let name = $('#name').val(),
        product_number = $('#product_number').val(),
        isValidate = true;

        if(typeof name === 'undefined' || name == null || name == ''){
            $('#validationProductName').text('Product name should not be empty').show();
            isValidate = false;
        } else if(name.length <= 6){
            $('#validationProductName').text('Product name should be more than 6 character').show();
            isValidate = false;
        }

        if(typeof product_number === 'undefined' || product_number == null || product_number == ''){
            $('#validationProductNumber').text('Product number should not be empty').show();
            isValidate = false;
        } else if(product_number.length < 6) {
            $('#validationProductNumber').text('Product number should be more than 6 character').show();
            isValidate = false;
        }

        if(isValidate)
        {
            // var formdata = $("#frmProduct").serialize();
            var formdata = new FormData($("#frmProduct")[0]); 
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
                        window.location.href = "http://127.0.0.1:8001/product";
                    } else if(response.status == 401){

                        let errors = response.data.errors;
                        $.each(errors, function( index, error) {
                            if(error.param == 'name'){
                                $('#validationProductName').text(error.msg).show();
                            } else if(error.param == 'product_number'){
                                $('#validationProductNumber').text(error.msg).show();
                            }
                        });
                        
                    } else if(response.status == 302){
                        $('#validationProductNumber').text(response.message).show();
                    } else {
                        alert(response.message);
                    }
                }
            });
        }
    });

    //delete product
    $("#btn_delete").on("click", function (e) {
        e.preventDefault();
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $.ajax({
            type: 'DELETE',
            url: '/api/v1/product/delete/' + id,
            headers: {
                'CSRF-Token': token 
            },
            success: function(response) {
                if(response.status == 200){
                    window.location.href = "http://127.0.0.1:8001/product";
                } else {
                    alert(response.message);
                }
            }
        });
    });

    $("#btn_cancel").on("click", function (e) {
        window.location.href = "http://127.0.0.1:8001/product";
    });

    $('input[name="product_number"]').keyup(function(e){
        if (/\D/g.test(this.value))
        {
            // Filter non-digits from input value.
            this.value = this.value.replace(/\D/g, '');
        }
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
                url: "/api/v1/product/deleteImage/"+id,
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