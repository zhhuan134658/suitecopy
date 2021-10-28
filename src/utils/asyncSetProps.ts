const asyncSetProps = (_this:any, value: any, bizAlias: string) => {
    const { form, spi } = _this.props
    const ProjectName = form.getFieldValue('Autopro')
    value.project_name = ProjectName
    const keyField = form.getFieldInstance(bizAlias)
    const key = keyField.getProp('id')
    const bizAsyncData = [
        {
            key,
            bizAlias: bizAlias,
            extendValue: value,
            value: '1'
        }
    ]
    return new Promise((resolve, reject) => {
        spi.refreshData({
            modifiedBizAlias: [bizAlias],
            bizAsyncData
        }).then(res => {
            let dataArray
            try {
                dataArray = JSON.parse(res['dataList'][0]['value']).data
                resolve(dataArray)
            } catch (e) {
                reject(e)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export {asyncSetProps}