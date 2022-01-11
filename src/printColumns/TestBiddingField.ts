import { PrintColumn } from '../utils/printStringParser';

const biddingColumns: Array<PrintColumn> = [
  {
    name: 'name',
    title: '设备名称',
    length: 16,
  },
  {
    name: 'unit',
    title: '单位',
    length: 12,
  },
  {
    name: 'size',
    title: '规格型号',
    length: 12,
  },
  {
    name: 'number',
    title: '估算数量',
    length: 12,
  },
  {
    name: 'purchase_unit',
    title: '物资采购单位',
    length: 12,
  },
  {
    name: 'purchase_riqi',
    title: '采购日期',
    length: 12,
  },
  {
    name: 'purchase_address',
    title: '采购地点',
    length: 12,
  },
  {
    name: 'candidate_list',
    title: '候选供应商名单',
    length: 12,
  },
];
export { biddingColumns };
