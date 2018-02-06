window.addEventListener('load', function () {
    var wrap = new wrapper();
   
    wrap.scroll();
    wrap.getCategoryLeft();
    wrap.getCategoryRight();
})

var wrapper = function () {

}

wrapper.prototype = {
    scroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    },
    getCategoryLeft:function () {
        $.ajax({
            url:'/category/queryTopCategory',
            success:function (backData) {
                var result=template('categoryLeft',backData)
                // console.log(result);
                $('#category-left ul').html(result);
                $('#category-left ul li').eq(0).addClass('active')
                $('#category-left ul').on('click','li',function () {
                    $(this).addClass('active').siblings().removeClass('active')
                })
                
            }
        })
    },
    getCategoryRight:function () {
        $('#category-left ul').on('click','li a',function () {
            var id=$(this).data('id');
            
            getData(id);
        })
        getData(1);
        function getData(id) {
            $.ajax({
                url: '/category/querySecondCategory',
                data: { 'id': id },
                success: function (backData) {
                    var result = template('categoryRight', backData);
                    $('#category-right .mui-row').html(result);
                }
            })
        }
        
    }
}