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
//           field.getValue()
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
  handleSave: (record: Item) => void;
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
  const inputRef = useRef<Input>(null);
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
      handleSave({ ...record, ...values });
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
    // const inputRef = useRef<Input>(null);
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
  //   handleDelete(row) {
  //     const dataSource = [...this.state.dataSource];
  //     console.log(row);
  //     if (row.tax_money) {
  //       const newvalue = this.state.Inputmoney1;
  //       this.setState({
  //         Inputmoney1: (newvalue - row.tax_money).toFixed(2),
  //       });
  //       console.log('ssks');
  //     }
  //     if (row.notax_money) {
  //       const newvalue2 = this.state.Inputmoney2;
  //       this.setState({
  //         Inputmoney2: (newvalue2 - row.notax_money).toFixed(2),
  //       });
  //       console.log('ssks');
  //     }
  //     this.setState({
  //       dataSource: dataSource.filter(item => item.id !== row.id),
  //     });
  //   },
  handleDelete(row) {
    const dataSource = [...this.state.dataSource];
    const arr = dataSource.filter(item => item.id !== row.id);
    this.setState({
      dataSource: arr,
    });
    //   含税金额
    let newarr2 = [];

    newarr2 = arr.filter(item => {
      if (item.tax_money) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.tax_money;
    });
    //不含税金额
    let newarr4 = [];

    newarr4 = arr.filter(item => {
      if (item.notax_money) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.notax_money;
    });

    this.setState({
      Inputmoney1: eval(newarr2.join('+')).toFixed(2),
      Inputmoney2: eval(newarr4.join('+')).toFixed(2),
    });
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
  handleSave(row: DataType) {
    const { form } = this.props;
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    this.setState({
      dataSource: newData,
    });

    // console.log('sss', newarr2);
    console.log(newData);
    // 含税金额合计;
    const newarr1 = [...this.state.dataSource];
    let newarr2 = [];

    newarr2 = newarr1.filter(item => {
      if (item.tax_money) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.tax_money;
    });

    this.setState({
      Inputmoney1: eval(newarr2.join('+')).toFixed(2),
    });
    // 不含税金额合计;
    const newarr3 = [...this.state.dataSource];
    let newarr4 = [];

    newarr4 = newarr3.filter(item => {
      if (item.notax_money) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.notax_money;
    });

    this.setState({
      Inputmoney2: eval(newarr4.join('+')).toFixed(2),
    });

    // if (this.state.Inputmoney2) {
    //   console.log('saadasdasdas', this.state.Inputmoney2);
    //   form.setFieldValue('TestCun', newData);
    //   form.setExtendFieldValue('TestCun', {
    //     data: newData,
    //   });
    // }

    // this.setState({ dataSource: newData, isModalVisible: false }, () => {
    //   form.setFieldValue('TestCun', newData);
    //   form.setExtendFieldValue('TestCun', {
    //     data: newData,
    //   });
    // });

    console.log('sss', eval(newarr3.join('+')).toFixed(2));
  },

  //   handleSave(row: DataType) {
  //     const newData = [...this.state.dataSource];
  //     const index = newData.findIndex(item => row.id === item.id);
  //     const item = newData[index];
  //     newData.splice(index, 1, {
  //       ...item,
  //       ...row,
  //     });
  //     console.log(newData);
  //     console.log(index);
  //     console.log(item);

  //     if (row.num2) {
  //       newData[index].num3 = row.num1 * row.num2;
  //     }

  //     this.setState({ dataSource: newData });
  //     },

  asyncSetFieldProps(vlauedata, typename) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestCunField = form.getFieldInstance('TestCun');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = TestCunField.getProp('id');
    // const value = TestCunField.getValue();
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
      form.setExtendFieldValue('TestCun', {
        record: record,
        Inputmoney1: this.state.Inputmoney1,
        Inputmoney2: this.state.Inputmoney2,
      });
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
        hanmoney: '',
        nomoney: '',
        warehouse: '',
        warehousein: '',
        detailedData: [], //物资明细
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = this.state.Inputmoney1;
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = this.state.Inputmoney2;
      }
      editData.warehouse = this.state.Inputvalue;
      editData.warehousein = this.state.Inputvaluein;
      editData.detailedData = this.state.dataSource;

      const { form } = this.props;
      form.setFieldValue('TestCun', editData);
      form.setExtendFieldValue('TestCun', {
        data: editData,
      });
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
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
      const value = field.getValue();
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
            />
          </div>
          <Modal
            title="选择库房"
            width={1000}
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
              scroll={{ x: '1500px' }}
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
          </div>

          <Modal
            title="选择物品"
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
                  scroll={{ x: '1500px' }}
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
