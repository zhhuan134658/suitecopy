import { PrintColumn } from '../utils/printStringParser';

const expeColumns: Array<PrintColumn> = [
  {
    name: 'ke_name',
    title: '费用科目',
    length: 20,
  },
  {
    name: 'money',
    title: '金额',
    length: 12,
  },
  {
    name: 'remarks',
    title: '备注',
    length: 20,
  },
];
export { expeColumns };
