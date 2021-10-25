// 选择项目
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
//     form.setFieldValue('SelectDeposit', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('SelectDeposit');
//     const label = form.getFieldProp('SelectDeposit', 'label');
//     const placeholder = form.getFieldProp('SelectDeposit', 'placeholders');

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
import { IFormField } from '../../types';
const { Column } = Table;
import { FormInstance } from 'antd/lib/form';

import './pc.less';
const mycolumns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    render: (_: any, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <span>{record.name}</span>
      </Tooltip>
    ),
  },
  {
    title: '项目状态',
    dataIndex: 'project_status',
  },
  {
    title: '项目负责人',
    dataIndex: 'stalker_name',
  },
  {
    title: '项目类型',
    dataIndex: 'type',
  },
  {
    title: '工程造价（元）',
    dataIndex: 'make_cost',
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
      //   toggleEdit();   //onchange事件 输入一次失去焦点
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
          min={1}
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
  num2: any;
  num1: any;
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
    const { form } = this.props;

    return {
      bizname: '',
      Inputvalue: form.getFieldInstance('SelectDeposit').getValue() || '',
      //   Inputvalue: '123',
      current_page: '', //当前页
      total2: '',
      allData: { type: '0', number: '10', page: '1', name: '' },
      isModalVisible: false,
      listData: [],

      treeData: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },

      loading: false,
      leaveLongVal: '',

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
  },
  onSearch(value: any) {
    console.log(value);
    const newvalue = this.state.allData;
    const bizname = this.state.bizname;
    newvalue.name = value;
    newvalue.type = 0;
    newvalue.page = 1;
    this.setState({
      allData: newvalue,
    });
    this.asyncSetFieldProps(newvalue);
  },
  onChangepage(page: any) {
    const newpage = this.state.allData;
    const bizname = this.state.bizname;
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
    // const inputRef = useRef<Input>(null);
    // const { form } = this.props;
    // form.setFieldValue('SelectDeposit', e.target.value);
    // document.getElementsByClassName('ptID').blur();
    // inputRef.current!.focus();
    this.setState({ currentEditId: row.key });
    // this.setState({ isModalVisible: true });
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
    this.setState({ selectedRowKeys: [] });
  },
  handleDelete(row: { id: any }) {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter(item => item.id !== row.id),
    });
  },

  handleAdd() {
    const { form } = this.props;
    const value = form.getFieldValue('RadioField');
    if (value) {
      if (value == '投标保证金支出' || value == '投标保证金退回') {
        const newdate = this.state.allData;
        newdate.isProject = '2';
        this.asyncSetFieldProps(newdate);
      } else {
        const newdate = this.state.allData;
        newdate.isProject = '1';
        this.asyncSetFieldProps(newdate);
      }

      this.setState({
        isModalVisible: true,
      });
    } else {
      notification.open({
        message: '请先选择合同类型',
      });
    }
  },

  handleSave(row: DataType) {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    console.log(index);
    console.log(item);

    if (row.num2) {
      newData[index].num3 = row.num1 * row.num2;
    }

    this.setState({ dataSource: newData });
  },
  asyncSetFieldProps(vlauedata: any) {
    const { form, spi } = this.props;

    const SelectDepositField = form.getFieldInstance('SelectDeposit');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = SelectDepositField.getProp('id');
    // const value = SelectDepositField.getValue();
    const value = '1';

    // const extendValue = SelectDepositField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'SelectDeposit',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['SelectDeposit'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
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

        // console.log(JSON.parse(newarr));
        // console.log(this.state.listData);
      });
  },
  rowClick(this: any, record: { name: any; id: any }, rowkey: any) {
    const { form } = this.props;
    console.log(record);

    this.setState({ Inputvalue: record.name, isModalVisible: false }, () => {
      form.setFieldValue('SelectDeposit', record.name);
      form.setExtendFieldValue('SelectDeposit', {
        data: record.name,
      });
    });
    console.log('asdas', form);

    // form.getFormData().then(res => {
    //   debugger
    // })

    // console.log(`formData: ${.}`);

    // const newData = [...this.state.dataSource];
    // const index = newData.findIndex(
    //   item => this.state.currentEditId === item.key,
    // );
    // const currentKey = newData[index].key;
    // newData[index] = record;
    // newData[index].key = currentKey;
    // this.setState({ dataSource: newData });
    // this.setState({ isModalVisible: false });
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
  unique(arr: any[]) {
    const res = new Map();
    return arr.filter(
      (arr: { id: any }) => !res.has(arr.id) && res.set(arr.id, 1),
    );
  },
  fieldRender() {
    const { form, runtimeProps } = this.props;
    console.log('qqqqqq', this.props);
    const { viewMode } = runtimeProps;
    console.log('qqqqqq', viewMode);

    const field = form.getFieldInstance('SelectDeposit');
    console.log('wwwwwww', field);
    const label = form.getFieldProp('SelectDeposit', 'label');
    const required = form.getFieldProp('SelectDeposit', 'required');
    const placeholder = form.getFieldProp('SelectDeposit', 'placeholder');
    const { dataSource, selectedRowKeys } = this.state;

    const etColumns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '规格',
        dataIndex: 'size',
      },
      {
        title: '数量',
        dataIndex: 'num1',
        editable: true,
      },
      {
        title: '单价',
        dataIndex: 'num2',
        editable: true,
      },
      {
        title: '金额',
        dataIndex: 'num3',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_: any, record: any) =>
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

    const onExpand = () => {
      console.log('Trigger Expand');
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   'selectedRows: ',
        //   selectedRows,
        // );
        let newData = [...selectedRows];
        if (newData.length > 0) {
          newData = newData.map(item => {
            5;
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
    // 详情页
    if (viewMode) {
      const value = field.getValue();
      const { data = '' } = value;
      return (
        <div className="field-wrapper">
          <div className="label">{label}</div>

          <div style={{ marginTop: '10px' }}> {value}</div>
        </div>
      );
    }
    return (
      <div className="SelectDepositField_class">
        {' '}
        <div className="pc-custom-field-wrap">
          <div className="label">
            {required ? (
              <span style={{ color: '#ea6d5c' }}>*</span>
            ) : (
              <span style={{ color: '#fff' }}>*</span>
            )}{' '}
            {label}
          </div>
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
          <div>
            <Input
              readOnly
              value={this.state.Inputvalue}
              onClick={this.handleAdd}
              placeholder="请选择项目"
            />
          </div>

          <Modal
            title="选择项目"
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
            <Search
              placeholder="请输入"
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={this.onSearch}
            />
            <Table
              scroll={{ x: '60vw' }}
              onRow={record => {
                return {
                  onClick: this.rowClick.bind(this, record),
                };
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
        </div>
      </div>
    );
  },
};

export default FormField;
