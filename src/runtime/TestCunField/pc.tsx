//材料盘点-筑快OA
// import React from 'react';
// import { Input } from 'antd';
// import { IFormField } from '../../types';

// import './pc.less';

// interface ISwapFormField extends IFormField {
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// /**
//  * 自定义控件运行态 PC 视图
//  */
// const FormField: ISwapFormField = {
//   handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { form } = this.props;
//     form.setFieldValue('TestCun', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('TestCun');
//     const label = form.getFieldProp('TestCun', 'label');
//     const placeholder = form.getFieldProp('TestCun', 'placeholders');

//     return (
//       <div className="pc-custom-field-wrap">
//         <div className="label">{label}</div>
//         {field.getProp('viewMode') ? (
//           field.getExtendValue()
//         ) : (
//           <Input placeholder={placeholder} onChange={this.handleChange} />
//         )}
//       </div>
//     );
//   },
// };

// export default Fo,rmField;
import { Pagination } from 'antd';
import { Tree } from 'antd';
const { DirectoryTree } = Tree;
import { Layout } from 'antd';
import { QuestionCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  TreeSelect,
  Select,
  notification,
  Table,
  Tooltip,
  Modal,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
} from 'antd';
const { Search } = Input;
const { Option } = Select;
import { IFormField } from '../../types';
const { Column } = Table;
import { FormInstance } from 'antd/lib/form';

import './pc.less';
import { fpAdd, toFixed } from '../../utils/fpOperations';
const mychcolumns = [
  {
    title: '仓库名称',
    dataIndex: 'name',
    render: (_, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <span>{record.name}</span>
      </Tooltip>
    ),
  },
  {
    title: '编号',
    dataIndex: 'number',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
  },
];
const mycolumns = [
  {
    title: '物品名称',
    dataIndex: 'name',
    render: (_, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <span>{record.name}</span>
      </Tooltip>
    ),
  },
  {
    title: '物品类型',
    dataIndex: 'type_name',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '含税单价（元）',
    dataIndex: 'tax_price',
  },
  {
    title: '规格型号',
    dataIndex: 'size',
  },
];
interface ISwapFormField extends IFormField {
  //   handleChange: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  formDataWatch: () => void;
  //   handleTableChange: () => void;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id: number;
  key: string;
  name: string;
  size: string;
  type: string;
  num1: number;
  num2: number;
  num3: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item, values: any) => void;
  handleChange: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleChange,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  // const inputRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      //   inputRef.current!.change();
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit(); //onchange事件 输入一次失去焦点
      handleSave({ ...record, ...values }, values);
    } catch (errInfo) {
      console.log('11Save failed:', errInfo);
    }
  };

  //   const focusSave = () => {
  //     handleChange({ ...record });
  //   };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        {/*    */}
        {/*   */}
        {/* <Input ref={inputRef} /> */}

        <InputNumber
          className="editable-cell-value-inputNumber"
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          min={0}
          step="0.01"
          placeholder="请输入"
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
    // childNode = (
    //   <Form.Item
    //     style={{ margin: 0 }}
    //     name={dataIndex}
    //     rules={[
    //       {
    //         required: true,
    //         message: `${title} 不能为空`,
    //       },
    //     ]}
    //   >
    //     <InputNumber
    //       ref={inputRef}
    //       onChange={save}
    //       onBlur={save}
    //       placeholder="请输入"
    //     />
    //   </Form.Item>
    // );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: any;
  key: React.Key;
  name: string;
  size: string;
  type: string;
}

