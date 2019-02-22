new Vue({
    el: '#app',
    data() {
        return {
            //列表存储
            tableData: [
        //{id: 1, name: "兔子", price: 36, salesVolume: 1044, classify: "宠物"},
            ],
            //批量选中存储
            multipleSelection: [],
            //新建编辑弹窗
            dialogFormVisible: false,
            //新建编辑弹框存储
            form: {
                name: '',
                price: '',
                discount: '',
                src: '',
                classify: '',
            },
            //新建编辑弹框字段名宽度
            formLabelWidth: '120px',
            //删除确认弹框
            dialogVisible: false,
            //查询存储
            formQuery: {
                name: '',
                priceStart:'',
                priceEnd:'',
                salesVolumeStart:'',
                salesVolumeEnd:'',
                classify: ''
            },
            //商品分类存储
            classifyData:[],
            //elementui筛选功能存储
            classifyFilters:[],
            //表单验证规则
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                price: [
                    { required: true, message: '请填写价格', trigger: 'blur' },
                ],
                src: [
                    { required: true, message: '请填写图片路径', trigger: 'blur' }
                ],
                classify: [
                    { required: true, message: '请选择商品分类', trigger: 'change' }
                ]
            },
            //翻页存储
            pagination:{
                pageSizes:[10,30, 50, 100],
                pageSize:10,
                total:0,
                currentPage: 1,
            },
            //图片预览
            imageUrl:'',
            //弹框按钮行为add,update
            act:'',
            //更新商品的id
            id:'',
        }
    },
    mounted(){
        this.myInit();
    },
    watch: {
        //监控查询字段更新列表
        formQuery: {
            deep: true,
            handler() {
                this.getCommodityList();
            }
        },
    },
    methods: {
        //初始化
        myInit(){
            this.getCommodityList();
        },
        //axios简单封装
        myApi(url,params) {
            return new Promise(function (resolve, reject) {
                axios({
                    url,
                    params,
                }).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
            });
        },
        api(url,params){
            return new Promise(function (resolve, reject) {
                axios.post(
                    url,
                    params,
                ).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err);
                });
            });
        },
        //获取商品列表&筛选
        async getCommodityList() {
            //后台接口
            let url = '/api/koa/commodity/list';
            //参数有或者没有都传给后台
            let params = {
                name:this.formQuery.name?this.formQuery.name:'',
                classifyID:this.formQuery.classify?this.formQuery.classify:'',
                priceStart:this.formQuery.priceStart?this.formQuery.priceStart:'',
                priceEnd:this.formQuery.priceEnd?this.formQuery.priceEnd:'',
                salesVolumeStart:this.formQuery.salesVolumeStart?this.formQuery.salesVolumeStart:'',
                salesVolumeEnd:this.formQuery.salesVolumeEnd?this.formQuery.salesVolumeEnd:'',
                pageSize:this.pagination.pageSize?this.pagination.pageSize:'',
                currentPage:this.pagination.currentPage?this.pagination.currentPage:'',
            }
            try{
                //执行接口请求
                let resData = await this.myApi(url,params);
                this.tableData = resData.data.data;
                this.classifyData = resData.data.classify;
                this.classifyFilters = resData.data.classify.map(item=>{
                    let json = {};
                    json.text = item.label;
                    json.value = item.label;
                    return json;
                });
                this.pagination.total = resData.data.total;
            }catch (e){
                this.$notify.error({
                    title: '似乎出问题了',
                    message: e,
                });
            }
        },
        //弹框提交
        async handleSubmit() {
            let act = this.act;
            let url = '';
            let params = '';
            if(act=='add'){
                params = this.form;
                url = '/api/koa/commodity/add';//添加一个商品
            }else if(act=='update'){
                params = {
                    id:this.id
                }
                Object.assign(params,this.form);
                url = '/api/koa/commodity/update';//更新一个商品
            }
            try{
                let resData = await this.myApi(url,params);
                if(act=='add'){
                    this.$notify.success({
                        title: '添加商品成功',
                        message: resData.data.msg,
                    });
                }else if(act=='update'){
                    this.$notify.success({
                        title: '更新商品成功',
                        message: resData.data.msg,
                    });
                }
                this.dialogFormVisible = false;
                this.myInit();
            }catch (e){
                this.$notify.error({
                    title: '似乎出问题了',
                    message: e,
                });
            }
        },
        //elementui筛选功能
        filterTag(value, row) {
            return row.classify === value;
        },
        //批量选择操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //删除确认
        async handleDel(str){
            //判断是否登陆过
            if (localStorage.token){
                let url = '/api/koa/commodity/del';//删除商品接口
                let id = '';
                //如果调用删除带有'batch'参数,就做批量删除
                if(str=='batch'){
                    //将elementui的结果处理成[1,2,3,4,5]数组
                    id=this.multipleSelection.map((item)=>{
                        let arr = [];
                        arr.push(item.id);
                        return arr;
                    });
                }else{
                    //如果不是批量删除,直接拿到id
                    id=this.id;
                }
                //传给后台的参数
                let params = {
                    id,
                    token:localStorage.token
                }
                try{
                    //请求接口
                    let resData = await this.api(url,params);
                    if(resData.data.success){
                        this.$notify.success({
                            title: '删除商品成功',
                            message: resData.data.msg,
                        });
                    }else{
                        this.$notify.error({
                            title: '删除商品失败',
                            message: resData.data.msg,
                        });
                    }
                    this.myInit();
                }catch (e){
                    this.$notify.error({
                        title: '似乎出问题了',
                        message: e,
                    });
                }
            }else{
                this.$notify.error({
                    title: '似乎出问题了',
                    message: '当前未登录,禁止删除',
                });
            }
            //关闭对话框
            this.dialogVisible = false;

        },
        //删除弹框
        async handleDelete(index, row) {
            this.id = row.id;
            this.dialogVisible = true;
        },
        //编辑
        handleEdit(index, row) {
            if(arguments.length){
                this.act = 'update';
                this.id = row.id;
                this.form.name = row.name;
                this.form.classify = this.classifyData.filter((item)=>{
                    return item.label==row.classify;
                })[0].value;
                this.form.price = row.price;
                this.form.discount = row.discount;
                this.form.src = row.src;
                this.imageUrl = '//upload.ijilu.cn'+row.src;
            }else{
                this.resetForm();
                this.act = 'add';
            }
            this.dialogFormVisible = true;
        },
        //重置弹框
        resetForm(){
            for(let item in this.form){
                this.form[item] = '';
            }
            this.imageUrl = '';
        },
        //关闭弹框
        handleClose(done) {
            this.dialogVisible = false;
        },
        //翻页-每页显示多少条
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.pagination.currentPage = 1;
            this.getCommodityList();
        },
        //翻页-点击页码
        handleCurrentChange(val) {
            this.pagination.currentPage = val;
            this.getCommodityList();
        },
        //图片上传
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            let path = res.data.file[0].destination.replace('/var/upload','')+res.data.file[0].filename;
            this.form.src = path;
        },
        //图片上传限制
        beforeAvatarUpload(file) {
            //const isJPG = file.type === 'image/jpeg';
            const isLt1M = file.size / 1024 / 1024 < 1;

            /*if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }*/
            if (!isLt1M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            //return isJPG && isLt1M;
            return isLt1M;
        }
    }
});
