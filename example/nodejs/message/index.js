new Vue({
    el:'#content',
    data:{
        username:'',
        message:'',
        msgList:[],
        xPageCount:0,
        nowIndex:-1,
        pageCount:0, //总页数
        nowPage:1, //当前第几页
        id:0
    },
    mounted(){
        this.getPageData();
    },
    methods:{
        fnPrevPage(){
            this.nowPage = this.nowPage-1;
            if(this.nowPage<=0){
                this.nowPage=1;
            }
            this.getPageData(this.nowPage);
        },
        fnNextPage(){
            this.nowPage = this.nowPage+1;
            if(this.nowPage>this.pageCount){
                if(this.pageCount<=0){
                    this.nowPage=1;
                }else{
                    this.nowPage=this.pageCount;
                }

            }
            this.getPageData(this.nowPage);
        },
        getPageCount(){
            $.ajax({
                url:'/api/express/message/count'
            }).then(res=>{
                if(res.err){
                    alert(res.msg);
                }else{
                    this.pageCount=res.count;
                }
            });
        },
        getPageData(n=1){
            $.ajax({
                url:'/api/express/message/list',
                data:{
                    page:n
                }
            }).then(res=>{
                if(res.err){
                    alert(res.msg);
                }else{
                    this.msgList = res;
                    this.nowPage = n;
                    this.getPageCount();
                }
            })
        },
        addMsg(){
            if(this.username&&this.message){
                $.ajax({
                    url:'/api/express/message/add',
                    data:{
                        username:this.username,
                        message:this.message
                    }
                }).then(res=>{
                    if(res.err){
                        alert(res.msg);
                    }else{
                        this.msgList.push({
                            ID:res.ID,
                            username:this.username,
                            message:this.message
                        });
                        this.message='';
                        this.getPageData(1);
                    }
                });
            }
        },
        changeIndex(n,id){
            this.nowIndex=n;
            this.id=id;
        }
    }
});