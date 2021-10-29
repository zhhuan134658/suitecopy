const asyncSetProps = (_this: any, value: any, bizAlias: string) => {
  const { form, spi } = _this.props;
  const ProjectName = form.getFieldValue('Autopro');
  value.project_name = ProjectName;
  const keyField = form.getFieldInstance(bizAlias);
  const key = keyField.getProp('id');
  const bizAsyncData = [
    {
      key,
      bizAlias: bizAlias,
      extendValue: value,
      value: '1',
    },
  ];
  return new Promise((resolve, reject) => {
    spi
      .refreshData({
        modifiedBizAlias: [bizAlias],
        bizAsyncData,
      })
      .then(res => {
        let dataArray;
        let extendArray;
        let currentPage;
        let totalCount;
        let message;
        try {
          dataArray = JSON.parse(res['dataList'][0]['value']).data;
          extendArray = JSON.parse(res['dataList'][0]['extendValue']);
          currentPage = JSON.parse(res['dataList'][0]['value']).page;
          totalCount = JSON.parse(res['dataList'][0]['value']).count;
          message = JSON.parse(res['dataList'][0]['value']).msg;
          let resolveData = {
            dataArray: dataArray,
            extendArray: extendArray,
            currentPage: currentPage,
            totalCount: totalCount,
            message: message,
          };
          resolve(resolveData);
        } catch (e) {
          reject(e);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export { asyncSetProps };
