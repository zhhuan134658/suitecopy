import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  DatePicker,
  InputItem,
  Drawer,
  List,
  NavBar,
  Icon,
  SearchBar,
  Button,
  WhiteSpace,
  WingBlank,
} from 'antd-mobile';
import { Tree } from 'antd';
import './mobile.less';
const Item = List.Item;
/**
 * 自定义控件运行态 Mobile 视图
 */
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      treevalue: undefined,
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
      date: now,
      checkindex: '',
      SearchBarvalue: '',
      showElem: 'none',
      showElem2: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      materialList: [
        {
          typename: '',
          name: '',
          size: '',
          unit: '',
          number: '',
          purchase_unit: '',
          purchase_riqi: '',
          purchase_address: '',
          candidate_list: '',
        },
      ],
      sonData: {
        typename: '',
        name: '',
        size: '',
        unit: '',
        number: '',
        purchase_unit: '',
        purchase_riqi: '',
        purchase_address: '',
        candidate_list: '',
      },
    };
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestExpe = form.getFieldInstance('TestDemand');
    const key = TestExpe.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestDemand',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestDemand'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log(JSON.parse(res.dataList[0].value));
        //   表格数据
        const newarr = JSON.parse(res.dataList[0].value).data;

        this.setState({
          listData: [...newarr],
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
      });
  },
  onOpenChange(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem: 'inherit', checkindex: index });
  },
  onOpenChange2(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem2: 'inherit', checkindex: index });
  },
  habdlClick(item: { name: any; size: any; unit: any }) {
    const { form } = this.props;
    console.log(item);
    let arr = this.state.materialList;
    let arrindex = this.state.checkindex;

    arr[arrindex].name = item.name;
    arr[arrindex].size = item.size;
    arr[arrindex].unit = item.unit;
    this.setState(
      { inputvalue: item.name, showElem: 'none', materialList: arr },
      () => {
        form.setFieldValue('TestDemand', item.name);
        form.setExtendFieldValue('TestDemand', {
          data: item.name,
        });
      },
    );
  },

  onCancel() {
    this.setState({ showElem: 'none' });
  },

  onSubmit(value) {
    const newdate = this.state.allData;
    newdate.name = value;

    this.asyncSetFieldProps(newdate);
  },
  onSearchBarChange(value) {
    this.setState({ SearchBarvalue: value });
  },
  //增加明细
  addSon() {
    this.setState({
      materialList: [...this.state.materialList, this.state.sonData],
    });
  },
  //删除明细
  deleteItem(index) {
    let list = this.state.materialList;
    list.splice(index, 1);
    this.setState({
      materialList: list,
    });
  },
  //更新数据
  onInputchange(types, index, e) {
    console.log(types, index, e, this);
    let arr = this.state.materialList;
    console.log(this.state.materialList);
    // let arrindex = e.target.value;
    let arrindex = e;
    let newindex = index;
    let newtype = types;
    // arr[newindex] = {};
    arr[newindex][newtype] = arrindex;
    this.setState({ materialList: [...arr] });
    console.log(arr);
  },
  onDatechange(types, index, dateString) {
    // let arr = this.state.materialList;
    // let purchase_riqi = 'purchase_riqi';
    // arr[index][purchase_riqi] = dateString;
    // this.setState({ materialList: [...arr] });
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');

      let editData = {
        detailedData: [], //物资明细
      };

      editData.detailedData = this.state.materialList;
      const { form } = this.props;
      form.setFieldValue('TestExpe', editData);
      form.setExtendFieldValue('TestExpe', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestDemand', 'label');
    const onSelect = (selectedKeys: React.Key[], info: any) => {
      let arr = this.state.materialList;
      let newindex = this.state.checkindex;
      arr[newindex].typename = info.node.title;
      this.setState({ showElem2: 'none', materialList: [...arr] });
      const treedata = { type: selectedKeys[0], number: '10', page: '1' };
      this.setState({
        allData: treedata,
      });
      this.asyncSetFieldProps(treedata);
      console.log('selected', selectedKeys, info.node.title);
    };

    const onCheck = (checkedKeys: React.Key[], info: any) => {
      console.log('onCheck', checkedKeys, info);
    };
    const sidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入名称"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          showCancelButton
          onCancel={() => this.setState({ showElem: 'none' })}
        />

        <List>
          {this.state.listData.map((item, index) => {
            return (
              <List.Item
                onClick={this.habdlClick.bind(this, item)}
                key={index}
                multipleLine
              >
                {item.name}
              </List.Item>
            );
          })}
        </List>
      </div>
    );
    const treesidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入名称"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          onCancel={() => this.setState({ showElem2: 'none' })}
          showCancelButton
        />

        <Tree onSelect={onSelect} treeData={this.state.treeData} />
      </div>
    );
    return (
      <div className="field-wrapper">
        <div className="m-group m-group-mobile">
          <div className="m-field-wrapper">
            <div className="m-field m-field-mobile m-mobile-input vertical">
              <div className="m-field-head">
                <label className="m-field-label">
                  <span>
                    {required ? (
                      <span style={{ color: '#ea6d5c' }}>*</span>
                    ) : (
                      <span style={{ color: '#fff' }}>*</span>
                    )}
                    {label}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div>
          {this.state.materialList.map((item, index) => {
            return (
              <List>
                <List.Item>
                  <div className="mobile_title">
                    <div>物资明细{index + 1}</div>
                    <div
                      style={{ color: '#ea6d5c' }}
                      onClick={this.deleteItem.bind(this, index)}
                    >
                      删除
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">物资类型</div>
                  <div>
                    <InputItem
                      clear
                      value={item.typename}
                      placeholder="点击选择"
                      onFocus={this.onOpenChange2.bind(this, index)}
                      onChange={e => this.onInputchange('typename', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">物资名称</div>
                  <div>
                    <InputItem
                      clear
                      value={item.name}
                      placeholder="点击选择"
                      onFocus={this.onOpenChange.bind(this, index)}
                      onChange={e => this.onInputchange('name', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">规格型号</div>
                  <div>
                    <InputItem
                      disabled
                      clear
                      value={item.size}
                      placeholder="自动填充"
                      onChange={e => this.onInputchange('size', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">单位</div>
                  <div>
                    <InputItem
                      disabled
                      clear
                      value={item.unit}
                      placeholder="自动填充"
                      onChange={e => this.onInputchange('unit', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">估算数量</div>
                  <div>
                    <InputItem
                      clear
                      value={item.number}
                      placeholder="请输入"
                      onChange={e => this.onInputchange('number', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">物资采购部门</div>
                  <div>
                    <InputItem
                      clear
                      value={item.purchase_unit}
                      placeholder="请输入"
                      onChange={e =>
                        this.onInputchange('purchase_unit', index, e)
                      }
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">采购日期</div>
                  <div>
                    <DatePicker
                      mode="date"
                      title="Select Date"
                      extra="Optional"
                      value={this.state.date}
                      onChange={date => this.setState({ date })}
                    ></DatePicker>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">采购地点</div>
                  <div>
                    <InputItem
                      clear
                      value={item.purchase_address}
                      placeholder="请输入"
                      onChange={e =>
                        this.onInputchange('purchase_address', index, e)
                      }
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">候选供应商名单</div>
                  <div>
                    <InputItem
                      clear
                      value={item.candidate_list}
                      placeholder="请输入"
                      onChange={e =>
                        this.onInputchange('candidate_list', index, e)
                      }
                    ></InputItem>
                  </div>
                </List.Item>
              </List>
            );
          })}
        </div>
        <Button type="primary" onClick={this.addSon}>
          增加明细
        </Button>{' '}
        {/* 合计 */}
        {/* <List>
          <List.Item>
            <div className="label">候选供应商名单</div>
            <div>
              <InputItem
                clear
                value={candidate_list}
                placeholder="请输入"
                onChange={e => this.onInputchange('candidate_list', index, e)}
              ></InputItem>
            </div>
          </List.Item>
        </List> */}
        {/* 物资明细 */}
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,

              display: this.state.showElem,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={sidebar}
            onOpenChange={this.onOpenChange}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,
              display: this.state.showElem2,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={treesidebar}
            onOpenChange={this.onOpenChange2}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
      </div>
    );
  },
};

export default FormField;
