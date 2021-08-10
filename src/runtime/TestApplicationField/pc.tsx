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
//     form.setFieldValue('TestApplication', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('TestApplication');
//     const label = form.getFieldProp('TestApplication', 'label');
//     const placeholder = form.getFieldProp('TestApplication', 'placeholders');

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
  Tabs,
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
const { TabPane } = Tabs;

import './pc.less';
const mycolumns = [
  {
    title: '名称',
    dataIndex: 'name',
    render: (_, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <span>{record.name}</span>
      </Tooltip>
    ),
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
  },
];
const mycolumnstree = [
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
    dataIndex: 'refer_price',
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
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 不能为空`,
          },
        ]}
      >
        {/*    */}
        {/*   */}
        {/* <Input ref={inputRef} /> */}

        <InputNumber
          className="editable-cell-value-inputNumber"
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          min={0}
          step="0.001"
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
      detdate: 'a1',
      dstatus: '1',
      detailname: '',
      Inputmoney2: '',
      Inputmoney1: '',
      current_page: '', //当前页
      total2: '',
      allData: {
        rk_id: ['a'],
        number: '10',
        page: '1',
        name: '',
      },
      isModalVisible: false,
      isModalVisibletree: false,
      listData: [],

      treeData: [
        {
          title: 'parent 0',
          key: '0-0',
          children: [
            { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
            { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
          ],
        },
        {
          title: 'parent 1',
          key: '0-1',
          children: [
            { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
            { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
          ],
        },
      ],
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
      currentSelectDataid: [],
      selectedRowKeys: [],
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    // const newdate = this.state.allData;
    // this.asyncSetFieldProps(newdate);
  },
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
  onSearch(value) {
    console.log(value);
    const newvalue = this.state.allData;
    newvalue.name = value;

    newvalue.page = 1;
    newvalue.rk_id = [];
    this.setState({
      allData: newvalue,
    });
    this.asyncSetFieldProps(newvalue);
  },
  onChangepage(page) {
    const newpage = this.state.allData;
    newpage.page = page;
    console.log(newpage);
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage);
    // this.getData(page);
    // this.setState({
    //   loading: true,
    // });
  },
  onChangepagetree(page) {
    const newpage = this.state.allData;
    newpage.page = page;
    newpage.rk_id = ['-1'];
    console.log(newpage);
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage);
    // this.getData(page);
    // this.setState({
    //   loading: true,
    // });
  },
  handleChange(row: DataType) {
    // const inputRef = useRef<Input>(null);
    // const { form } = this.props;
    // form.setFieldValue('TestApplication', e.target.value);
    // document.getElementsByClassName('ptID').blur();
    // inputRef.current!.focus();
    this.setState({ currentEditId: row.key });
    // this.setState({ isModalVisible: true });
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleCanceltree() {
    this.setState({ isModalVisibletree: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleDelete(row) {
    const dataSource = [...this.state.dataSource];
    console.log(row);
    if (row.subtotal) {
      const newvalue = this.state.Inputmoney1;
      this.setState({
        Inputmoney1: (newvalue - row.subtotal).toFixed(2),
      });
      console.log('ssks');
    }
    if (row.nosubtotal) {
      const newvalue2 = this.state.Inputmoney2;
      this.setState({
        Inputmoney2: (newvalue2 - row.nosubtotal).toFixed(2),
      });
      console.log('ssks');
    }
    this.setState({
      dataSource: dataSource.filter(item => item.id !== row.id),
    });
  },
  newhandleAdd() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    if (!Pro_name) {
      return notification.open({
        message: '请先选择项目',
      });
    }
    this.setState({ dstatus: '1' });
    let newpage = {
      rk_id: ['a'],
      number: '10',
      page: 1,
      name: '',
    };
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage);
    this.setState({
      isModalVisible: true,
    });
  },
  handleAdd() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    if (!Pro_name) {
      return notification.open({
        message: '请先选择项目',
      });
    }
    this.setState({ dstatus: '2' });
    console.log(this.state.allData);
    let newpage = {
      rk_id: ['-1'],
      number: '10',
      page: 1,
      name: '',
    };

    this.asyncSetFieldProps(newpage);
    this.setState({
      isModalVisibletree: true,
    });
  },
  handleSave(row: DataType) {
    const { form } = this.props;
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if (row.need_quantity) {
      newData[index].subtotal = row.need_quantity * row.refer_price;
    }
    if (row.tax_rate) {
      newData[index].norefer_price = (
        row.subtotal *
        row.tax_rate *
        0.01
      ).toFixed(2);
      newData[index].nosubtotal = (
        row.subtotal *
        (100 - row.tax_rate) *
        0.01
      ).toFixed(2);
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
      if (item.subtotal) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.subtotal;
    });

    this.setState({
      Inputmoney1: eval(newarr2.join('+')),
    });
    // 不含税金额合计;
    const newarr3 = [...this.state.dataSource];
    let newarr4 = [];

    newarr4 = newarr3.filter(item => {
      if (item.nosubtotal) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.nosubtotal;
    });

    this.setState({
      Inputmoney2: eval(newarr4.join('+')),
    });

    // if (this.state.Inputmoney2) {
    //   console.log('saadasdasdas', this.state.Inputmoney2);
    //   form.setFieldValue('TestApplication', newData);
    //   form.setExtendFieldValue('TestApplication', {
    //     data: newData,
    //   });
    // }

    // this.setState({ dataSource: newData, isModalVisible: false }, () => {
    //   form.setFieldValue('TestApplication', newData);
    //   form.setExtendFieldValue('TestApplication', {
    //     data: newData,
    //   });
    // });

    console.log('sss', eval(newarr3.join('+')));
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

  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    vlauedata.project_name = Pro_name;
    const TestApplicationField = form.getFieldInstance('TestApplication');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = TestApplicationField.getProp('id');
    // const value = TestApplicationField.getValue();
    const value = '1';

    // const extendValue = TestApplicationField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestApplication',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestApplication'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log(JSON.parse(res.dataList[0].value));

        // this.state.listData = find(
        //   res.dataList,
        //   item => item.bizAlias === 'TestApplication',
        // );

        // this.state.listData = res.dataList[0].value;

        // this.setState({
        //   listData: res.dataList[0].value,
        // });
        //   表格数据
        const newarr = JSON.parse(res.dataList[0].value).data;
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
          current_page: JSON.parse(res.dataList[0].value).page,
          total3: JSON.parse(res.dataList[0].value).count,
        });
        const checked = this.state.currentSelectDataid;
        const dstatus = this.state.dstatus;
        if (dstatus === '2') {
          const newssarr = [...newarr];
          this.setState({
            treelistData: newssarr,
          });
          // 含税金额合计;

          let newarr2 = [];

          newarr2 = newssarr.filter(item => {
            if (item.subtotal) {
              return item;
            }
          });
          newarr2 = newarr2.map(item => {
            return item.subtotal;
          });

          this.setState({
            Inputmoney1: eval(newarr2.join('+')),
          });
          // 不含税金额合计;

          let newarr4 = [];

          newarr4 = newssarr.filter(item => {
            if (item.nosubtotal) {
              return item;
            }
          });
          newarr4 = newarr4.map(item => {
            return item.nosubtotal;
          });

          this.setState({
            Inputmoney2: eval(newarr4.join('+')),
          });
        } else if (dstatus === '1') {
          this.setState({
            listData: [...newarr],
            current_page: JSON.parse(res.dataList[0].value).page,
            total2: JSON.parse(res.dataList[0].value).count,
          });
        } else if (dstatus === '3') {
          this.setState({
            dataSource: [...newarr],
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
      });
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
      form.setFieldValue('TestApplication', record);
      form.setExtendFieldValue('TestApplication', {
        record: record,
        Inputmoney1: this.state.Inputmoney1,
        Inputmoney2: this.state.Inputmoney2,
      });
    });
  },
  handleOktree() {
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
    this.setState({ isModalVisibletree: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleOk() {
    this.setState({ dstatus: '3' });
    console.log(this.state.detdate);
    const cDataid = [...this.state.currentSelectDataid];
    const newdate = this.state.allData;
    newdate.rk_id = [this.state.detdate, ...cDataid];
    console.log(newdate);

    this.asyncSetFieldProps(newdate);

    this.setState({
      isModalVisible: false,
    });
    this.setState({ selectedRowKeys: [] });
  },
  unique(arr) {
    const res = new Map();
    return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
  },
  fieldDidUpdate() {
    console.log(
      'uihsiuahfiausfaihiu',
      this.state.Inputmoney1,
      this.state.Inputmoney2,
    );

    let editData = {
      hanmoney: '',
      nomoney: '',
      detailname: '',
      detailedData: [], //物资明细
    };
    if (this.state.Inputmoney1) {
      editData.hanmoney = this.state.Inputmoney1;
    }
    if (this.state.Inputmoney2) {
      editData.nomoney = this.state.Inputmoney2;
    }
    editData.detailname = this.state.detailname;
    editData.detailedData = this.state.dataSource;
    const { form } = this.props;
    form.setFieldValue('TestApplication', editData);
    form.setExtendFieldValue('TestApplication', {
      data: editData,
    });

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    const { form } = this.props;
    const field = form.getFieldInstance('TestApplication');
    const label = form.getFieldProp('TestApplication', 'label');
    const placeholder = form.getFieldProp('TestApplication', 'placeholder');

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
      },
      {
        title: '单位',
        dataIndex: 'unit',
      },
      {
        title: '规格型号',
        dataIndex: 'size',
      },
      {
        title: '总计划量',
        dataIndex: 'zh_plan_quantity',
      },
      {
        title: '需用数量',
        dataIndex: 'need_quantity',
        editable: true,
      },
      {
        title: '参考价格',
        dataIndex: 'refer_price',
        editable: true,
      },

      {
        title: '小计',
        dataIndex: 'subtotal',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    const etColumns = [
      {
        title: '物资名称',
        dataIndex: 'name',
        width: 100,
        key: 'name',
        fixed: 'left',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 100,
        key: 'unit',
        fixed: 'left',
      },
      {
        title: '规格型号',
        dataIndex: 'size',
        width: 100,
        key: 'size',
        fixed: 'left',
      },
      {
        title: '总计划量',
        dataIndex: 'zh_plan_quantity',
      },
      {
        title: '需用数量',
        dataIndex: 'need_quantity',
        editable: true,
      },
      {
        title: '参考价格',
        dataIndex: 'refer_price',
        editable: true,
      },

      {
        title: '小计',
        dataIndex: 'subtotal',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (_, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
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
      const treedata = {
        type: keys[0],
        number: '10',
        page: '1',
        rk_id: ['-1'],
      };
      this.setState({
        allData: treedata,
      });
      this.asyncSetFieldProps(treedata);
    };

    const onExpand = () => {
      console.log('Trigger Expand');
    };
    // const Tabschange = key => {
    //   console.log(key);

    //   let newpage = {
    //     rk_id: [key],
    //     number: '10',
    //     page: 1,
    //     name: '',
    //   };
    //   this.setState({
    //     allData: newpage,
    //     detdate: key + '1',
    //   });
    //   this.asyncSetFieldProps(newpage);
    // };
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   'selectedRows: ',
        //   selectedRows,
        // );
        let dtar = '';
        let newData = [...selectedRows];
        let newDataid = [];
        if (newData.length > 0) {
          newData = newData.map(item => {
            return Object.assign(item, {
              num: 1,
            });
          });
          newDataid = newData.map(item => {
            return item.id;
          });
        }
        console.log('======' + JSON.stringify(newDataid));
        if (this.state.detdate === 'a1') {
          dtar = '采购申请-' + newData[0].name;
        } else {
          dtar = '采购订单-' + newData[0].name;
        }

        this.setState({
          currentSelectData: newData,
          currentSelectDataid: newDataid,
          detailname: dtar,
        });
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
      this.asyncSetFieldProps(newdate);
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
      const { detailname = '', detailedData = [] } = value;
      return (
        <div>
          <div className="label">名称</div>
          <div>{detailname}</div>

          <div className="label">物资明细</div>

          {/* <div>
            {detailedData.map(item => {
              return <div>{item.toString()}</div>;
            })}
          </div> */}
          <div>
            <Table
              scroll={{ x: '50vw' }}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={detailedData}
              columns={deColumns}
              pagination={false}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="pc-custom-field-wrap">
        <div>
          <div className="label">{label}</div>
          <Input
            onClick={this.newhandleAdd}
            readOnly
            value={this.state.detailname}
            placeholder="请选择"
          />
        </div>
        {/* <div className="label">{label}</div> */}
        {/* {field.getProp('viewMode') ? (
          field.getValue()
            ) :
                (
          <Input
            id="ptID"
            placeholder={placeholder}
            onFocus={this.handleChange}
            value={this.state.leaveLongVal}
          />
        )} */}
        {/* {field?.props?.viewMode ? (
          field.getValue()
        ) : (
          <Input placeholder={placeholder} onChange={this.handleChange} />
        )} */}
        <div>
          <Table
            scroll={{ x: '50vw' }}
            scroll={{ x: 1300 }}
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

          <div className="label">含税金额合计</div>
          <div>
            <Input
              readOnly
              value={this.state.Inputmoney1}
              placeholder="含税金额合计"
            />
          </div>
        </div>

        <Modal
          title="关联"
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
          {/* <Tabs defaultActiveKey="a" centered onChange={Tabschange}>
            <TabPane tab="采购合同" key="a"></TabPane>
            <TabPane tab="采购订单" key="b"></TabPane>
          </Tabs> */}

          <Search
            placeholder="请输入物品名称"
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={this.onSearch}
          />
          <Table
            scroll={{ x: '50vw' }}
            rowSelection={{
              type: 'radio',
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
        </Modal>
        {/* 树形 */}

        <Modal
          title="选择物资"
          width={1000}
          visible={this.state.isModalVisibletree}
          footer={[
            <Button key="back" onClick={this.handleCanceltree}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.handleOktree}
            >
              确定
            </Button>,
          ]}
          onCancel={this.handleCanceltree}
        >
          <Layout>
            <Sider>
              <Tree
                defaultExpandedKeys={['0']}
                blockNode
                onSelect={onSelect}
                onExpand={onExpand}
                treeData={this.state.treeData}
              />
            </Sider>
            <Content>
              <div className="header_tab">
                <Search
                  placeholder="请输入名称"
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
                scroll={{ x: '50vw' }}
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                rowKey={record => record.id}
                columns={mycolumnstree}
                dataSource={this.state.treelistData}
                loading={this.state.loading}
                pagination={false}
              ></Table>
              <Pagination
                defaultCurrent={1}
                total={this.state.total3}
                hideOnSinglePage={true}
                className="pagination"
                onChange={this.onChangepagetree}
              />
            </Content>
          </Layout>
        </Modal>
        {/* 新增个 */}
        <Modal
          className="newModal"
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
    );
  },
};

export default FormField;