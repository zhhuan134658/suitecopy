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
  Table,
  Tooltip,
  Modal,
  notification,
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
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: any;
  num2: any;
  num1: any;
  num4: any;
  num3: any;
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
  onSearch(value) {
    console.log('SEARCH', value);
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
  handleChange(row: DataType) {
    // const inputRef = useRef<HTMLInputElement>(null);
    // const { form } = this.props;
    // form.setFieldValue('TestPlan', e.target.value);
    // document.getElementsByClassName('ptID').blur();
    // inputRef.current!.focus();
    this.setState({ currentEditId: row.key });
    // this.setState({ isModalVisible: true });
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleDelete(row) {
    const dataSource = [...this.state.dataSource];
    console.log(row);
    if (row.num3) {
      const newvalue = this.state.Inputmoney1;
      this.setState({
        Inputmoney1: (newvalue - row.num3).toFixed(2),
      });
      console.log('ssks');
    }
    if (row.num5) {
      const newvalue2 = this.state.Inputmoney2;
      this.setState({
        Inputmoney2: (newvalue2 - row.num5).toFixed(2),
      });
      console.log('ssks');
    }
    this.setState({
      dataSource: dataSource.filter(item => item.id !== row.id),
    });
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
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    // if (!Pro_name) {
    //   return notification.open({
    //     message: '请先选择项目',
    //   });
    // }
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({
      isModalVisible: true,
    });
  },
  handleSave(row: DataType) {
    const { form } = this.props;
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if (row.num2) {
      newData[index].num3 = row.num1 * row.num2;
    }
    if (row.num4) {
      newData[index].num5 = (row.num3 * row.num4 * 0.01).toFixed(2);
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
      if (item.num3) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.num3;
    });

    this.setState({
      Inputmoney1: eval(newarr2.join('+')).toFixed(2),
    });
    // 不含税金额合计;
    const newarr3 = [...this.state.dataSource];
    let newarr4 = [];

    newarr4 = newarr3.filter(item => {
      if (item.num5) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.num5;
    });

    this.setState({
      Inputmoney2: eval(newarr4.join('+')).toFixed(2),
    });

    // if (this.state.Inputmoney2) {
    //   console.log('saadasdasdas', this.state.Inputmoney2);
    //   form.setFieldValue('TestPlan', newData);
    //   form.setFieldExtendValue('TestPlan', {
    //     data: newData,
    //   });
    // }

    // this.setState({ dataSource: newData, isModalVisible: false }, () => {
    //   form.setFieldValue('TestPlan', newData);
    //   form.setFieldExtendValue('TestPlan', {
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
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestPlanField = form.getFieldInstance('TestPlan');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = TestPlanField.getProp('id');
    // const value = TestPlanfield.getExtendValue();
    const value = '1';

    // const extendValue = TestPlanField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestPlan',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestPlan'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log(JSON.parse(res.dataList[0].value));

        // this.state.listData = find(
        //   res.dataList,
        //   item => item.bizAlias === 'TestPlan',
        // );

        // this.state.listData = res.dataList[0].value;

        // this.setState({
        //   listData: res.dataList[0].value,
        // });
        //   表格数据
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

    this.setState({ dataSource: newData, isModalVisible: false });
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
        detailedData: [], //物资明细
      };

      editData.detailedData = this.state.dataSource;
      // 打印数据
      let newlistdata = this.state.dataSource;
      let str0 = '设备名称  单位  规格型号  总计划量  使用部位  备注';
      let str1 = '\n';
      for (let i = 0; i < newlistdata.length; i++) {
        str0 +=
          '\n' +
          newlistdata[i].name +
          '  ' +
          newlistdata[i].unit +
          '  ' +
          newlistdata[i].size +
          '  ' +
          newlistdata[i].det_quantity +
          '  ' +
          newlistdata[i].position +
          '  ' +
          newlistdata[i].remarks;
      }
      let str = str0 + str1;
      console.log(str);
      const { form } = this.props;
      form.setFieldValue('TestPlan', str);
      form.setFieldExtendValue('TestPlan', editData);
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    const { form } = this.props;
    const field = form.getFieldInstance('TestPlan');
    const label = form.getFieldProp('TestPlan', 'label');
    const placeholder = form.getFieldProp('TestPlan', 'placeholder');
    const required = form.getFieldProp('TestPlan', 'required');
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
        title: '总计划量',
        dataIndex: 'det_quantity',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.det_quantity}>
            <span>{record.det_quantity}</span>
          </Tooltip>
        ),
      },
      {
        title: '使用部位',
        dataIndex: 'position',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.position}>
            <span>{record.position}</span>
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
        title: '总计划量',
        dataIndex: 'det_quantity',
        render: (_, record: any) => (
          <Tooltip placement="topLeft" title={record.det_quantity}>
            <span>{record.det_quantity}</span>
          </Tooltip>
        ),
        editable: true,
      },
      {
        title: '使用部位',
        dataIndex: 'position',
        render: (_, record: any, index: number) => (
          <Input
            value={record.position}
            placeholder="请输入"
            onChange={e => {
              const newData = this.state.dataSource;
              newData[index].position = e.target.value;
              this.setState({ dataSource: newData });
            }}
          />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (_, record, index) => {
          let rec = record;
          return (
            <Input
              value={record.remarks}
              placeholder="请输入"
              onChange={e => {
                const newData = this.state.dataSource;
                newData[index].remarks = e.target.value;
                this.setState({ dataSource: newData });
              }}
            />
          );
        },
      },

      {
        title: '操作',
        dataIndex: 'operation',

        render: (_, record: any) =>
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
      let value = field.getExtendValue() || {};
      if (!value.detailedData) {
        value = field.getValue();
      }
      const { detailedData = [] } = value;
      return (
        <div className="field-wrapper">
          <div className="label">{label}</div>

          {/* <div>
            {detailedData.map(item => {
              return <div>{item.toString()}</div>;
            })}
          </div> */}
          <div>
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
      <div className="TestPlanField_class">
        {' '}
        <div className="pc-custom-field-wrap">
          <div className="label">
            {required ? (
              <span style={{ color: '#ea6d5c' }}>*</span>
            ) : (
              <span style={{ color: '#fff' }}>*</span>
            )}
            {label}
          </div>
          {/* {field.getProp('viewMode') ? (
          field.getExtendValue()
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
          field.getExtendValue()
        ) : (
          <Input placeholder={placeholder} onChange={this.handleChange} />
        )} */}
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
                    onChange={e => {
                      if (e.target.value === '') {
                        this.onSearch('');
                      }
                    }}
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
          </Modal>{' '}
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
