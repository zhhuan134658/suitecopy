import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Modal, Input, Button, Popconfirm, Form } from 'antd';
import { IFormField } from '../../types';
const { Column } = Table;
import { FormInstance } from 'antd/lib/form';

import './pc.less';
const columns = [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'size',
    dataIndex: 'size',
  },
];
interface ISwapFormField extends IFormField {
  //   handleChange: () => void;
  //   handleOk: () => void;
  //   handleCancel: () => void;
  //   handleTableChange: () => void;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  size: string;
  type: string;
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
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
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

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('11Save failed:', errInfo);
    }
  };
  const focusSave = () => {
    handleChange({ ...record });
  };
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
        <Input
          ref={inputRef}
          readOnly={true}
          onFocus={focusSave}
          onBlur={save}
          placeholder="请选择物资"
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
    //     <Input
    //       ref={inputRef}
    //       readOnly={true}
    //       onFocus={focusSave}
    //       onBlur={save}
    //       placeholder="请选择物资"
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
      isModalVisible: false,
      listData: [
        { name: '钢筋', size: '55#', type: '土建工程' },
        { name: '水泥', size: '5#', type: '土建工程' },
        { name: '水泥2', size: '52#', type: '土建工程' },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      leaveLongVal: '',

      dataSource: [],
      count: 1,

      currentEditId: 0,
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    // this.asyncSetFieldProps();
  },
  handleChange(row: DataType) {
    // const inputRef = useRef<Input>(null);
    // const { form } = this.props;
    // form.setFieldValue('leaveHowLong', e.target.value);
    // document.getElementsByClassName('ptID').blur();
    // inputRef.current!.focus();
    this.setState({ currentEditId: row.key });
    this.setState({ isModalVisible: true });
  },

  handleCancel() {
    this.setState({ isModalVisible: false });
  },
  handleDelete(key: React.Key) {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
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
      name: '请选择物资',
      age: '',
      address: '',
    };
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  },

  handleSave(row: DataType) {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  },
  asyncSetFieldProps() {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('SelectPro');
    vlauedata.project_name = Pro_name;
    const leaveHowLongField = form.getFieldInstance('leaveHowLong');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = leaveHowLongField.getProp('id');
    // const value = leaveHowLongField.getValue();
    const value = '1';
    const extendValue = leaveHowLongField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'leaveHowLong',
        extendValue,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['leaveHowLong'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        this.state.listData = find(
          res.dataList,

          item => item.bizAlias === 'leaveHowLong',
        );
      });
  },
  rowClick(this, record, rowkey) {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(
      item => this.state.currentEditId === item.key,
    );
    const currentKey = newData[index].key;
    newData[index] = record;
    newData[index].key = currentKey;
    this.setState({ dataSource: newData });
    this.setState({ isModalVisible: false });
  },
  fieldRender() {
    const { form } = this.props;
    const field = form.getFieldInstance('leaveHowLong');
    const label = form.getFieldProp('leaveHowLong', 'label');
    const placeholder = form.getFieldProp('leaveHowLong', 'placeholder');
    const required = form.getFieldProp('leaveHowLong', 'required');
    const { dataSource } = this.state;
    const etColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
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
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="确定删除?"
              onConfirm={() => this.handleDelete(record.key)}
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
    return (
      <div className="pc-custom-field-wrap">
        <div className="label">
          {required ? <span style={{ color: 'red' }}>*</span> : null}
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
        </div>

        <Modal
          title="选择物品"
          visible={this.state.isModalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Table
            scroll={{ x: '50vw' }}
            columns={columns}
            dataSource={this.state.listData}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onRow={(record, rowkey) => {
              return {
                onClick: this.rowClick.bind(this, record, rowkey), //点击行 record 指的本行的数据内容，rowkey指的是本行的索引
              };
            }}
          >
            {/* <Column title="名称" dataIndex="name" key="name" />
            <Column title="规格" dataIndex="size" key="size" /> */}
          </Table>
        </Modal>
      </div>
    );
  },
};

export default FormField;
