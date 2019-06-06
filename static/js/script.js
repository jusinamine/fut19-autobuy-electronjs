const {ipcRenderer} = require('electron')
var delClick = 0;

$.fn.createEmailBlock = function (email){
    
    $(".list-group").append(`<li class="list-group-item d-flex flex-row"><div class="del"><div onclick="deleteAccount(event)"></div></div><div class="email text-truncate">${email}</div><div class = "connect"><label class = "switch"><input type = "checkbox"><div class = "slider round" onclick="connectAccount(event)"></div></div></li>`);
}
$.fn.createSelectedEmail = function (email){
    $(".accounts-cn").append(`<div class="select-email">${email}</div>`);
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
// connect to ea when toggle is active
function connectAccount(e) {
    $(document).ready(function(){
        if($($(e.target).parents()[0].firstChild).is(':checked')){
            let email = $($($(e.target).parents()[2]).children()[1]).text();
            $.getJSON('../accounts.json',function(data){
                var data = {"email":email,"password":data[0][email]['password'],"token":data[0][email]['token'],"cookies":data[0][email]['cookies'],"type":"login"}
                ipcRenderer.send('requestHandler', data);
            });
        }
    });
}
/* {
                fetch("http://127.0.0.1:5000/login",{
                    method: "POST",
                    body: JSON.stringify({"email":email,"password":data[0][email]['password'],"token":data[0][email]['token'],"cookies":data[0][email]['cookies']}),
                    headers: {
                        "Content-Type": "application/json"
                    }

                })
                .then(res => res.json())
                .then(data => console.log(data));
                } */
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
    //select account
    let emailSelected;
    $('#select-acc').click(function(){
        /*fetch('http://127.0.0.1:5000/account/logged')
        .then(res => res.json())
        .then(data => {
            for(elm of data['data']){
                $(".accounts-cn").createSelectedEmail(elm)
            }
        })*/
        for(elm of $('input[type=checkbox]:checked')){
            $(".accounts-cn").createSelectedEmail($($($(elm).parents()[2]).children()[1]).text())
        }
        $('.costum-alert').css('visibility','visible');
        $('.select-alert').css('display','block');
        $('.select-email').click(function(){
            emailSelected = $(this).text();
            $('.costum-alert').css('visibility','hidden');
            $('.select-alert').css('display','none');
        });
        $('#start-buy').prop("disabled", false);
    });
    //start auto buy
    $('#start-buy').click(function(){
        let data = {"email":emailSelected,"type":"startBuy"}
        ipcRenderer.send('requestHandler', data) 
    })
    //save info of mmoga - igvault - fifaoins
    var clickMmoga = 0
    $('.sel').click(function(){
        
        $('.sel').css('background-color','#000000');
        $(this).css('background-color','#f9880a');
        if($(this).text() === "MMOGA" & clickMmoga === 0){
            clickMmoga = 1;
            $('.info-seller').slideDown();
        }else{
            if(clickMmoga === 1){
                $(this).css('background-color','#000000');
                $('.info-seller').slideUp();
                clickMmoga = 0;
            }
        }
    });
    $('input[name=save-sl]').click(function(){
        $('.sel').css('background-color','#000000');
        $('.info-seller').slideUp();
        clickMmoga = 0;
    })
})