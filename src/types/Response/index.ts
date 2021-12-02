export interface resRefreshData {
  dataList: Array<dataListObjects>;
  schemaList: Array<schemaListObjects>;
  seqId: Number;
}

export interface dataListObjects {
  bizAlias: string;
  extendValue: string;
  value: string;
}

export interface schemaListObjects {
  bizAlias: string;
  componentName: string;
  extendValue: string;
  value: string;
}

export interface refreshDataResolve {
  dataArray: any;
  extendArray: any;
  currentPage: any;
  totalCount: any;
  message: any;
}
