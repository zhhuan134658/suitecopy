import { Pagination } from 'antd';
import { Tree } from 'antd';
const { DirectoryTree } = Tree;
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  TreeSelect,
  Select,
  Table,
  Cascader,
  Tooltip,
  notification,
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
      newopin: [],
      maxnum: 0,
      Optionlist: [],
      petty_sele: '否',
      Numbervalue1: 0,
      Numbervalue2: '',
      Numbervalue3: '',
      Numbervalue5: '',
      isShow: false,
      value: undefined,
      msgdata: '',
      newOptine: [],
      visibleModal: false,
      Inputmoney2: '',
      Inputmoney1: '',
      current_page: '', //当前页
      total2: '',
      allData: {
        type: '0',
        number: '10',
        page: '1',
        name: '',
      },
      isModalVisible: false,
      listData: [],

      treeData: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },

      loading: false,
      leaveLongVal: '',

      //   dataSource: [],
      dataSource: [],
      count: 0,

      currentEditId: 0,
      currentSelectData: [],
      selectedRowKeys: [],
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {}, //新增
  SelectChange(value, record) {
    record.ke_name = value;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => record.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...record });

    this.setState({
      dataSource: newData,
    });
    console.log(value, record);
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
    newvalue.type = 0;
    newvalue.page = 1;
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
  onMouseEnter() {
    console.log('1234567890987654321234567');
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    if (!Pro_name) {
      return notification.open({
        duration: 2,
        message: '请先选择项目',
      });
    }
    const newopin = [
      { name: '是', id: '1' },
      { name: '否', id: '2' },
    ];
    this.setState({
      newopin: newopin,
    });
  },
  handleChange(value) {
    console.log(`selected ${value}`);
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');

    if (value === '1') {
      this.setState({
        isShow: true,
        petty_sele: '是',
      });
      const newdate = this.state.allData;
      newdate.rk_id = ['是'];

      this.asyncSetFieldProps(newdate, '11');
    } else {
      this.setState({
        isShow: false,
        petty_sele: '否',
      });
    }
    // if (!Pro_name) {
    //   return notification.open({
    //     message: '请先选择项目',
    //   });
    // }
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleDelete(row) {
    const dataSource = [...this.state.dataSource];
    console.log(row);

    this.setState({
      dataSource: dataSource.filter(item => item.key !== row.key),
    });

    if (row.money) {
      const newvalue = this.state.Inputmoney1;
      this.setState({
        Inputmoney1: (newvalue - row.money).toFixed(2),
      });
    }
  },

  handleAdd() {
    const newdate = this.state.allData;
    newdate.rk_id = ['a'];
    this.asyncSetFieldProps(newdate, '12');
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    // if (!Pro_name) {
    //   return notification.open({
    //     message: '请先选择项目',
    //   });
    // }
    const { count, dataSource } = this.state;
    const newData: DataType = {
      key: count,
      ke_name: '',
      money: '',
      remarks: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  },
  handleSave(row: DataType) {
    console.log('表格数据：', row);
    const { form } = this.props;
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.key === item.key);
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
      if (item.money) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.money;
    });
    const joindata = eval(newarr2.join('+')).toFixed(2);
    this.setState({
      Inputmoney1: joindata,
    });
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

  asyncSetFieldProps(vlauedata, type) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    // vlauedata.petty_sele = this.state.petty_sele;
    // vlauedata.petty_yu = this.state.Numbervalue1;
    // vlauedata.project_name = this.state.Numbervalue2;
    const TestExpeField = form.getFieldInstance('TestExpe');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = TestExpeField.getProp('id');
    // const value = TestExpeField.getValue();
    const value = '1';

    // const extendValue = TestExpeField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestExpe',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestExpe'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}

        // this.menusTree = menuId;

        if (type == '12') {
          this.setState({
            Optionlist: newarr,
          });
        } else if (type == '11') {
          this.setState({
            Numbervalue1: Number(newarr.sy),
            Numbervalue3: Number(newarr.fybx_dk_spz),
            Numbervalue4: Number(newarr.re_money_spz),
            maxnum:
              Number(newarr.sy) -
              Number(newarr.fybx_dk_spz) -
              Number(newarr.re_money_spz),
          });
        }
        // console.log(JSON.parse(newarr));
        // console.log(this.state.listData);
      });
  },
  onNumbervalue2Change(val) {
    console.log(val);
    const number1 = this.state.maxnum;
    const number2 = this.state.Inputmoney1; // 报销费用合计
    if (number1 > number2) {
      if (val > this.state.Inputmoney1) {
        const aa = this.state.Inputmoney1;
        const bb = Number(aa) - Number(this.state.maxnum);
        this.setState({
          Numbervalue2: this.state.Inputmoney1,
          Numbervalue5: bb.toFixed(2),
        });
      } else {
        const aa = this.state.Inputmoney1;
        const bb = aa - val;
        this.setState({
          Numbervalue2: val.toFixed(2),
          Numbervalue5: bb.toFixed(2),
        });
      }
    } else {
      if (val > this.state.maxnum) {
        const aa = this.state.Inputmoney1;
        const bb = aa - this.state.maxnum;
        this.setState({
          Numbervalue2: this.state.maxnum.toFixed(2),
          Numbervalue5: bb.toFixed(2),
        });
      } else {
        const aa = this.state.Inputmoney1;
        const bb = aa - val;
        this.setState({
          Numbervalue2: val.toFixed(2),
          Numbervalue5: bb.toFixed(2),
        });
      }
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
      form.setFieldValue('TestExpe', record);
      form.setExtendFieldValue('TestExpe', {
        record: record,
        Inputmoney1: this.state.Inputmoney1,
        Inputmoney2: this.state.Inputmoney2,
      });
    });
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
  //   onChangenum2(value) {
  //     console.log(value);
  //     const aaadata = this.state.Numbervalue1;
  //     this.setState({
  //       Numbervalue1: value,
  //       Numbervalue2: value - aaadata,
  //     });
  //   },
  onChangenum(value) {
    console.log(value);
    const aaadata = this.state.Inputmoney1;
    this.setState({
      Numbervalue1: value,
      Numbervalue2: (aaadata - value).toFixed(2),
    });
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');
      let editData = {
        hanmoney: 0,
        nomoney: 0,
        detailedData: [], //物资明细
        petty_sele: '', //备用金抵扣
        Numbervalue1: '', //备用金余额
        Numbervalue2: '', //本次抵扣金额
        Numbervalue3: '', //审批中的费用报销抵扣
        Numbervalue4: '', //审批中的归还
        Numbervalue5: '', //财务应支付金额
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = Number(this.state.Inputmoney1);
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = Number(this.state.Inputmoney2);
      }

      editData.detailedData = this.state.dataSource;
      editData.petty_sele = this.state.petty_sele;
      editData.Numbervalue1 = this.state.Numbervalue1;
      editData.Numbervalue2 = this.state.Numbervalue2;

      editData.Numbervalue3 = this.state.Numbervalue3;
      editData.Numbervalue4 = this.state.Numbervalue4;
      editData.Numbervalue5 = this.state.Numbervalue5;
      const { form } = this.props;
      form.setFieldValue('TestExpe', editData);
      form.setExtendFieldValue('TestExpe', {
        data: editData,
      });
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    const { form } = this.props;
    // const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    const field = form.getFieldInstance('TestExpe');
    const label = form.getFieldProp('TestExpe', 'label');
    const placeholder = form.getFieldProp('TestExpe', 'placeholder');
    const required = form.getFieldProp('TestExpe', 'required');
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
        title: '费用科目',
        dataIndex: 'ke_name',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.ke_name}>
            <span>{record.ke_name}</span>
          </Tooltip>
        ),
      },
      {
        title: '金额',
        dataIndex: 'money',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.money}>
            <span>{record.money}</span>
          </Tooltip>
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.remarks}>
            <span>{record.remarks}</span>
          </Tooltip>
        ),
      },
    ];
    const etColumns = [
      {
        title: '费用科目',
        dataIndex: 'ke_name',
        render: (text, record, index) => (
          <Cascader
            options={this.state.Optionlist}
            onChange={value => this.SelectChange(value, record)}
            placeholder="请选择"
          />
          //   <Select
          //     onChange={value => this.SelectChange(value, record)}
          //     style={{ width: 120 }}
          //   >
          //     {this.state.Optionlist.map((item, index) => {
          //       return <Option value={item}>{item}</Option>;
          //     })}
          //   </Select>
        ),
      },
      {
        title: '金额',
        dataIndex: 'money',
        editable: true,
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.money}>
            <span>{record.money}</span>
          </Tooltip>
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (_, record, index) => {
          let rec = record;
          return (
            <Input
              value={record.content}
              placeholder="请输入"
              onChange={e => {
                record.content = e.target.value;
              }}
            />
          );
        },
      },

      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="确定删除?"
              cancelText="取消"
              okText="确定"
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
      const treedata = { type: keys[0], number: '10', page: '1' };
      this.setState({
        allData: treedata,
      });
      this.asyncSetFieldProps(treedata);
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
      const {
        hanmoney = 0,
        detailedData = [],
        petty_sele = '',
        Numbervalue1 = '',
        Numbervalue2 = '',
        Numbervalue3 = '',
        Numbervalue4 = '',
        Numbervalue5 = '', //财务应支付金额
      } = value;
      return (
        <div className="field-wrapper">
          <div className="label">报销合计</div>
          <div style={{ marginTop: '10px' }}>
            {hanmoney ? Number(hanmoney).toFixed(2) : ''}
          </div>
          <div style={{ marginTop: '10px' }} className="label">
            报销明细
          </div>
          {/* <div>
            {detailedData.map(item => {
              return <div>{item.toString()}</div>;
            })}
          </div> */}
          <div>
            <Table
              scroll={{ x: '1000px' }}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={value instanceof Array ? value : detailedData}
              columns={deColumns}
              pagination={false}
            />
          </div>
          <div style={{ marginTop: '10px' }} className="label">
            备用金抵扣
          </div>
          <div style={{ marginTop: '10px' }}>{petty_sele}</div>
          <div style={{ marginTop: '10px' }} className="label">
            备用金余额
          </div>
          <div style={{ marginTop: '10px' }}>{Numbervalue1}</div>
          <div style={{ marginTop: '10px' }} className="label">
            本次抵扣金额
          </div>
          <div style={{ marginTop: '10px' }}>{Numbervalue2}</div>
          <div style={{ marginTop: '10px' }} className="label">
            审批中的费用报销抵扣
          </div>
          <div style={{ marginTop: '10px' }}>{Numbervalue3}</div>
          <div style={{ marginTop: '10px' }} className="label">
            审批中的归还
          </div>
          <div style={{ marginTop: '10px' }}>{Numbervalue4}</div>
          <div style={{ marginTop: '10px' }} className="label">
            财务应支付金额
          </div>
          <div style={{ marginTop: '10px' }}>{Numbervalue5}</div>
        </div>
      );
    }
    return (
      <div className="TestExpeField_class">
        <div className="pc-custom-field-wrap">
          <div className="label">
            {required ? (
              <span style={{ color: '#ea6d5c' }}>*</span>
            ) : (
              <span style={{ color: '#fff' }}>*</span>
            )}
            {label}
          </div>

          <div>
            <Table
              scroll={{ x: '1000px' }}
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

            <div className="label">报销合计</div>
            <div>
              <InputNumber
                readOnly
                value={this.state.Inputmoney1}
                placeholder="报销合计"
              />
            </div>
            <div>
              {/* {Pro_name ? ( */}
              <div>
                <div className="label" style={{ marginTop: '10px' }}>
                  备用金抵扣
                </div>
                <Select
                  defaultValue="否"
                  style={{ width: 200 }}
                  onFocus={this.onMouseEnter}
                  onChange={this.handleChange}
                >
                  {this.state.newopin.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                  {/* <Option value="1">是</Option>
                <Option value="2">否</Option> */}
                </Select>
              </div>
              {/* ) : null} */}
            </div>
            <div>
              {this.state.isShow ? (
                <div>
                  <div style={{ marginTop: '10px' }} className="label">
                    备用金余额
                  </div>
                  <InputNumber
                    readOnly
                    style={{ width: 200 }}
                    min={0}
                    value={this.state.Numbervalue1}
                  />
                  <div style={{ marginTop: '10px' }} className="label">
                    审批中的费用报销抵扣
                  </div>
                  <InputNumber
                    readOnly
                    style={{ width: 200 }}
                    min={0}
                    value={this.state.Numbervalue3}
                  />
                  <div style={{ marginTop: '10px' }} className="label">
                    审批中的归还
                  </div>
                  <InputNumber
                    readOnly
                    style={{ width: 200 }}
                    min={0}
                    value={this.state.Numbervalue4}
                  />
                  <div style={{ marginTop: '10px' }} className="label">
                    本次抵扣金额
                  </div>
                  <InputNumber
                    //   max={this.state.maxnum}
                    style={{ width: 200 }}
                    value={this.state.Numbervalue2}
                    onChange={this.onNumbervalue2Change}
                  />
                  <div style={{ marginTop: '10px' }} className="label">
                    财务应支付金额
                  </div>
                  <InputNumber
                    readOnly
                    style={{ width: 200 }}
                    value={this.state.Numbervalue5}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export default FormField;
