var letao=null;
var id=0;
$(function () {
    id = getQueryString('id');
    letao = new Letao();
    // letao.slide();
    letao.getProductDetail();
    letao.addCart();
})
function Letao() {
    
}

Letao.prototype={
    slide:function () {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
        });
    },

    getProductDetail:function () {
        $.ajax({
            url:'/product/queryProductDetail',
            data:{'id':id},
            success:function (backData) {
                var result = template('slideDatailTmp', backData);
                $('.mui-slider').html(result);
                
                var first = $('.mui-slider-group .mui-slider-item:first-of-type').clone().addClass('mui-slider-item-duplicate');

                var last = $('.mui-slider-group .mui-slider-item:last-of-type').clone().addClass('mui-slider-item-duplicate');

                $('.mui-slider-group').append(first);
                $('.mui-slider-group .mui-slider-item:first-of-type').before(last);
                letao.slide();

                var start= backData.size.split('-')[0];
                var end= backData.size.split ('-')[1];
                backData.size=[];

                for(var i=start;i<=end;i++){
                    backData.size.push(parseInt(i));
                }

                var result = template('productDetailTmp',backData);
                $('#product').html(result);

                mui('.mui-numbox').numbox();
                // 让尺码支持点击
                $('.btn-size').on('click', function () {
                    $('.btn-size').removeClass('active');
                    $(this).addClass('active');
                });
            }
        })
    },

    addCart:function () {
        $('.btn-add-cart').on('click',function () {
            var size = $('.btn-size.active').data('size');

            var num=mui('.mui-numbox').numbox().getValue();

            if(!size){
                mui.toast('请选择尺码',{duration:'long',type:'div'});
                return;
            }
            if(!num){
                mui.toast('请选择数量',{duration:'long',type:'div'});
                return;
            }
            
            $.ajax({
                url:'/cart/addCart',
                data:{'productId':id,'size':size,'num':num},
                type:'post',
                success:function (backData) {
                    if(backData.error){
                        location.href='login.html';
                    }else{
                        mui.confirm('是否去购物车结算','温馨提示的标题',['不去','去'],function (e) {
                            console.log(e.index);
                            
                            if(e.index == 0){
                                mui.toast('不去你点什么',{duration:'long',type:'div'});
                                
                            }
                            if(e.index==1){
                                mui.toast('正在进入购物车',{duration:'long',type:'div'});
                                location.href='cart.html';
                            }
                        })
                    }
                }
            })
        })
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}
