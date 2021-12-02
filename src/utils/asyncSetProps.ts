import { refreshDataResolve, resRefreshData } from '../types/Response';

const asyncSetProps = (
  _this: any,
  value: any,
  bizAlias: string,
  biaoName?: string,
  altProjectName?: string,
) => {
  const { form, spi } = _this.props;
  const ProjectName = form.getFieldValue('Autopro');

  value.project_name = ProjectName;
  if (altProjectName) {
    value.project_name = altProjectName;
  }
  if (biaoName) {
    value.biao_name = biaoName;
  }
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
  return new Promise<refreshDataResolve>((resolve, reject) => {
    spi
      .refreshData({
        modifiedBizAlias: [bizAlias],
        bizAsyncData,
      })
      .then((res: resRefreshData) => {
        let dataArray: any;
        let extendArray: any;
        let currentPage: any;
        let totalCount: any;
        let message: any;
        const resolveData: refreshDataResolve = {
          dataArray: undefined,
          extendArray: undefined,
          currentPage: undefined,
          totalCount: undefined,
          message: undefined,
        };
        try {
          dataArray = JSON.parse(res.dataList[0].value).data;
          extendArray = JSON.parse(res.dataList[0].extendValue);
          currentPage = JSON.parse(res.dataList[0].value).page;
          totalCount = JSON.parse(res.dataList[0].value).count;
          message = JSON.parse(res.dataList[0].value).msg;
          resolveData.dataArray = dataArray;
          resolveData.currentPage = currentPage;
          resolveData.extendArray = extendArray;
          resolveData.totalCount = totalCount;
          resolveData.message = message;
          resolve(resolveData);
        } catch (e) {
          reject(e);
        }
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export { asyncSetProps };
