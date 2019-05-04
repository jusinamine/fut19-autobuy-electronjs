const {ipcRenderer} = require('electron')


$.fn.createEmailBlock = function (email){
    
    $(".list-group").append(`<li class="list-group-item d-flex flex-row"><div class="del"><div></div></div><div class="email text-truncate">${email}</div><div class = "connect"><label class = "switch"><input type = "checkbox"><div class = "slider round"></div></div></li>`);
}

$(document).ready(function(){
    var delClick = 0;
    //read data accounts and put inside left menu
    $.getJSON('../accounts.json',function(data){
        for(email of Object.keys(data[0])){
            $(".list-group").createEmailBlock(email);
        }    
    });
    
    //add account to left menu
    $("#add-btn").click(function(){     
        $(".costum-alert").css('visibility','visible');     
    });
    $("#del-btn").click(function(){   
        if(delClick === 0){
            $(".del > div").css('visibility','visible');
            delClick = 1;
        }
        else{
            $(".del > div").css('visibility','hidden');
            delClick = 0;
        }       
    });
    //submit email and password
    $(".btn-submit-alert").click(function(){     
        let email =  $(".container input[name=email]").val();
        let password = $(".container input[name=password]").val();
        let type = 'addAccount'
        let data = {"email":email,"password":password,"type":type}
        $(".list-group").createEmailBlock(email);
        $(".costum-alert").css('visibility','hidden');
        $(".container input[name=email]").val("")
        $(".container input[name=password]").val("")  
        ipcRenderer.send('requestHandler', data);
    });
    // cancel add account
    $('.btn-cancel-alert').click(function(){
        $('.costum-alert').css('visibility','hidden')
    });
    
})