interface EditableTableState {
  dataSource: DataType[];
  count: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

/**
 * 自定义控件运行态 PC 视图
 */
const FormField: ISwapFormField = {
  getInitialState() {
    return {
      value: undefined,
      msgdata: '',
      newOptine: [],
      visibleModal: false,
      Housetype: '',
      Inputvalue: '',
      Inputvaluein: '',
      Inputmoney2: '',
      Inputmoney1: '',
      current_page: '', //当前页
      current_pagech: '',
      total2: '',
      totalch2: '',
      allData: {
        type: '0',
        number: '10',
        page: '1',
        name: '',
      },
      allchData: {
        type: '0',
        number: '10',
        page: '1',
        name: '',
      },
      isModalVisible: false,
      ischModalVisible: false,
      listData: [],
      listchData: [],
      treeData: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },

      loading: false,
      leaveLongVal: '',

      //   dataSource: [],
      dataSource: [],
      count: 1,

      currentEditId: 0,
      currentSelectData: [],
      selectedRowKeys: [],
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    // const newdate = this.state.allData;
    // this.asyncSetFieldProps(newdate);
  }, //新增
  newAdd() {
    this.setState({
      visibleModal: true,
    });
  },
  //取消
  handlenewCancel() {
    this.setState({
      visibleModal: false,
    });
  },
  //确认
  handlenewOk(values) {
    console.log(values);
    this.setState({
      visibleModal: false,
    });
  },

  onGenderChange(value) {
    console.log(value);
  },
  onGenderChange1(value, key) {
    console.log(key);
  },
  onSearchch(value) {
    console.log(value);
    const newvalue = this.state.allchData;
    newvalue.name = value;
    newvalue.type = 0;
    newvalue.page = 1;
    newvalue.isHouse = '1';
    // this.setState({
    //   allchData: newvalue,
    // });
    this.asyncSetFieldProps(newvalue, '1');
  },
  onSearch(value) {
    console.log(value);
    const newvalue = this.state.allData;
    newvalue.name = value;
    newvalue.type = 0;
    newvalue.page = 1;
    newvalue.isHouse = 2;
    // this.setState({
    //   allData: newvalue,
    // });
    this.asyncSetFieldProps(newvalue, '2');
  },
  onChangepage(page) {
    const newpage = this.state.allData;
    newpage.page = page;
    newpage.isHouse = '2';
    console.log(newpage);
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage, '2');
    // this.getData(page);
    // this.setState({
    //   loading: true,
    // });
  },
  handleChange(row: DataType) {
    // const inputRef = useRef<HTMLInputElement>(null);
    // const { form } = this.props;
    // form.setFieldValue('TestCun', e.target.value);
    // document.getElementsByClassName('ptID').blur();
    // inputRef.current!.focus();
    this.setState({ currentEditId: row.key });
    // this.setState({ isModalVisible: true });
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleCancelch() {
    this.setState({ ischModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleDelete(row) {
    const dataSource = [...this.state.dataSource];
    const arr = dataSource.filter(item => item.id !== row.id);
    this.setState({
      dataSource: arr,
    });
    //   含税金额
    let newarr2 = [];

    newarr2 = arr.filter(item => {
      if (item.amount_tax) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.amount_tax;
    });
    //不含税金额
    let newarr4 = [];

    newarr4 = arr.filter(item => {
      if (item.no_amount_tax) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.no_amount_tax;
    });

    let newdata1 = eval(newarr2.join('+'))
      ? toFixed(eval(newarr2.join('+')), 2)
      : null;

    if (isNaN(newdata1)) {
      this.setState({
        Inputmoney1: 0,
      });
    } else {
      this.setState({
        Inputmoney1: newdata1,
      });
    }
    let newdata2 = eval(newarr4.join('+'))
      ? toFixed(eval(newarr4.join('+')), 2)
      : null;

    if (isNaN(newdata2)) {
      this.setState({
        Inputmoney2: 0,
      });
    } else {
      this.setState({
        Inputmoney2: newdata2,
      });
    }
  },
  iconClick(val) {
    if (val === 'out') {
      this.setState({
        Inputvalue: '',
        Inputvaluein: '',
        dataSource: [],
        Inputmoney2: 0,
        Inputmoney1: 0,
      });
    } else {
      this.setState({
        Inputvaluein: '',
        Inputmoney2: 0,
        Inputmoney1: 0,
      });
    }

    console.log('测试点击');
  },
  chhandleAdd(val) {
    const newdate = this.state.allData;
    newdate.isHouse = '1';
    console.log(val);
    this.setState({
      ischModalVisible: true,
      Housetype: val,
    });

    this.asyncSetFieldProps(newdate, '1');
  },
  handleAdd() {
    // const { count, dataSource } = this.state;
    // const newData: DataType = {
    //   key: count,
    //   name: '请选择物资',
    //   age: '',
    //   address: '',
    // };
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // });
    const value = this.state.Inputvalue;
    if (value) {
      const newdate = this.state.allData;

      newdate.ck_name = this.state.Inputvalue;
      newdate.isHouse = '2';
      this.asyncSetFieldProps(newdate, '2');
      this.setState({
        isModalVisible: true,
        // allData: newdate,
      });
    } else {
      notification.open({
        message: '请先选择出库库房',
      });
    }
  },
  accSub(num1, num2) {
    var r1, r2, m, n;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  },
  // 两数相除
  accDiv(num1, num2) {
    var t1, t2, r1, r2;
    try {
      t1 = num1.toString().split('.')[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = num2.toString().split('.')[1].length;
    } catch (e) {
      t2 = 0;
    }
    r1 = Number(num1.toString().replace('.', ''));
    r2 = Number(num2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  // 两个浮点数相乘
  accMul(num1, num2) {
    var m = 0,
      s1 = num1.toString(),
      s2 = num2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  },
  // 两个浮点数求和
  accAdd(num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
  },
  toFixed(dight, bits) {
    return Math.round(dight * Math.pow(10, bits)) / Math.pow(10, bits);
  },

  handleSave(row: any, values) {
    const { form } = this.props;
    const newData = [...this.state.dataSource];
    const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    const index = newData.findIndex(item => row.id === item.id);
    row['det_quantity'] = row['wz_number'];
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if (!(reg.test(row.tax_rate) || reg.test(row.det_quantity))) {
      return this.setState({
        dataSource: newData,
      });
    }
    switch (Object.keys(values)[0]) {
      case 'no_unit_price':
        if (reg.test(row.no_unit_price) && reg.test(row.tax_rate)) {
          //   含税单价
          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let a = 1 + row.tax_rate * 0.01;
          newData[index].unit_price = this.toFixed(
            this.accMul(row.no_unit_price, a),
            2,
          );
        } else if (
          row.no_unit_price == null &&
          reg.test(row.tax_rate) &&
          row.unit_price
        ) {
          //   newData[index].no_unit_price = (
          //     row.unit_price /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let a = 1 + row.tax_rate * 0.01;

          newData[index].no_unit_price = this.toFixed(
            this.accDiv(row.unit_price, a),
            2,
          );
        }
        break;
      case 'unit_price':
        if (row.unit_price && reg.test(row.tax_rate)) {
          //   bu含税单价
          let a = 1 + row.tax_rate * 0.01;

          newData[index].no_unit_price = this.toFixed(
            this.accDiv(row.unit_price, a),
            2,
          );
          //   newData[index].no_unit_price = (
          //     row.unit_price /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        } else if (
          row.unit_price == null &&
          reg.test(row.tax_rate) &&
          row.no_unit_price
        ) {
          let a = 1 + row.tax_rate * 0.01;
          newData[index].unit_price = this.toFixed(
            this.accMul(row.no_unit_price, a),
            2,
          );
          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }
        if (row.unit_price && row.det_quantity) {
          //   newData[index].amount_tax = (
          //     row.unit_price * row.det_quantity
          //   ).toFixed(2);
          newData[index].amount_tax = this.toFixed(
            this.accMul(row.unit_price, row.det_quantity),
            2,
          );
        }

        //不含税金额
        if (row.unit_price && row.det_quantity && reg.test(row.tax_rate)) {
          let a = 1 + row.tax_rate * 0.01;
          let b = this.accMul(row.unit_price, row.det_quantity);

          newData[index].no_amount_tax = this.toFixed(this.accDiv(b, a), 2);

          //   newData[index].no_amount_tax = (
          //     (row.unit_price * row.det_quantity) /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let c = row.unit_price * row.det_quantity;
          let d = 1 + row.tax_rate * 0.01;
          let e = this.accDiv(c, d);
          let f = row.tax_rate * 0.01;
          newData[index].tax_amount = this.toFixed(this.accMul(e, f), 2);

          //   newData[index].tax_amount = (
          //     ((row.unit_price * row.det_quantity) / (1 + row.tax_rate * 0.01)) *
          //     row.tax_rate *
          //     0.01
          //   ).toFixed(2);
        }

        break;
      case 'tax_rate':
        if (row.no_unit_price && !reg.test(row.unit_price)) {
          //   let a = 1 + row.tax_rate * 0.01;
          //   newData[index].unit_price = this.toFixed(
          //     this.accMul(row.no_unit_price, a, 2),
          //   );

          newData[index].unit_price = this.toFixed(
            row.no_unit_price * (1 + row.tax_rate * 0.01),
            2,
          );
        } else if (!reg.test(row.no_unit_price) && row.unit_price) {
          //   let a = 1 + row.tax_rate * 0.01;
          //   newData[index].no_unit_price = this.toFixed(
          //     this.accDiv(row.unit_price, a),
          //     2,
          //   );

          newData[index].no_unit_price = this.toFixed(
            row.unit_price / (1 + row.tax_rate * 0.01),
            2,
          );

          newData[index].amount_tax = this.toFixed(
            row.unit_price * row.det_quantity,
            2,
          );
          newData[index].no_amount_tax = this.toFixed(
            (row.unit_price * row.det_quantity) / (1 + row.tax_rate * 0.01),
            2,
          );
          newData[index].tax_amount = this.toFixed(
            newData[index].amount_tax - newData[index].no_amount_tax,
            2,
          );
        } else if (row.no_unit_price && row.unit_price) {
          let a = 1 + row.tax_rate * 0.01;
          newData[index].unit_price = this.toFixed(
            this.accMul(row.no_unit_price, a),
            2,
          );
          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }
        if (
          reg.test(row.no_unit_price) &&
          reg.test(row.det_quantity) &&
          reg.test(row.tax_rate)
        ) {
          let a = this.accMul(row.no_unit_price, row.det_quantity);
          let b = this.accMul(row.tax_rate, 0.01);
          newData[index].tax_amount = this.toFixed(this.accMul(a, b), 2);
          //   newData[index].tax_amount = (
          //     row.no_unit_price *
          //     row.det_quantity *
          //     row.tax_rate *
          //     0.01
          //   ).toFixed(2);
          let c = this.accMul(row.no_unit_price, row.det_quantity);
          let d = 1 + row.tax_rate * 0.01;
          newData[index].amount_tax = this.toFixed(this.accMul(c, d), 2);
          //   newData[index].amount_tax = (
          //     row.no_unit_price *
          //     row.det_quantity *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }

        break;
      default:
        break;
    }

    //税额
    if (Object.keys(values)[0] != 'unit_price') {
      if (row.no_unit_price && row.det_quantity && reg.test(row.tax_rate)) {
        let a = this.accMul(row.no_unit_price, row.det_quantity);
        let b = this.accMul(row.tax_rate, 0.01);
        newData[index].tax_amount = this.toFixed(this.accMul(a, b), 2);
        // newData[index].tax_amount = (
        //   row.no_unit_price *
        //   row.det_quantity *
        //   row.tax_rate *
        //   0.01
        // ).toFixed(2);
      }
      //   不含税
      if (row.no_unit_price && row.det_quantity) {
        newData[index].no_amount_tax = this.toFixed(
          this.accMul(row.no_unit_price, row.det_quantity),
          2,
        );
        // newData[index].no_amount_tax = (
        //   row.no_unit_price * row.det_quantity
        // ).toFixed(2);
      }
      //含税
      if (row.no_unit_price && row.det_quantity && reg.test(row.tax_rate)) {
        let a = this.accMul(row.no_unit_price, row.det_quantity);
        let b = 1 + row.tax_rate * 0.01;

        newData[index].amount_tax = this.toFixed(this.accMul(a, b), 2);
      }
    }

    this.setState({
      dataSource: newData,
    });

    // console.log('sss', newarr2);
    console.log(newData);
    // 含税金额合计;
    const newarr1 = [...this.state.dataSource];
    let newarr2 = [];

    newarr2 = newarr1.filter(item => {
      if (item.amount_tax) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.amount_tax;
    });
    console.log('taxed', newarr2);
    this.setState({
      Inputmoney1: newarr2.reduce(fpAdd,0).toFixed(2),
    });
    // 不含税金额合计;
    const newarr3 = [...this.state.dataSource];
    let newarr4 = [];

    newarr4 = newarr3.filter(item => {
      if (item.no_amount_tax) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.no_amount_tax;
    });

    this.setState({
      Inputmoney2: newarr4.reduce(fpAdd,0).toFixed(2),
    });
  },

  asyncSetFieldProps(vlauedata, typename) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestCunField = form.getFieldInstance('TestCun');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = TestCunField.getProp('id');
    // const value = TestCunfield.getExtendValue();
    const value = '1';

    // const extendValue = TestCunField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestCun',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestCun'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        if (typename == '1') {
          let newarr;
          //   表格数据
          try {
            newarr = JSON.parse(res.dataList[0].value).data;
            newarr.forEach((e, i) => {
              if (e['wz_number']) {
                e['det_quantity'] = e['wz_number'];
                newarr[i] = e;
              }
            });
          } catch (e) {}

          this.setState({
            listchData: [...newarr],
            current_pagech: JSON.parse(res.dataList[0].value).page,
            totalch2: JSON.parse(res.dataList[0].value).count,
          });
        } else {
          let newarr;
          //   表格数据
          try {
            newarr = JSON.parse(res.dataList[0].value).data;
            newarr.forEach((e, i) => {
              if (e['wz_number']) {
                e['det_quantity'] = e['wz_number'];
                newarr[i] = e;
              }
            });
          } catch (e) {}
           this.setState({
            listData: [...newarr],
            current_page: JSON.parse(res.dataList[0].value).page,
            total2: JSON.parse(res.dataList[0].value).count,
          });
          //   树状图数据
          const newtarr = JSON.parse(res.dataList[0].extendValue);
          const newtarr1 = [
            {
              title: '物资类型',
              key: '0',
              children: newtarr,
            },
          ];
          this.setState({
            treeData: [...newtarr1],
          });
          const dstatus = this.state.dstatus;
          if (dstatus === '2') {
            const newssarr = [...newarr];
            this.setState({
              treelistData: newssarr,
            });
            // 含税金额合计;

            let newarr2 = [];

            newarr2 = newssarr.filter(item => {
              if (item.amount_tax) {
                return item;
              }
            });
            newarr2 = newarr2.map(item => {
              return item.amount_tax;
            });

            this.setState({
              Inputmoney1: eval(newarr2.join('+')).toFixed(2),
            });
            // 不含税金额合计;

            let newarr4 = [];

            newarr4 = newssarr.filter(item => {
              if (item.no_amount_tax) {
                return item;
              }
            });
            newarr4 = newarr4.map(item => {
              return item.no_amount_tax;
            });

            this.setState({
              Inputmoney2: eval(newarr4.join('+')).toFixed(2),
            });
          } else if (dstatus === '1') {
            this.setState({
              listData: [...newarr],
              current_page: JSON.parse(res.dataList[0].value).page,
              total2: JSON.parse(res.dataList[0].value).count,
            });
          } else if (dstatus === '3') {
            // 含税金额合计;
            const newssarr = [...newarr];
            this.setState({
              dataSource: [...newarr],
            });
            let newarr2 = [];

            newarr2 = newssarr.filter(item => {
              if (item.amount_tax) {
                return item;
              }
            });
            newarr2 = newarr2.map(item => {
              return item.amount_tax;
            });

            this.setState({
              Inputmoney1: eval(newarr2.join('+')).toFixed(2),
            });
            // 不含税金额合计;

            let newarr4 = [];

            newarr4 = newssarr.filter(item => {
              if (item.no_amount_tax) {
                return item;
              }
            });
            newarr4 = newarr4.map(item => {
              return item.no_amount_tax;
            });

            this.setState({
              Inputmoney2: eval(newarr4.join('+')).toFixed(2),
            });
          }

          if (this.state.msgdata == '1') {
            notification.open({
              message: JSON.parse(res.dataList[0].value).msg,
            });
            this.setState({
              msgdata: '0',
            });
          }
          // console.log(JSON.parse(newarr));
          // console.log(this.state.listData);
        }
      });
  },
  rowClickch(this, record, rowkey) {
    const { form } = this.props;
    console.log(record);

    // const newvalue = this.state.allData;
    // newvalue.ck_name = record.name;
    // newvalue.type = 0;
    // newvalue.page = 1;

    // this.asyncSetFieldProps(newvalue);
    if (this.state.Housetype === 'out') {
      this.setState({
        Inputvalue: record.name,
        ischModalVisible: false,
      });
    } else if (this.state.Housetype === 'in') {
      this.setState({
        Inputvaluein: record.name,
        ischModalVisible: false,
      });
    }
  },
  rowClick(this, record, rowkey) {
    const { form } = this.props;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(
      item => this.state.currentEditId === item.key,
    );
    const currentKey = newData[index].key;
    newData[index] = record;
    newData[index].key = currentKey;
    // this.setState({ dataSource: newData });
    // this.setState({ isModalVisible: false });

    this.setState({ dataSource: newData, isModalVisible: false }, () => {
      form.setFieldValue('TestCun', record);
      form.setFieldExtendValue('TestCun', record);
    });
  },
  handleOkch() {
    // const newData = [...this.state.dataSource];
    // const cData = [...this.state.currentSelectData];
    // let lData = [];
    // if (cData.length > 0) {
    //   cData.forEach(element => {
    //     newData.push(element);
    //   });
    // }
    // lData = this.unique(newData);
    // console.log('pp+' + JSON.stringify(lData));
    // this.setState({ dataSource: lData });
    // this.setState({ isModalVisible: false });
    // this.setState({ selectedRowKeys: [] });
  },
  handleOk() {
    const newData = [...this.state.dataSource];
    const cData = [...this.state.currentSelectData];
    let lData = [];
    if (cData.length > 0) {
      cData.forEach(element => {
        newData.push(element);
      });
    }
    lData = this.unique(newData);
    console.log('pp+' + JSON.stringify(lData));
    this.setState({ dataSource: lData });
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  dupRemoval(arr) {
    //arr是传入的数组
    var nn = [...arr];
    let obj = {};
    let peon = nn.reduce((cur, next) => {
      //根据 属性scac + 属性disPlayName 判断去重
      obj[next.name + next.unit + next.size]
        ? ''
        : (obj[next.name + next.unit + next.size] = true && cur.push(next));
      return cur;
    }, []); //设置cur默认类型为数组，并且初始值为空的数组
    console.log(peon);
    return peon;
  },
  unique(arr) {
    const res = new Map();
    return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');
      let editData = {
        hanmoney: 0,
        nomoney: 0,
        warehouse: '',
        warehousein: '',
        detailedData: [], //物资明细
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = Number(this.state.Inputmoney1);
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = Number(this.state.Inputmoney2);
      }
      editData.warehouse = this.state.Inputvalue;
      editData.warehousein = this.state.Inputvaluein;
      editData.detailedData = this.state.dataSource;
      // 打印数据
      let newlistdata = this.state.dataSource;
      let str2 =
        '调出仓库：' +
        this.state.Inputvalue +
        '\n' +
        '调入仓库' +
        this.state.Inputvaluein;
      let str0 =
        '\n' +
        '设备名称 单位 规格型号 调拨数量 库存数量 不含税单价 含税单价 税率 税额 不含税金额 含税金额';
      let str1 =
        '\n' +
        '不含税金额合计(元):' +
        this.state.Inputmoney2 +
        '\n' +
        '含税金额合计(元):' +
        this.state.Inputmoney1;
      for (let i = 0; i < newlistdata.length; i++) {
        str0 +=
          '\n' +
          newlistdata[i].name +
          ' ' +
          newlistdata[i].unit +
          ' ' +
          newlistdata[i].size +
          ' ' +
          newlistdata[i].wz_number +
          ' ' +
          newlistdata[i].ku_cun +
          ' ' +
          newlistdata[i].no_unit_price +
          ' ' +
          newlistdata[i].unit_price +
          ' ' +
          newlistdata[i].tax_rate +
          ' ' +
          newlistdata[i].tax_amount +
          ' ' +
          newlistdata[i].no_amount_tax +
          ' ' +
          newlistdata[i].amount_tax;
      }
      let str = str2 + str0 + str1;
      console.log(str);
      const { form } = this.props;
      form.setFieldValue('TestCun', str);
      form.setFieldExtendValue('TestCun', editData);
    }
  },
  fieldRender() {
    const { form } = this.props;
    const field = form.getFieldInstance('TestCun');
    const label = form.getFieldProp('TestCun', 'label');
    const placeholder = form.getFieldProp('TestCun', 'placeholder');
    const required = form.getFieldProp('TestCun', 'required');
    const { dataSource, selectedRowKeys } = this.state;
    // const treeData = [
    //   {
    //     title: 'parent 0',
    //     key: '0-0',
    //     children: [
    //       { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
    //       { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    //     ],
    //   },
    //   {
    //     title: 'parent 1',
    //     key: '0-1',
    //     children: [
    //       { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
    //       { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    //     ],
    //   },
    // ];
    const deColumns = [
      {
        title: '物资名称',
        dataIndex: 'name',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.name}>
            <span>{record.name}</span>
          </Tooltip>
        ),
      },
      {
        title: '规格型号',
        dataIndex: 'size',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.size}>
            <span>{record.size}</span>
          </Tooltip>
        ),
      },
      {
        title: '单位',
        dataIndex: 'unit',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.unit}>
            <span>{record.unit}</span>
          </Tooltip>
        ),
      },

