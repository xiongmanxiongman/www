class Demo extends React.Component{
    constructor(){
        super();
        this.state={
            value:'',
            arr:[]
        }
    }
    handleChange = (ev) =>{
        this.setState({
            value:ev.target.value
        });
    }
    handleSubmit = (ev) =>{
        let arr = [...this.state.arr];
        arr.unshift(this.state.value);

        this.setState({
            arr,
            value:''
        });
        ev.preventDefault();
    }
    handleDel = (index)=>{
        let arr = [...this.state.arr];
        arr.splice(index,1);

        this.setState({arr});
    }
    render(){
        return (<div>
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholader="请输入名字"
                       value={this.state.value}
                       onChange={this.handleChange}
                />
                <button>添加</button>
            </form>
            <ul>
                {
                    this.state.arr.map((val,index)=>
                        <li key={index}>
                            {val}
                            <a href="javascript:;" onClick={()=>this.handleDel(index)}>删除</a>
                        </li>
                    )
                }
            </ul>
        </div>)
    }
}
ReactDOM.render(
    <Demo />,
    document.querySelector('#app')
)