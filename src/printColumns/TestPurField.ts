import { PrintColumn } from '../utils/printStringParser';

const purColumns: Array<PrintColumn> = [
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
    name: 'det_quantity',
    title: '数量',
    length: 12,
  },
  {
    name: 'no_unit_price',
    title: '不含税单价',
    length: 12,
  },
  {
    name: 'tax_rate',
    title: '税率',
    length: 12,
  },
  {
    name: 'tax_amount',
    title: '税额',
    length: 12,
  },
  {
    name: 'no_amount_tax',
    title: '不含税金额',
    length: 12,
  },
  {
    name: 'amount_tax',
    title: '含税金额',
    length: 12,
  },
];
export { purColumns };
