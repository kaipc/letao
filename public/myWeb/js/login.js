window.addEventListener('load', function () {
    var letao = new Letao();
    letao.login(); 
    
})

var Letao = function () {

}

Letao.prototype = {
   login:function () {
       $('.btn-login').on('click',function () {
           var username = $('.mui-input-clear').val();
           var password = $('.mui-input-password').val();
        //    console.log(username);
        //    console.log(password);
        if(!username){
            mui.toast('请输入用户名',{ duration:'long', type:'div' }); 
            return;
        }
        if(!password){
            mui.toast('请输入密码',{ duration:'long', type:'div' }); 
            return;

           }
           $.ajax({
               type:'post',
               url: '/user/login',
               data: {
                   'username': username,
                   'password': password
               },
               success: function (backData) {
                   console.log(backData);
                    if (!backData.error) {                        
                        mui.toast('登陆成功',{ duration:'long', type:'div' }); 
                        window.location.href='user.html'
                    }else{
                        mui.toast(backData.message,{ duration:'long', type:'div' }); 

                    }
               }
           })
       })
   }

}