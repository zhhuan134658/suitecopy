const searchBarSubmit = (_this:any, value: any, type: any) => {
    const newData = _this.state.allData
    console.log('new submit',value)
    newData.name = value
    _this.asyncSetFieldProps(newData, type)
}

const searchBarChange = (_this: any, value: any, type: any) => {
    if (!value) {
        searchBarSubmit(_this,'',type)
    }
    _this.setState({
        SearchBarvalue:value
    })
}

export {searchBarSubmit,searchBarChange}