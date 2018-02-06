window.addEventListener('load',function(){
    var letao=new Letao();
    letao.queryHistory();
    letao.addHistory();
    letao.deleteHistory();
    letao.clearHistory();
})

var Letao=function () {
    
}

Letao.prototype={
    addHistory:function () {
        $('.mui-btn').on('click',function(){
            var search=$('input[type=search]').val();
            if(!search){
                alert('请输入商品');
                return false;
            }
            var history=localStorage.getItem('history')||'[]';
            history=JSON.parse(history);
            
            var id=0;
            if(history.length==0){
                id=1;
            }else{
                id=history[history.length-1].id+1;
            }
            var obj={id:id,'search':search};
            history.push(obj);
            
            localStorage.setItem('history',JSON.stringify(history));
            var letao=new Letao();
            letao.queryHistory();

            window.location.href='productlist.html?search='+search;
        })
    },

    queryHistory:function () {
        var history=localStorage.getItem('history')||'[]';

        history=JSON.parse(history);

        history=history.reverse();

        var result = template('historyList', { 'row': history });

        $('.mui-table-view').html(result);

    },

    deleteHistory:function () {
        $('.mui-table-view').on('click','.fa-close',function () {
            var id=$(this).parent().parent().data('id');
            console.log(id);
            
            var history = localStorage.getItem('history') || '[]';

            history = JSON.parse(history);

            for(var i=0;i<history.length;i++){
                if(history[i].id==id){
                    history.splice(i,1)
                }
            }

            localStorage.setItem('history',JSON.stringify(history));
            var letao=new Letao();
            letao.queryHistory();

            
        })
    },

    clearHistory:function () {
        var that=this;
        $('.fa-trash').on('click',function () {
            localStorage.setItem('history','');
            that.queryHistory();
        })
    }

}