const {ipcRenderer} = require('electron')
var delClick = 0;

$.fn.createEmailBlock = function (email){
    
    $(".list-group").append(`<li class="list-group-item d-flex flex-row"><div class="del"><div onclick="deleteAccount(event)"></div></div><div class="email text-truncate">${email}</div><div class = "connect"><label class = "switch"><input type = "checkbox"><div class = "slider round"></div></div></li>`);
}
//confirm delete account
function deleteAccount(event){
    $(document).ready(function(){
        let email = $($(event.target).parent().parent().children()[1]).text();
        let type = "deleteAccount";
        let data = {"email":email,"type":type}
        $(".costum-alert").css('visibility','visible');
        $('.confirm-alert').css('display','block');
        
        $('#delete-account').click(function(){
            ($(event.target).parent()).parent()[0].remove();
            $('.costum-alert').css('visibility','hidden');
            $('.confirm-alert').css('display','none');
            $(".del > div").css('visibility','hidden');
            delClick = 0;
            ipcRenderer.send('requestHandler', data);
        });
    });
}
$(document).ready(function(){

    //read data accounts and put inside left menu
    $.getJSON('../accounts.json',function(data){
        for(email of Object.keys(data[0])){
            $(".list-group").createEmailBlock(email);
        }    
    });
    
    //add account to left menu
    $("#add-btn").click(function(){     
        $(".costum-alert").css('visibility','visible'); 
        $(".alert-box").css('display','block');    
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
    $("#add-account").click(function(){     
        let email =  $(".container input[name=email]").val();
        let password = $(".container input[name=password]").val();
        let type = 'addAccount'
        let data = {"email":email,"password":password,"type":type}
        $(".list-group").createEmailBlock(email);
        $(".costum-alert").css('visibility','hidden');
        $(".alert-box").css('display','none'); 
        $(".container input[name=email]").val("")
        $(".container input[name=password]").val("")  
        ipcRenderer.send('requestHandler', data);
    });
    // cancel add account or delete
    $('.btn-cancel-alert').click(function(){
        $('.costum-alert').css('visibility','hidden');
        $('.confirm-alert').css('display','none');
        $(".alert-box").css('display','none'); 
    });
    
    
})