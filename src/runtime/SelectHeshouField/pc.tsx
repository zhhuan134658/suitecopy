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
//     form.setFieldValue('SelectHeshou', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('SelectHeshou');
//     const label = form.getFieldProp('SelectHeshou', 'label');
//     const placeholder = form.getFieldProp('SelectHeshou', 'placeholders');

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
import { IFormField } from '../../types';
const { Column } = Table;
import { FormInstance } from 'antd/lib/form';
const { TabPane } = Tabs;

import './pc.less';
const handleDview = key => {
  console.log(key);
  window.open(key.url);
};
const mycolumnsa = [
  {
    title: '合同名称',
    dataIndex: 'name',
    render: (_, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <a onClick={() => handleDview(record)}>{record.name}</a>
      </Tooltip>
    ),
  },
  {
    title: '甲方',
    dataIndex: 'party_a',
  },
  {
    title: '合同金额',
    dataIndex: 'money',
  },
];
const mycolumnsb = [
  {
    title: '结算名称',
    dataIndex: 'name',
    render: (_, record: any) => (
      <Tooltip placement="topLeft" title={record.name}>
        <a onClick={() => handleDview(record)}>{record.name}</a>
      </Tooltip>
    ),
  },
  {
    title: '甲方',
    dataIndex: 'extend_first',
  },
  {
    title: '结算金额',
    dataIndex: 'reply_money',
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
  rk_number: any;
  tax_price: any;
  tax_rate: any;
  tax_money: any;
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
      defaultActiveKey: 'a',
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
      currentSelectDataid: [],
      selectedRowKeys: [],
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    // const newdate = this.state.allData;
    // this.asyncSetFieldProps(newdate);
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
    // form.setFieldValue('SelectHeshou', e.target.value);
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
    if (row.tax_money) {
      const newvalue = this.state.Inputmoney1;
      this.setState({
        Inputmoney1: (newvalue - row.tax_money).toFixed(2),
      });
      console.log('ssks');
    }
    if (row.notax_money) {
      const newvalue2 = this.state.Inputmoney2;
      this.setState({
        Inputmoney2: (newvalue2 - row.notax_money).toFixed(2),
      });
      console.log('ssks');
    }
    this.setState({
      dataSource: dataSource.filter(item => item.id !== row.id),
    });
  },
  newhandleAdd() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    if (!Pro_name) {
      return notification.open({
        message: '请先选择项目',
      });
    }
    const newddd = this.state.defaultActiveKey;
    console.log(newddd);
    this.setState({ dstatus: '1' });
    let newpage = {
      rk_id: [newddd],
      number: '10',
      page: 1,
      name: '',
      project_name: Pro_name,
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
    if (row.rk_number) {
      newData[index].tax_money = row.rk_number * row.tax_price;
    }
    if (row.tax_rate) {
      newData[index].notax_price = (
        row.tax_money *
        row.tax_rate *
        0.01
      ).toFixed(2);
      newData[index].notax_money = (
        row.tax_money *
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
    //   form.setFieldValue('SelectHeshou', newData);
    //   form.setExtendFieldValue('SelectHeshou', {
    //     data: newData,
    //   });
    // }

    // this.setState({ dataSource: newData, isModalVisible: false }, () => {
    //   form.setFieldValue('SelectHeshou', newData);
    //   form.setExtendFieldValue('SelectHeshou', {
    //     data: newData,
    //   });
    // });

    console.log('sss', eval(newarr3.join('+'))).toFixed(2);
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

    const SelectHeshouField = form.getFieldInstance('SelectHeshou');
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const key = SelectHeshouField.getProp('id');

    const value = '1';

    const bizAsyncData = [
      {
        key,
        bizAlias: 'SelectHeshou',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['SelectHeshou'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}
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

          let newarr4 = [];

          newarr4 = newssarr.filter(item => {
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
      form.setFieldValue('SelectHeshou', record);
      form.setExtendFieldValue('SelectHeshou', {
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

    this.setState({
      isModalVisible: false,
    });
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

      const detailname = this.state.detailname;

      const { form } = this.props;
      form.setFieldValue('SelectHeshou', detailname);
      form.setExtendFieldValue('SelectHeshou', {
        data: detailname,
      });
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    const { form } = this.props;
    const field = form.getFieldInstance('SelectHeshou');
    const label = form.getFieldProp('SelectHeshou', 'label');
    const placeholder = form.getFieldProp('SelectHeshou', 'placeholder');
    const required = form.getFieldProp('SelectHeshou', 'required');
    const { dataSource, selectedRowKeys } = this.state;
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
        title: '入库数量',
        dataIndex: 'rk_number',
        editable: true,
      },
      {
        title: '含税单价',
        dataIndex: 'tax_price',
        editable: true,
      },
      {
        title: '税率(%)',
        dataIndex: 'tax_rate',
        editable: true,
      },

      {
        title: '税额',
        dataIndex: 'notax_price',
      },
      {
        title: '含税金额',
        dataIndex: 'tax_money',
      },
      {
        title: '不含税金额',
        dataIndex: 'notax_money',
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
    const Tabschange = key => {
      console.log(key);

      let newpage = {
        rk_id: [key],
        number: '10',
        page: 1,
        name: '',
      };
      this.setState({
        defaultActiveKey: key,
        allData: newpage,
        detdate: key + '1',
      });
      this.asyncSetFieldProps(newpage);
    };
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
          dtar = '收入合同-' + newData[0].name;
        } else if (this.state.detdate === 'b1') {
          dtar = '收入进度款结算-' + newData[0].name;
        } else if (this.state.detdate === 'c1') {
          dtar = '收入完工结算-' + newData[0].name;
        } else if (this.state.detdate === 'd1') {
          dtar = '收入质保金结算-' + newData[0].name;
        }
        const { form } = this.props;
        if (newData[0].party_a) {
          form.setFieldValue('Selectjia', newData[0].party_a);
        }

        this.setState({
          currentSelectData: newData,
          currentSelectDataid: newDataid,
          detailname: dtar,
        });
        this.setState({ selectedRowKeys });
      },
    };
    //      hanmoney: '',
    //   nomoney: '',
    //   detailname: '',
    //   detailedData: [],
    // 详情页
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();

      return (
        <div className="field-wrapper">
          <div className="label">{label}</div>
          <div style={{ marginTop: '10px' }}> {value}</div>
        </div>
      );
    }
    return (
      <div className="SelectHeshouField_class">
        {' '}
        <div className="pc-custom-field-wrap">
          <div>
            <div className="label">
              {required ? (
                <span style={{ color: '#ea6d5c' }}>*</span>
              ) : (
                <span style={{ color: '#fff' }}>*</span>
              )}
              {label}
            </div>
            <Input
              onClick={this.newhandleAdd}
              readOnly
              value={this.state.detailname}
              placeholder="请选择"
            />
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
            <Tabs
              className="Tabs_class"
              defaultActiveKey="a"
              centered
              onChange={Tabschange}
            >
              <TabPane tab="收入合同" key="a">
                <Search
                  placeholder="请输入"
                  allowClear
                  enterButton="搜索"
                  size="large"
                  onSearch={this.onSearch}
                />
                <Table
                  scroll={{ x: '1500px' }}
                  rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                  }}
                  rowKey={record => record.id}
                  columns={mycolumnsa}
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
              </TabPane>
              <TabPane tab="收入进度款结算" key="b">
                <Search
                  placeholder="请输入"
                  allowClear
                  enterButton="搜索"
                  size="large"
                  onSearch={this.onSearch}
                />
                <Table
                  scroll={{ x: '1500px' }}
                  rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                  }}
                  rowKey={record => record.id}
                  columns={mycolumnsb}
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
              </TabPane>
              <TabPane tab="收入完工结算 " key="c">
                {' '}
                <Search
                  placeholder="请输入"
                  allowClear
                  enterButton="搜索"
                  size="large"
                  onSearch={this.onSearch}
                />
                <Table
                  scroll={{ x: '1500px' }}
                  rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                  }}
                  rowKey={record => record.id}
                  columns={mycolumnsb}
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
              </TabPane>
              <TabPane tab="收入质保金结算" key="d">
                {' '}
                <Search
                  placeholder="请输入"
                  allowClear
                  enterButton="搜索"
                  size="large"
                  onSearch={this.onSearch}
                />
                <Table
                  scroll={{ x: '1500px' }}
                  rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                  }}
                  rowKey={record => record.id}
                  columns={mycolumnsb}
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
              </TabPane>
            </Tabs>
          </Modal>
          {/* 树形 */}
        </div>
      </div>
    );
  },
};

export default FormField;
