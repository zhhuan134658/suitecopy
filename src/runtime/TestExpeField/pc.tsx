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
//     form.setFieldValue('TestExpe', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('TestExpe');
//     const label = form.getFieldProp('TestExpe', 'label');
//     const placeholder = form.getFieldProp('TestExpe', 'placeholders');

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
  Table,
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
      petty_sele: '否',
      Numbervalue1: 0,
      Numbervalue2: '',
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
      count: 0,

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
  handleChange(value) {
    console.log(`selected ${value}`);
    const { form } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    if (value === '1') {
      this.setState({
        isShow: true,
        petty_sele: '是',
      });
      const newdate = this.state.allData;
      newdate.rk_id = ['是'];

      this.asyncSetFieldProps(newdate);
    } else {
      this.setState({
        isShow: false,
        petty_sele: '否',
      });
    }
    if (!Pro_name) {
      return notification.open({
        message: '请先选择项目',
      });
    }
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
    const { form } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    if (!Pro_name) {
      return notification.open({
        message: '请先选择项目',
      });
    }
    const { count, dataSource } = this.state;
    const newData: DataType = {
      key: count,
      ke_name: '企业管理费',
      money: '',
      remarks: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  },
  handleSave(row: DataType) {
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
    const joindata = eval(newarr2.join('+'));
    this.setState({
      Inputmoney1: joindata,
      Numbervalue2: joindata - this.state.Numbervalue1,
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

  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    vlauedata.project_name = Pro_name;
    vlauedata.petty_sele = this.state.petty_sele;
    vlauedata.petty_yu = this.state.Numbervalue1;
    vlauedata.project_name = this.state.Numbervalue2;
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
        console.log(JSON.parse(res.dataList[0].value));

        // this.state.listData = find(
        //   res.dataList,
        //   item => item.bizAlias === 'TestExpe',
        // );

        // this.state.listData = res.dataList[0].value;

        // this.setState({
        //   listData: res.dataList[0].value,
        // });
        //   表格数据
        const newarr = JSON.parse(res.dataList[0].value).data;

        this.setState({
          Numbervalue1: newarr,
        });

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
      Numbervalue2: aaadata - value,
    });
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
      detailedData: [], //物资明细
    };
    if (this.state.Inputmoney1) {
      editData.hanmoney = this.state.Inputmoney1;
    }
    if (this.state.Inputmoney2) {
      editData.nomoney = this.state.Inputmoney2;
    }

    editData.detailedData = this.state.dataSource;
    const { form } = this.props;
    form.setFieldValue('TestExpe', editData);
    form.setExtendFieldValue('TestExpe', {
      data: editData,
    });

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    const { form } = this.props;
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
      },
      {
        title: '金额',
        dataIndex: 'money',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ];
    const etColumns = [
      {
        title: '费用科目',
        dataIndex: 'ke_name',
      },
      {
        title: '金额',
        dataIndex: 'money',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        editable: true,
      },

      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
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
      const { hanmoney = '', detailedData = [] } = value;
      return (
        <div>
          <div className="label">含税金额</div>
          <div>{hanmoney}</div>
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
        <div className="label">
          {required ? <span style={{ color: 'red' }}>*</span> : null}
          {label}
        </div>

        <div>
          <Table
            scroll={{ x: '50vw' }}
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
              onChange={this.onChangenum2}
              placeholder="报销合计"
            />
          </div>
          <div>
            <div className="label">备用金抵扣</div>
            <Select
              defaultValue="2"
              style={{ width: 200 }}
              onChange={this.handleChange}
            >
              <Option value="1">是</Option>
              <Option value="2">否</Option>
            </Select>
          </div>
          <div>
            {this.state.isShow ? (
              <div>
                <div className="label">备用金余额</div>
                <InputNumber
                  style={{ width: 200 }}
                  min={0}
                  value={this.state.Numbervalue1}
                  onChange={this.onChangenum}
                />
                <div className="label">折扣后合计</div>
                <InputNumber
                  style={{ width: 200 }}
                  value={this.state.Numbervalue2}
                  //   onChange={this.onChange}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
};

export default FormField;