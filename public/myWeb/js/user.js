window.addEventListener('load', function () {
    var letao = new Letao();
    letao.logout();
    letao.getUserData();
})

var Letao = function () {

}

Letao.prototype = {
    logout:function () {
        $('body').on('click', '.btn-logout',function () {
           $.ajax({
               url:'/user/logout',
               success:function (backData) {
                   if(backData.success){
                       window.location.href='login.html';
                   }
                   
               }
           })
       }) 
    },
    getUserData:function () {
        $.ajax({
            url:'/user/queryUserMessage',
            success:function (backData) {
                if(backData.error){
                    window.location.href='login.html';
                    return;
                }
                
                var result=template('getUserDataTmp',backData);
                $('#main').html(result);
                
            }
        })
    }
}