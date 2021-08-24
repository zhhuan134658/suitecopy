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
  Tabs,
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
      Inputmoney1: '',
      checkData: [],
      chenkdata: '',
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
      showElem3: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      materialList: [
        {
          typename: '',
          name: '',
          size: '',
          unit: '',
          rk_number: '',
          tax_price: '',
          purchase_riqi: '',
          tax_rate: '',
          notax_price: '',
          tax_money: '',
          notax_money: '',
        },
      ],
      sonData: {
        typename: '',
        name: '',
        size: '',
        unit: '',
        rk_number: '',
        tax_price: '',
        purchase_riqi: '',
        tax_rate: '',
        notax_price: '',
        tax_money: '',
        notax_money: '',
      },
    };
  },
  asyncSetFieldProps(vlauedata, type) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestPurField = form.getFieldInstance('TestPur');
    const key = TestPurField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestPur',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestPur'], // spi接口要改动的是leaveReason的属性值
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
        this.setState({
          checkData: [...newarr],
        });
        if (type === 1) {
          this.setState({
            materialList: [...newarr],
          });
        }
      });
  },
  getcheckdata() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');

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

    this.setState({ showElem3: 'inherit' });
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
        form.setFieldValue('TestPur', item.name);
        form.setExtendFieldValue('TestPur', {
          data: item.name,
        });
      },
    );
  },
  checkClick(item) {
    const cDataid = [item.id];
    const newdate = this.state.allData;
    newdate.rk_id = ['a1', ...cDataid];
    this.asyncSetFieldProps(newdate, 1);
    this.setState({
      chenkdata: item.name,
      showElem3: 'none',
    });
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
    arr[newindex].notax_price =
      arr[newindex].tax_price * arr[newindex].tax_rate;

    const newlistdata = [...arr];
    let newarr2 = [];
    newarr2 = newlistdata.map(item => {
      return item.notax_price;
    });
    this.setState({
      materialList: [...arr],
      Inputmoney1: eval(newarr2.join('+')),
    });
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
      form.setFieldValue('TestPurField', editData);
      form.setExtendFieldValue('TestPurField', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestPur', 'label');
    const tabs = [
      { title: '采购合同' },
      { title: '采购订单' },
      { title: '材料总计划' },
      { title: '采购申请' },
    ];
    const onTabClick = index => {
      let newpage = {
        defaultActiveKey: 'a',
        rk_id: ['a'],
        number: '10',
        page: 1,
        name: '',
      };
      if (index === 0) {
        newpage.defaultActiveKey = 'a';
        newpage.rk_id = ['a'];
      } else if (index === 1) {
        newpage.defaultActiveKey = 'b';
        newpage.rk_id = ['b'];
      } else if (index === 2) {
        newpage.defaultActiveKey = 'c';
        newpage.rk_id = ['c'];
      } else if (index === 3) {
        newpage.defaultActiveKey = 'd';
        newpage.rk_id = ['d'];
      }
      this.setState({
        allData: newpage,
        detdate: newpage.defaultActiveKey + '1',
      });
      this.asyncSetFieldProps(newpage);
    };
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
    const checkdebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入名称"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          showCancelButton
          onCancel={() => this.setState({ showElem3: 'none' })}
        />
        <Tabs
          tabs={tabs}
          initialPage={1}
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
          }}
          onTabClick={onTabClick}
        ></Tabs>
        <List>
          {this.state.checkData.map((item, index) => {
            return (
              <List.Item
                onClick={this.checkClick.bind(this, item)}
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
        <List>
          <List.Item>
            <div
              className="m-group m-group-mobile"
              style={{ marginBottom: '0px' }}
            >
              <div className="m-field-wrapper">
                <div className="m-field m-field-mobile m-mobile-input vertical">
                  <div className="m-field-head" style={{ marginLeft: '-5px' }}>
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
                  <div className="m-field-box">
                    <div className="m-field-content left">
                      <div className="input-wrapper">
                        <input
                          readOnly
                          className="ant-input m-mobile-inner-input"
                          type="text"
                          placeholder="点击选择"
                          value={this.state.chenkdata}
                          onFocus={this.getcheckdata}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div>{label}</div>
            <div>
              <InputItem
                clear
                value={this.state.chenkdata}
                onFocus={this.getcheckdata}
                placeholder="请输入"
              ></InputItem>
            </div> */}
          </List.Item>
        </List>
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
                  <div className="label">入库数量</div>
                  <div>
                    <InputItem
                      clear
                      value={item.rk_number}
                      placeholder="请输入"
                      onChange={e => this.onInputchange('rk_number', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">含税单价</div>
                  <div>
                    <InputItem
                      clear
                      value={item.tax_price}
                      placeholder="请输入"
                      onChange={e => this.onInputchange('tax_price', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>

                <List.Item>
                  <div className="label">税率(%)</div>
                  <div>
                    <InputItem
                      clear
                      value={item.tax_rate}
                      placeholder="请输入"
                      onChange={e => this.onInputchange('tax_rate', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">税额</div>
                  <div>
                    <InputItem
                      clear
                      value={item.notax_price}
                      placeholder="请输入"
                      onChange={e =>
                        this.onInputchange('notax_price', index, e)
                      }
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">含税金额</div>
                  <div>
                    <InputItem
                      clear
                      value={item.tax_money}
                      placeholder="请输入"
                      onChange={e => this.onInputchange('tax_money', index, e)}
                    ></InputItem>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="label">不含税金额</div>
                  <div>
                    <InputItem
                      clear
                      value={item.notax_money}
                      placeholder="请输入"
                      onChange={e =>
                        this.onInputchange('notax_money', index, e)
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
        <List>
          <List.Item>
            <div className="label">含税金额合计</div>
            <div>
              <InputItem
                clear
                value={this.state.Inputmoney1}
                placeholder="请输入"
              ></InputItem>
            </div>
          </List.Item>
        </List>
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
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,
              display: this.state.showElem3,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={checkdebar}
            onOpenChange={this.onOpenChange3}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
      </div>
    );
  },
};

export default FormField;
