var letao;
window.addEventListener('load', function () {
    letao = new Letao();
    letao.getCartProduct();
    letao.deleteCartProduct();
    letao.editCartProduct();
    letao.getCount();
})

var Letao = function () {

}

Letao.prototype = {
    getCartProduct:function () {
        $.ajax({
            url:'/cart/queryCart',
            success:function (backData) {
                console.log(backData);
                if (backData.error){
                    location.href='login.html';
                }else{
                    backData=backData.reverse()
                    var result = template('cartProductTmp', { 'rows': backData});
                    $('#main').html(result);
                    if(backData.length<=0){
                        $('#main').html('<h1>穷逼卸载吧</h1>');
                    }
                }
            }
        })
    },
    deleteCartProduct:function () {
        $('#main').on('click', '.btn-delete', function (){
            var id=$(this).parent().data('id');
            mui.confirm('是否要删除商品','温馨提示',['是','否'],function (e) {
                if(e.index==0){
                    $.ajax({
                        url:'/cart/deleteCart',
                        data:{'id':id},
                        success:function (backData) {
                            if(backData.success){
                                letao.getCartProduct();
                            }
                        }
                    })
                }
            })
        })
    },
    editCartProduct:function () {
        $('#main').on('click','.btn-edit',function () {
            var product = $(this).parent();

            var id=$(this).parent().data('id');

            var productData={
                productSize:product.data('product-size'),
                nowSize:product.data('now-size'),
                productNum:product.data('product-num'),
                nowNum:product.data('now-num'),
                
            };
            var start = productData.productSize.split('-')[0];
            var end = productData.productSize.split('-')[1];
            productData.productSize=[];
            for(var i=start;i<=end;i++){
                productData.productSize.push(parseInt(i));

            }

            var result = template('editCartProductTmp', productData);

            var result=result.replace(/(\r)?\n/g,"");

            mui.confirm(result,'温馨提示',['是','否'],function (e) {
                var nowSize = $('.btn-size.active').data('size');
                
                
                var newNum = mui('.mui-numbox').numbox().getValue();

                if(e.index==0){
                    $.ajax({
                        url:'/cart/updateCart',
                        data:{'id':id,'size':nowSize,'num':newNum},
                        type:'post',
                        success:function (backData) {
                            if(backData.success){
                                console.log(backData);
                                
                                letao.getCartProduct();
                            }
                        }
                    })
                }
            });

            setTimeout(function () {
                mui('.mui-numbox').numbox();
            },100);
            $('body').on('click','.btn-size',function () {
                $('.btn-size').removeClass('active');
                $(this).addClass('active');
            })
        })
    },

    getCount:function() {
        $('#main').on('change','.product-options input',function () {
            var checkProduct=$('input:checked');

            var sum=0;
            for(var i=0;i<checkProduct.length;i++){
                var price=$(checkProduct[i]).data('price');
                var num=$(checkProduct[i]).data('num');
                var count=price*num;
                sum+=count;

            }
            //为了数字计算准确的方法
            // console.log(parseInt(sum*10)/10);
            $('.count').html(parseInt(sum*10)/10);
            
        })
    }

}