$.fn.createEmailBlock = function (email){
    
    $(".list-group").append(`<li class="list-group-item d-flex flex-row"><div class="email text-truncate">${email}</div><div class = "connect"><label class = "switch"><input type = "checkbox"><div class = "slider round"></div></div></li>`);
}
async function getAccountData(){
    let accounts = await eel.get_json_data()();
    console.log(accounts);
    
    return accounts  
}
function leadAccountsData(accounts){
    for(acc of accounts){

    }
}

$(document).ready(function(){

    //add account to left menu
    $("#add-btn").click(function(){     
        $(".costum-alert").css('visibility','visible');  
        getAccountData();        
    })
    $(".btn-submit-alert").click(function(){     
        let email =  $(".container input[name=email]").val();
        let password = $(".container input[name=password]").val();
        $(".list-group").createEmailBlock(email);
        $(".costum-alert").css('visibility','hidden');  
    });
    $('.btn-cancel-alert').click(function(){
        $('.costum-alert').css('visibility','hidden')
    });
    //read data accounts and put inside left menu
    
})