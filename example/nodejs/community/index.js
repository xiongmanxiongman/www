new Vue({
    el:'#container',
    data:{
        xCommunityPageCount:0,//社区分页数
        xAddressPageCount:0,//通讯录分页数

        xCommunityStatus:'success',//社区类型状态
        xAddressStatus:'success',//通讯录类型状态

        xBreadcrumb:'社区',//社区显示状态
        xAddressShow:false,//通讯录显示状态

        xCommunityNowPage:1,//社区当前分页
        xAddressNowPage:1,//通讯录当前分页

        xAddressName:'',//通讯录名称
        xAddressTel:'',//通讯录号码
        xAddress:'',//通讯录地址
        xAddressDescription:'',//通讯录描述

        xProvinces:'',//社区省份
        xCities:'',//社区城市
        xAreas:'',//社区地区
        xCommunity:'',//社区名称
        xCommunityDescription:'',//社区描述

        xCommunityID:'',//通讯录中关联的社区ID

        xProvincesData:'',//下拉框数据省份
        xCitiesData:'',//下拉框数据城市
        xAreasData:'',//下拉框数据区域

        xCommunityList:'',//社区列表
        xAddressList:'',//通讯录列表
    },
    mounted: function () {
        //初始化下拉框工具
        this.xFnCreateSelect2();
        //获取社区列表数据
        this.xFnGetCommunityList();
    },
    methods:{
        //新增一条通讯录
        xFnAddressAdd:function () {
            axios({
                url:'/api/koa/community/addAddress',
                params:{
                    status:'primary',
                    name:this.xAddressName,
                    tel:this.xAddressTel,
                    address:this.xAddress,
                    description:this.xAddressDescription,
                    communityID:this.xCommunityID,
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xFnGetAddressList(this.xAddressNowPage,this.xCommunityID);
                }
            });
        },
        //拿到单个社区信息
        xFnGetCommunityInfo:function (id) {
            axios({
                url:'/api/koa/community/getCommunityInfo',
                params:{
                    id:id,
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xProvinces=res.data[0].provinces;
                    this.xCities=res.data[0].cities;
                    this.xAreas=res.data[0].areas;
                    this.xCommunity=res.data[0].community;
                    this.xCommunityDescription=res.data[0].description;
                }
            });
        },
        //拿到通讯录列表
        xFnGetAddressList:function (n=1,id) {
            this.xFnGetCommunityInfo(id);
            this.xAddressShow=true;
            this.xBreadcrumb = '通讯录';
            this.xCommunityID = id;
            axios({
                url:'/api/koa/community/getAddressList',
                params:{
                    page:n,
                    status:this.xAddressStatus,
                    name:this.xAddressName,
                    tel:this.xAddressTel,
                    communityID:this.xCommunityID,
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xAddressList = res.data;
                    this.xAddressNowPage = n;
                    this.xFnGetAddressCount();
                }
            });
        },
        //社区导航切换
        xFnChangeCommunityType:function (status) {
            this.xCommunityStatus = status;
            this.xFnGetCommunityList();
        },
        //通讯录导航切换
        xFnChangeAddressType:function (status) {
            this.xAddressStatus = status;
            this.xFnGetAddressList(1,this.xCommunityID);
        },
        //设置单个社区的类型
        xFnSetCommunityType:function (id,status) {
            axios({
                url:'/api/koa/community/setCommunityType',
                params:{
                    id:id,
                    status:status
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xFnGetCommunityList(this.xCommunityNowPage);
                }
            });
        },
        //设置单个通讯录的类型
        xFnSetAddressType:function (id,status) {
            axios({
                url:'/api/koa/community/setAddressType',
                params:{
                    id:id,
                    status:status
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xFnGetAddressList(this.xAddressNowPage,this.xCommunityID);
                }
            });
        },
        //拿到社区分页数
        xFnGetCommunityCount:function(){
            axios({
                url:'/api/koa/community/getCommunityCount',
                params:{
                    status:this.xCommunityStatus,
                    community:this.xCommunity,
                    provinces:this.xProvinces,
                    cities:this.xCities,
                    areas:this.xAreas,
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xCommunityPageCount=res.data.count;
                }
            });
        },
        //拿到通讯录分页数
        xFnGetAddressCount:function(){
            axios({
                url:'/api/koa/community/getAddressCount',
                params:{
                    status:this.xAddressStatus,
                    name:this.xAddressName,
                    tel:this.xAddressTel,
                    communityID:this.xCommunityID
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xAddressPageCount=res.data.count;
                }
            });
        },
        //社区上一页
        xFnCommunityPrevPage:function () {
            this.xCommunityNowPage = this.xCommunityNowPage-1;
            if(this.xCommunityNowPage<=0){
                this.xCommunityNowPage=1;
            }
            this.xFnGetCommunityList(this.xCommunityNowPage);
        },
        //社区下一页
        xFnCommunityNextPage:function () {
            this.xCommunityNowPage = this.xCommunityNowPage+1;
            if(this.xCommunityNowPage>this.xCommunityPageCount){
                if(this.xCommunityPageCount<=0){
                    this.xCommunityNowPage=1;
                }else{
                    this.xCommunityNowPage=this.xCommunityPageCount;
                }

            }
            this.xFnGetCommunityList(this.xCommunityNowPage);
        },
        //通讯录上一页
        xFnAddressPrevPage:function () {
            this.xAddressNowPage = this.xAddressNowPage-1;
            if(this.xAddressNowPage<=0){
                this.xAddressNowPage=1;
            }
            this.xFnGetAddressList(this.xAddressNowPage,this.xCommunityID);
        },
        //通讯录下一页
        xFnAddressNextPage:function () {
            this.xAddressNowPage = this.xAddressNowPage+1;
            if(this.xAddressNowPage>this.xAddressPageCount){
                if(this.xAddressPageCount<=0){
                    this.xAddressNowPage=1;
                }else{
                    this.xAddressNowPage=this.xAddressPageCount;
                }

            }
            this.xFnGetAddressList(this.xAddressNowPage,this.xCommunityID);
        },
        //拿到社区列表
        xFnGetCommunityList:function (n=1) {
            axios({
                url:'/api/koa/community/getCommunityList',
                params:{
                    page:n,
                    status:this.xCommunityStatus,
                    community:this.xCommunity,
                    provinces:this.xProvinces,
                    cities:this.xCities,
                    areas:this.xAreas,
                }
            }).then(res=>{
                if(res.data.err){
                    alert(res.data.msg);
                }else{
                    this.xCommunityList = res.data;
                    this.xCommunityNowPage = n;
                    this.xFnGetCommunityCount();
                }
            });
        },
        //新建一个社区
        xFnCommunityAdd:function () {
            if(this.xCommunityStatus&&this.xProvinces&&this.xCities&&this.xAreas&&this.xCommunity&&this.xCommunityDescription){
                axios({
                    url:'/api/koa/community/addCommunity',
                    params:{
                        status:'primary',
                        provinces:this.xProvinces,
                        cities:this.xCities,
                        areas:this.xAreas,
                        community:this.xCommunity,
                        description:this.xCommunityDescription
                    }
                }).then(res=>{
                    if(res.data.err){
                        alert(res.data.msg);
                    }else{
                        this.xFnGetCommunityList(this.xCommunityNowPage);
                    }
                });
            }else{
                alert('请填完表单');
            }
        },
        //select2下拉组件初始化
        xFnCreateSelect2:function(){
            var _this = this;
            this.xProvincesData = $.map(xPcaCode, function (obj) {
                obj.id = obj.code; // replace pk with your identifier
                obj.text = obj.name;
                return obj;
            });
            $("#xProvinces select").select2({
                width:160,
                data: this.xProvincesData,
                allowClear:true,
                placeholder:'省份'
            });
            $("#xProvinces select").select2('val','0')
            $("#xProvinces").on('select2:select','select',function(e){
                _this.xProvinces = e.params.data.text;
                _this.xFnGetCommunityList(this.xCommunityNowPage);
                $("#xCities").html('<select></select>').show();
                $("#xAreas").html('<select></select>').hide();
                var data = e.params.data;
                this.xCitiesData = $.map(data.childs, function (obj) {
                    obj.id = obj.code; // replace pk with your identifier
                    obj.text = obj.name;
                    return obj;
                });
                $("#xCities select").select2({
                    width:210,
                    data: this.xCitiesData,
                    allowClear: true,
                    placeholder:'城市'
                });
                $("#xCities select").select2('val','0')
            });
            $("#xCities").on('select2:select','select',function(e){
                _this.xCities = e.params.data.text;
                _this.xFnGetCommunityList(this.xCommunityNowPage);
                $("#xAreas").html('<select></select>').show();
                var data = e.params.data;
                this.xAreasData = $.map(data.childs, function (obj) {
                    obj.id = obj.code; // replace pk with your identifier
                    obj.text = obj.name;
                    return obj;
                });
                $("#xAreas select").select2({
                    width:180,
                    data: this.xAreasData,
                    allowClear: true,
                    placeholder:'区域'
                });
                $("#xAreas select").select2('val','0')
            });
            $("#xAreas").on('select2:select','select',function(e){
                _this.xAreas = e.params.data.text;
                _this.xFnGetCommunityList(this.xCommunityNowPage);
            });


            $("#xProvinces").on('select2:unselect','select',function(e){
                _this.xProvinces = '';
                _this.xCities = '';
                _this.xAreas = '';
                _this.xFnGetCommunityList(this.xCommunityNowPage);
                $("#xCities").html('<select></select>').hide();
                $("#xAreas").html('<select></select>').hide();
            });
            $("#xCities").on('select2:unselect','select',function(e){
                _this.xCities = '';
                _this.xAreas = '';
                _this.xFnGetCommunityList(this.xCommunityNowPage);
                $("#xAreas").html('<select></select>').hide();
            });
            $("#xAreas").on('select2:unselect','select',function(e){
                _this.xAreas = '';
                _this.xFnGetCommunityList(this.xCommunityNowPage);
            });

        }
    }
});