      {
        title: '调拨数量',
        dataIndex: 'wz_number',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.wz_number}>
            <span>{record.wz_number}</span>
          </Tooltip>
        ),
      },
      {
        title: '库存数量',
        dataIndex: 'ku_cun',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.ku_cun}>
            <span>{record.ku_cun}</span>
          </Tooltip>
        ),
      },
      {
        title: '不含税单价(元)',
        dataIndex: 'no_unit_price',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.no_unit_price}>
            <span>{record.no_unit_price}</span>
          </Tooltip>
        ),
      },
      {
        title: '含税单价(元)',
        dataIndex: 'unit_price',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.unit_price}>
            <span>{record.unit_price}</span>
          </Tooltip>
        ),
      },
      {
        title: '税率(%)',
        dataIndex: 'tax_rate',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.tax_rate}>
            <span>{record.tax_rate}</span>
          </Tooltip>
        ),
      },

      {
        title: '税额',
        dataIndex: 'tax_amount',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.tax_amount}>
            <span>{record.tax_amount}</span>
          </Tooltip>
        ),
      },
      {
        title: '不含税金额(元)',
        dataIndex: 'no_amount_tax',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.no_amount_tax}>
            <span>{record.no_amount_tax}</span>
          </Tooltip>
        ),
      },
      {
        title: '含税金额(元)',
        dataIndex: 'amount_tax',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.amount_tax}>
            <span>{record.amount_tax}</span>
          </Tooltip>
        ),
      },
    ];
    const etColumns = [
      {
        title: '物资名称',
        dataIndex: 'name',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.name}>
            <span>{record.name}</span>
          </Tooltip>
        ),
      },
      {
        title: '单位',
        dataIndex: 'unit',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.unit}>
            <span>{record.unit}</span>
          </Tooltip>
        ),
      },
      {
        title: '规格型号',
        dataIndex: 'size',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.size}>
            <span>{record.size}</span>
          </Tooltip>
        ),
      },
      {
        title: (
          <div>
            不含税单价(元)
            <Tooltip
              placement="top"
              title={
                <div>
                  <span>
                    含税单价=不含税单价*（1+税率）,含税单价/不含税单价二选一填入
                  </span>
                </div>
              }
            >
              　<QuestionCircleOutlined />　
              {/* <a-icon type="info-circle" /> */}
            </Tooltip>
          </div>
        ),
        dataIndex: 'no_unit_price',
        editable: true,
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.no_unit_price}>
            <span>{record.no_unit_price}</span>
          </Tooltip>
        ),
      },
      {
        // title: '含税单价(元)',
        title: (
          <div>
            含税单价(元)
            <Tooltip
              placement="top"
              title={
                <div>
                  <span>
                    含税单价=不含税单价*（1+税率）,含税单价/不含税单价二选一填入
                  </span>
                </div>
              }
            >
              　<QuestionCircleOutlined />　
              {/* <a-icon type="info-circle" /> */}
            </Tooltip>
          </div>
        ),
        dataIndex: 'unit_price',
        editable: true,
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.unit_price}>
            <span>{record.unit_price}</span>
          </Tooltip>
        ),
      },
      {
        title: '税率(%)',
        dataIndex: 'tax_rate',
        editable: true,
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.tax_rate}>
            <span>{record.tax_rate}</span>
          </Tooltip>
        ),
      },

      {
        title: '税额(元)',
        dataIndex: 'tax_amount',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.tax_amount}>
            <span>{record.tax_amount}</span>
          </Tooltip>
        ),
      },
      {
        title: '不含税金额(元)',
        dataIndex: 'no_amount_tax',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.no_amount_tax}>
            <span>{record.no_amount_tax}</span>
          </Tooltip>
        ),
      },
      {
        title: '含税金额(元)',
        dataIndex: 'amount_tax',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.amount_tax}>
            <span>{record.amount_tax}</span>
          </Tooltip>
        ),
      },

      {
        title: '调拨数量',
        dataIndex: 'wz_number',
        editable: true,
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.wz_number}>
            <span>{record.wz_number}</span>
          </Tooltip>
        ),
      },
      {
        title: '库存数量',
        dataIndex: 'ku_cun',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.ku_cun}>
            <span>{record.ku_cun}</span>
          </Tooltip>
        ),
      },

      {
        title: '操作',
        dataIndex: 'operation',

        render: (_, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              cancelText="取消"
              okText="确定"
              title="确定删除?"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = etColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          handleChange: this.handleChange,
        }),
      };
    });

    const onSelect = (keys: React.Key[], info: any) => {
      console.log('Trigger Select', keys, info);
      const treedata = { type: keys[0], number: '10', page: '1', isHouse: '2' };
      this.setState({
        allData: treedata,
      });
      this.asyncSetFieldProps(treedata, '2');
    };

    const onExpand = () => {
      console.log('Trigger Expand');
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   'selectedRows: ',
        //   selectedRows,
        // );
        let newData = [...selectedRows];
        if (newData.length > 0) {
          newData = newData.map(item => {
            return Object.assign(item, {
              num: 1,
            });
          });
        }
        console.log('======' + JSON.stringify(newData));
        this.setState({ currentSelectData: newData });
        this.setState({ selectedRowKeys });
      },
    };
    let Options = this.state.newOptine.map(station => (
      <Option key={station.key} value={station.title}>
        {station.title}
      </Option>
    ));
    const onFinish = (values: any) => {
      this.setState({
        msgdata: '1',
      });
      console.log('Success:', values);
      //   const [form] = Form.useForm();
      const newdate = this.state.allData;
      newdate.wz_add = values;
      newdate.isHouse = '2';
      this.asyncSetFieldProps(newdate, '2');
      this.setState({
        visibleModal: false,
      });

      //   form.resetFields();
    };
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const onChangetree = value => {
      console.log(value);
      this.setState({ value });
    };
    //详情
    if (this.props.runtimeProps.viewMode) {
      let value = field.getExtendValue() || {};
      if (!value.detailedData) {
        value = field.getValue();
      }
      const { warehouse = '', warehousein = '', detailedData = [] } = value;
      return (
        <div className="field-wrapper">
          <div style={{ marginTop: '10px' }} className="label">
            调出仓库
          </div>
          <div style={{ marginTop: '10px' }}>{warehouse}</div>
          <div style={{ marginTop: '10px' }} className="label">
            调入仓库
          </div>
          <div style={{ marginTop: '10px' }}>{warehousein}</div>

          <div style={{ marginTop: '10px' }} className="label">
            物资明细
          </div>

          {/* <div>
            {detailedData.map(item => {
              return <div>{item.toString()}</div>;
            })}
          </div> */}
          <div style={{ marginTop: '10px' }}>
            <Table
              scroll={{ x: '1500px' }}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={value instanceof Array ? value : detailedData}
              columns={deColumns}
              pagination={false}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="TestCunField_class">
        <div className="pc-custom-field-wrap">
          <div className="label">
            {required ? (
              <span style={{ color: '#ea6d5c' }}>*</span>
            ) : (
              <span style={{ color: '#fff' }}>*</span>
            )}
            调出仓库
          </div>
          <div>
            <Input
              readOnly
              value={this.state.Inputvalue}
              onClick={this.chhandleAdd.bind(this, 'out')}
              placeholder="请选择库房"
              suffix={
                <CloseCircleOutlined
                  onClick={this.iconClick.bind(this, 'out')}
                  style={{ color: 'rgba(0,0,0,.45)' }}
                />
              }
            />
          </div>
          <div className="label" style={{ marginTop: 10 }}>
            调入仓库
          </div>
          <div>
            <Input
              readOnly
              value={this.state.Inputvaluein}
              onClick={this.chhandleAdd.bind(this, 'in')}
              placeholder="请选择库房"
              suffix={
                <CloseCircleOutlined
                  onClick={this.iconClick.bind(this, 'in')}
                  style={{ color: 'rgba(0,0,0,.45)' }}
                />
              }
            />
          </div>
          <Modal
            title="选择库房"
            width={1000}
            className="limited-height"
            visible={this.state.ischModalVisible}
            footer={[
              <Button key="back" onClick={this.handleCancelch}>
                返回
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={this.handleOkch}
              >
                确定
              </Button>,
            ]}
            onCancel={this.handleCancelch}
          >
            <Search
              placeholder="请输入"
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={this.onSearchch}
            />
            <Table
              scroll={{ x: '1500px', y: '255px' }}
              onRow={record => {
                return {
                  onClick: this.rowClickch.bind(this, record),
                };
              }}
              rowKey={record => record.id}
              columns={mychcolumns}
              dataSource={this.state.listchData}
              loading={this.state.loading}
              pagination={false}
            ></Table>
            <Pagination
              defaultCurrent={1}
              total={this.state.totalch2}
              hideOnSinglePage={true}
              className="pagination"
              onChange={this.onChangepage}
            />
          </Modal>
          <div style={{ marginTop: 10 }} className="label">
            出库明细
          </div>

          <div>
            <Table
              scroll={{ x: '1500px' }}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns as ColumnTypes}
              pagination={false}
            />
            <Button
              onClick={this.handleAdd}
              type="primary"
              style={{ marginBottom: 16, marginTop: 16 }}
            >
              添加明细
            </Button>
            <div className="label" style={{ marginTop: '10px' }}>
              不含税金额合计(元)
            </div>
            <div>
              <Input
                readOnly
                value={this.state.Inputmoney2}
                placeholder="自动计算"
              />
            </div>
            <div className="label" style={{ marginTop: '10px' }}>
              含税金额合计(元)
            </div>
            <div>
              <Input
                readOnly
                value={this.state.Inputmoney1}
                placeholder="自动计算"
              />
            </div>
          </div>

          <Modal
            title="选择物品"
            className="limited-height"
            width={1000}
            visible={this.state.isModalVisible}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                返回
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={this.handleOk}
              >
                确定
              </Button>,
            ]}
            onCancel={this.handleCancel}
          >
            <Layout>
              <Sider className="newside_new">
                <Tree
                  defaultExpandedKeys={['0']}
                  blockNode
                  onSelect={onSelect}
                  onExpand={onExpand}
                  treeData={this.state.treeData}
                />
              </Sider>
              <Content>
                <div className="header_tab_class">
                  <Search
                    placeholder="请输入"
                    allowClear
                    enterButton="搜索"
                    size="large"
                    onSearch={this.onSearch}
                  />
                  <Button onClick={this.newAdd} size="large" type="primary">
                    新增
                  </Button>
                </div>
                <Table
                  scroll={{ x: '1500px', y: '255px' }}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  rowKey={record => record.id}
                  columns={mycolumns}
                  dataSource={this.state.listData}
                  loading={this.state.loading}
                  pagination={false}
                ></Table>
                <Pagination
                  defaultCurrent={1}
                  total={this.state.total2}
                  hideOnSinglePage={true}
                  className="pagination"
                  onChange={this.onChangepage}
                />
              </Content>
            </Layout>
          </Modal>
          {/* 新增个 */}
          <Modal
            className="newModal_class"
            onCancel={this.handlenewCancel}
            visible={this.state.visibleModal}
            width={1000}
            title="新增"
          >
            <Form
              initialValues={{ remember: true }}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="物品名称"
                name="name"
                rules={[{ required: true, message: '请填写单位名称' }]}
              >
                <Input placeholder="请填写单位名称" />
              </Form.Item>
              <Form.Item
                label="单位"
                name="unit"
                rules={[{ required: true, message: '请填写单位名称' }]}
              >
                <Input placeholder="请填写单位名称" />
              </Form.Item>
              <Form.Item
                label="规格型号"
                name="size"
                rules={[{ required: true, message: '请填写单位名称' }]}
              >
                <Input placeholder="请填写单位名称" />
              </Form.Item>
              <Form.Item
                label="物品类型"
                name="type"
                rules={[{ required: true, message: '请填写单位名称' }]}
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeData}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={onChangetree}
                />
              </Form.Item>

              <Form.Item className="newForm">
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
                <Button type="primary" onClick={this.handlenewCancel}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  },
};

export default FormField;
