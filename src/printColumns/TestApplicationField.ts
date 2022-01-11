import { PrintColumn } from '../utils/printStringParser';

const applicationColumns: Array<PrintColumn> = [
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
    name: 'zh_plan_quantity',
    title: '总计划量',
    length: 12,
  },
  {
    name: 'need_quantity',
    title: '需用数量',
    length: 12,
  },
  {
    name: 'quantity_sq',
    title: '累计申请量',
    length: 12,
  },
  {
    name: 'quantity_zong',
    title: '总计划量',
    length: 12,
  },
  {
    name: 'refer_price',
    title: '参考价格',
    length: 12,
  },
  {
    name: 'subtotal',
    title: '小计',
    length: 12,
  },
  {
    name: 'remarks',
    title: '备注',
    length: 12,
  },
];
export { applicationColumns };
