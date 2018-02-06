var Letao =function () {
    
};

Letao.prototype={
    getUser:function (page,pageSize) {
        $.ajax({
            url:'/user/queryUser',
            data:{'page':page||1,'pageSize':pageSize||5},
            success:function (data) {
                console.log(data);
                
                data.size=data.rows.length;
                var total=data.total;
                var pageCount=Math.ceil(total/5);
                data.pageCount=[];
                for(var i=1;i<=pageCount;i++){
                    data.pageCount.push(i);
                }

                data.pageMax=data.pageCount[data.pageCount.length-1];
                if(data.error){
                    window.location.href='login.html';
                }else{
                    var result=template('userTmp',data);
                    $('.right-body').html(result);

                }
            }
        })
    },

    getPageUser:function () {
        $('body').on('click','.pagination li:not(:first,:last) a',function () {
            letao.getUser($(this).data('page'),5);
        });

        $('body').on('click','.prev',function () {
            var page=$(this).data('page');
            var pageMax=$(this).data('page-max');
            if(page>=2){
                --page;
                letao.getUser(page,5);
            }else{
                $('.prev').addClass('disabled');
                letao.getUser(pageMax,5);
            }
        });

        $('body').on('click', '.next', function () {
            var page = $(this).data('page');
            var pageMax = $(this).data('page-max');
            if (page < pageMax) {
                ++page;
                letao.getUser(page, 5);
            } else {
                $('.next').addClass('disabled');
                letao.getUser(1, 5);
            }
        })
    },

    updateUser:function () {
        $('body').on('click','.btn-options',function () {
            var isDelete=$(this).data('is-delete');

            if(isDelete==0){
                isDelete=1;
            }else{
                isDelete=0
            }
            var id=$(this).data('id');
            var page=$(this).data('page');
            $.ajax({
                url:"/user/updateUser",
                data:{'id':id,'isDelete':isDelete},
                type:'post',
                success:function (data) {
                    if(data.success){
                        letao.getUser(page,5);
                    }else{
                        window.location.href='login.html'
                    }
                }
            })
        })
    },

    getCategoryFirst: function () {
        // 1. 请求获取一级分类的API
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: { 'page': 1, 'pageSize': 10 },
            success: function (data) {
                data.rows = data.rows.reverse();
                // 2.判断返回数据是否成功
                if (data.error) {
                    window.location.href = 'login.html';
                } else {
                    // 3. 调用一级分类模板渲染页面
                    var html = template('categoryFirstTmp', data);
                    $('.right-body').html(html);
                }
            }
        })
    },

    addCategoryFirst: function () {
        //1. 给保存按钮注册点击事件
        $('.btn-save').on('click', function () {
            // 2. 获取当前输入的分类名称
            var categoryName = $('.category-name').val();
            if (!categoryName) {
                alert('请输入分类名称');
                return;
            }
            // 3. 调用API添加一级分类
            $.ajax({
                url: '/category/addTopCategory',
                data: { 'categoryName': categoryName },
                type: 'post',
                success: function (data) {
                    if (data.error) {
                        window.location.href = 'login.html';
                    } else {
                        // 添加成功就重新渲染分类页面
                        letao.getCategoryFirst();
                    }
                }
            })
        })
    },

    getBrand: function () {
        // 1. 请求获取品牌的API
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: { 'page': 1, 'pageSize': 5 },
            success: function (data) {
                if (data.error) {
                    window.location.href = 'login.html';
                } else {
                    var html = template('brandTmp', data);
                    $('.right-body').html(html);
                }
            }
        })
    },

    addBrand2: function () {
        // 1. 给点击添加品牌注册点击事件
        $('body').on('click', '.btn-add-brand', function () {
            // 如果添加成功重新刷新页面
            // 2. 请求一级分类的数据 来渲染模态框里面的分类
            $.ajax({
                url: '/category/queryTopCategoryPaging',
                data: { 'page': 1, 'pageSize': 1000 },
                success: function (data) {
                    //3. 生成动态模态框的模板
                    var html = template('addBrandTmp', data);
                    // 使用动态生成的模态框会弹出2个模态框  千万不要动态生成模态框
                    $('#modal').html(html);
                }
            });
        });
        var id = 0;
        // 4. 给模态框里面的下拉分类的所有li里面的a注册点击事件
        $('body').on('click', '.dropdown-menu a', function () {
            // 5.获取当前选中的分类的id
            id = $(this).data('id');
            //6. 获取当前点击的分类的名称 把下拉框的默认的换成选中的分类
            var categoryName = $(this).data('category-name') + '<span class="caret"></span>';
            //7. 修改下拉框按钮上的文字 注意只能使用类选择器
            $('.dropdown-toggle').html(categoryName);
            // $('#categoryTest').html(categoryName);
            // $('#dropdownMenu2').html(categoryName);
        });
        // 1. 给保存添加点击事件
        $('body').on('click', '.btn-save', function () {
            // 2. 获取品牌的名称
            console.log($('.brand-name-add'));
            var brandName = $('.brand-name-add:last').val();
            var file = $('.brand-file-add:last');
            var fileName = file.val().split('\\');
            // 3. 获取文件选择的logo
            var brandLogo = '\\mobile\\images\\' + fileName[fileName.length - 1];
            $.ajax({
                url: '/category/addSecondCategory',
                data: { 'brandName': brandName, 'brandLogo': brandLogo, 'categoryId': id, 'hot': 1 },
                type: 'post',
                success: function (data) {
                    if (data.error) {
                        window.location.href = 'login.html';
                    } else {
                        // 如果添加成功重新刷新页面
                        /*把数据提交成功要隐藏模态框（动态的模态框无法隐藏手动添加隐藏）
                        1. 把模态框和模态框的遮罩层的in类名去掉
                        2. 把模态框和模态框的遮罩层隐藏*/
                        $('.modal').removeClass('in');
                        $('.modal').css('display', 'none');
                        $('.modal-backdrop').removeClass('in');
                        $('.modal-backdrop').css('display', 'none');

                        letao.getBrand();
                    }
                }
            })
        });
    },
    addBrand: function () {
        // 1. 请求一级分类的数据渲染模态框里面的一级分类的数据
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: { 'page': 1, 'pageSize': 100 },
            success: function (data) {
                // 2.调用生成分类下拉框的模板
                var html = template('addBrandTmp', data);
                // 3. 把生成的分类的模板放到下拉的容器
                $('.dropdown').html(html);
            }
        });
        var id = 0;
        // 4. 给模态框里面的下拉分类的所有li里面的a注册点击事件
        $('body').on('click', '.dropdown-menu a', function () {
            // 5.获取当前选中的分类的id
            id = $(this).data('id');
            //6. 获取当前点击的分类的名称 把下拉框的默认的换成选中的分类
            var categoryName = $(this).data('category-name') + '<span class="caret"></span>';
            //7. 修改下拉框按钮上的文字
            $('#dropdownMenu2').html(categoryName);
        });
        // 8. 给保存按钮添加点击事件
        $('.btn-save').on('click', function () {
            var brandName = $('.brand-name-add').val();
            var file = $('.brand-file-add').val().split('\\');
            var brandLogo = '\\mobile\\images\\' + file[file.length - 1];
            // 9.调用 添加品牌的API
            $.ajax({
                url: '/category/addSecondCategory',
                data: { 'brandName': brandName, 'brandLogo': brandLogo, 'categoryId': id, 'hot': 1 },
                type: 'post',
                success: function (data) {
                    // 10. 重新渲染页面
                    letao.getBrand();
                }
            })
        });
    }
}