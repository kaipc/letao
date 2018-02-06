window.addEventListener('load', function () {
    var letao = new Letao();
    letao.getVcode();
    letao.register();

})

var Letao = function () {

}

Letao.prototype = {
    getVcode:function () {
        $('.btn-getVcode').on('click',function () {
            
            $.ajax({
                url: '/user/vCode',
                success: function (backData) {
                    console.log(backData);
                    
                }
                
            })
        })
       
    },
    register:function () {
        $('.btn-register').on('click', function () {
            var username = $('.username').val();
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            var mobile = $('.mobile').val();
            var Vcode = $('.Vcode').val();



            if (!username) {
                mui.toast('请输入用户名', { duration: 'long', type: 'div' });
                return;
            }
            if (!password1) {
                mui.toast('请输入密码', { duration: 'long', type: 'div' });
                return;
            }
            if (!password2) {
                mui.toast('请确认密码', { duration: 'long', type: 'div' });
                return;
            }
            if (password1 !== password2) {

                mui.toast('两次输入密码不同', { duration: 'long', type: 'div' });
                return;
            }
            if (!mobile) {
                mui.toast('请输入手机号', { duration: 'long', type: 'div' });
                return;
            }
            if (!Vcode) {
                mui.toast('请输入验证码', { duration: 'long', type: 'div' });
                return;
            }
            
            $.ajax({
                url: '/user/register',
                type: 'post',
                data: {
                    'username': username,
                    'password': password1,
                    'mobile': mobile,
                    'vCode': Vcode,
                },
                success: function (backData) {
                    console.log(backData);
                    
                    if (backData.success) {
                        window.location.href = 'login.html';
                    }else{
                        
                        mui.toast(backData.message, { duration: 'long', type: 'div' });
                    }
                    
                }

            })
        })
    }

}