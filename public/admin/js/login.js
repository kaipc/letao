var letao;
$(function () {
    letao = new Letao();
    letao.login();
    $('[data-toggle="popover"]').popover()
})

function Letao() {
    
};

Letao.prototype={
    login:function () {
        $('.btn-login').on('click',function () {
            
            var username=$('#username').val();
            var password=$('#password').val();
            if(!username){
                $(this).attr('data-content','请输入用户名');
                return;
            }
            if(!password){
                $(this).attr('data-content','请输入密码');
                
                return;
            }
            var that=this;
            $.ajax({
                url: '/employee/employeeLogin',
                data: {
                    'username': username,
                    'password': password
                },
                type:'post',
                success:function (backData) {
                    console.log(backData);
                    
                    if(backData.error){
                        $(that).attr('data-content',backData.message);
                        return;
                    }else{
                        window.location.href='index.html'
                    }
                }
            })
        })
    }
}