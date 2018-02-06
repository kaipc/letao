var letao=null;
$(function () {
    letao =new Letao();
    letao.pullRefreshInit();
    letao.searchProductList();
    letao.sortProductList();
    letao.buyProduct();
    search = getQueryString('search');



});
var page=1;
var search='';
function Letao() {
    
}

Letao.prototype={
    pullRefreshInit:function () {
        mui.init({
            pullRefresh: {　　
                container: ".mui-scroll-wrapper", //下拉刷新容器父容器选择器 (区域滚动的父容器)
                //下拉刷新
                down: {
                    contentdown: "往下拉的时候提示文字",
                    contentover: "下拉到底部的时候提示文字",
                    contentrefresh: "松开手的时候的提示文字",
                    auto: true, //可选,默认false.首次加载自动下拉刷新一次
                    //下拉刷新的回调函数  请求ajax刷新页面
                    callback: downCallback
                },
                //上拉加载
                　　up: {　　　　
                    contentrefresh: "松开手的时候的提示文字",
                    // 数据加载完毕的提示文字 必须得数据加载完毕才会显示
                    contentnomore: '数据加载完毕的提示文字',
                    //上拉加载的回调函数　请求ajax去加载更多　
                    callback: upCallback　
                }
            }
        });

        function downCallback() {
            letao.getProductListData({
                page:1,
                pageSize:2,
                proName:search
            },function (backData) {
               setTimeout(function () {
                    var result = template('productlistTmp', backData);
                    $('.product-list-body').html(result);
                    
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                    
                    page = 1;
                    mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                },1000)
            })
            
        };
        
        function upCallback() {
            page++;
            letao.getProductListData({
                page:page,
                pageSize:2,
                proName:search
            },function (backData) {
               setTimeout(function () {
                   var result = template('productlistTmp', backData);
                   if (backData.data.length <= 0) {

                       mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                       return;
                   }
                   $('.product-list-body').append(result);
                   mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
               },1000)
            })
            
        }

    },
    getProductListData:function (options,callback) {
        options.page=options.page||1;
        options.pageSize=options.pageSize||2;
        $.ajax({
            url:'/product/queryProduct',
            data:options,
            success:function (backData) {
                callback&&callback(backData);
            }
        });
    },

    searchProductList:function () {
        $('.btn-search').on('click',function () {
            // console.log('ss');
            
            search=$('.search-input').val();
            letao.getProductListData({
                page:1,
                pageSize:5,
                proName:search
            },function (backData) {
                var result=template('productlistTmp',backData);
                $('.product-list-body').html(result);
                
            });
        });
    },
    
    sortProductList:function () {
        $('.product-list-title .mui-row >div >a').on('tap',function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            
             var sort=$(this).data('sort');
             
             if(sort==1){
                 sort=2
                 $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
                }else{
                    sort=1
                    $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                    
                }
                
                $(this).parent().siblings().find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                $(this).data('sort',sort);
                
                var sortType= $(this).data('sort-type');
                if(sortType=='price'){
                    letao.getProductListData({
                        proName:search,
                        page:1,
                        pageSize:5,
                        price:sort
                    },function (backData) {
                     var result = template('productlistTmp',backData);
                     $('.product-list-body').html(result);
                    });
                }else if(sortType=='num'){
                    letao.getProductListData({
                        proName:search,
                        page:1,
                        pageSize:5,
                        num:sort
                    },function (backData) {
                     var result = template('productlistTmp',backData);
                     $('.product-list-body').html(result);
                    });
      
                }
            });
        },
        buyProduct:function () {
            $('body').on('tap','.btn-buy',function () {
                window.location.href='detail.html?id='+$(this).data('id');
            });
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