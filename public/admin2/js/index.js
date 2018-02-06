var Letao = function() {

};

Letao.prototype = {
    //获取用户数据的方法
    getUser: function(page, pageSize) {
        // 1. 请求API获取用户的数据
        $.ajax({
            url: '/user/queryUser',
            data: { 'page': page || 1, 'pageSize': pageSize || 5 },
            success:function (backData) {
               if(backData.error){
                   location.href='login.html';
               }else{
                    console.log(backData);
                    // console.log(result);
                    var total = backData.total;
                    var pageCount = Math.ceil(total / backData.size);
                    backData.size = backData.rows.length;
                    backData.pageCount = [];
                    for (var i = 1; i <= pageCount; i++) {
                        backData.pageCount.push(i)
                    }
                    backData.pageMax = backData.pageCount[backData.pageCount.length - 1];
                    var result = template('userTmp', backData);
                    $('.right-body').html(result);
               }
                
            }
        })


    },
    //获取分页用户数据
    getPageUser: function() {
        $('body').on('click','.pagination a:not(:first,:last)',function () {
         var page= $(this).data('page');
         
         letao.getUser(page);  
        });
         $('body').on('click', '.pagination a:first', function () {
             var page = $(this).data('page');
            if(page>1){
                page--;
            }else{
                page=$(this).data('pageMax');
            }
            letao.getUser(page);
        });
        $('body').on('click', '.pagination a:last', function () {
            var page = $(this).data('page');
            pageMax=$(this).data('pageMax');
            
             if (page < pageMax) {
                 page++;
             } else {
                 page = 1;
             }
             letao.getUser(page);
         })
    },
    //操作用户的禁用和启用
    updateUser: function() {
        $('body').on('click', '.btn-options',function () {
            var id=$(this).data('id');
            var isDelete=$(this).data('isDelete');
            if(isDelete==1){
                isDelete=0;
            }else{
                isDelete=1;

            }
            $.ajax({
                url: '/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                type:'post',
                success:function (backData) {
                    var page=$(this).page;
                    if(backData.error){
                        window.location.href='login.html';
                    }else{
                        letao.getUser(page);
                    }
                }
            })
        })
    },
    //获取一级分类的数据
    getFirstData:function () {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize:10
            },
            success:function (backData) {
                console.log(backData);
                if(backData.error){
                    window.location.href='login.html';
                }else{
                    backData.rows = backData.rows.reverse();
                    var result = template('categoryTmp', backData);
                    $('.right-body').html(result);
                }
            }
        })
    },
    //添加一级分类的数据
   
    //获取品牌的数据 
   getBrand:function () {
       $.ajax({
           url: '/category/querySecondCategoryPaging',
           data:{
               page:1,
               pageSize:5
           },
           success:function (backData) {
               console.log(backData);
               var result=template('brandTmp',backData);
               $('.right-body').html(result);
           }
       })
   },
    //添加品牌  
    addBrand:function () {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            success:function (backData) {
                console.log(backData);
                
                var result=template('addBrandTmp',backData);
                $('.dropdown').html(result);
            }
        });
        var id;
        var brandName;
         $('body').on('click', '.dropdown-menu a',function () {
             id=$(this).data('id');
             
             var categoryName = $(this).data('categoryName');
             console.log(categoryName);
             
             $('#dLabel').html(categoryName + '<span class="caret"></span>')
             
         })
        $('.btn-primary').on('click',function () {
            var brandName = $('.add-category').val();
            var categoryId=id;
            console.log(categoryId);
            
            var file=$('input[type=file]').val().split('\\');
            var brandLogo='/mobile/images/'+file[file.length-1];
            var hot=1;
            console.log(brandLogo);
            
            $.ajax({
                url: '/category/addSecondCategory',
                data:{
                    brandName: brandName,
                    categoryId: categoryId,
                    brandLogo: brandLogo,
                    hot: hot
                },
                type:'post',
                success:function (backData) {
                    console.log(backData);
                    letao.getBrand();
                }
            })

        })
    }
    
    
}
