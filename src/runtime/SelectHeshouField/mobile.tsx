import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  InputItem,
  Drawer,
  List,
  Tabs,
  Toast,
  NavBar,
  Icon,
  SearchBar,
  Button,
  WhiteSpace,
  WingBlank,
} from 'antd-mobile';
import './mobile.less';

/**
 * 自定义控件运行态 Mobile 视图
 */
const FormField: IFormField = {
  getInitialState() {
    console.log('xhf-suite', Drawer);
    const { form } = this.props;
    return {
      SearchBarvalue: '',
      showElem: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
    };
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const SelectHeshouField = form.getFieldInstance('SelectHeshou');
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
        console.log(JSON.parse(res.dataList[0].value));
        //   表格数据
        const newarr = JSON.parse(res.dataList[0].value).data;

        this.setState({
          listData: [...newarr],
        });
      });
  },
  onOpenChange(...args) {
    console.log('sss');
    console.log(args);
    const { form } = this.props;
    const value = form.getFieldValue('Autopro');
    if (value) {
      const newvalue = this.state.allData;
      newvalue.name = '';
      newvalue.type = 0;
      newvalue.page = 1;
      newvalue.project_name = value;
      this.setState({
        allData: newvalue,
      });
      this.asyncSetFieldProps(newvalue);
    } else {
      Toast.info('请先选择项目', 1);
    }
    this.setState({ showElem: 'inherit' });
  },
  habdlClick(item: { name: any; money: any }) {
    const { form } = this.props;
    console.log(item);
    let dtar = '';
    if (this.state.detdate === 'a1') {
      dtar = '收入合同-' + item[0].name;
    } else if (this.state.detdate === 'b1') {
      dtar = '收入进度款结算-' + item[0].name;
    } else if (this.state.detdate === 'c1') {
      dtar = '收入完工结算-' + item[0].name;
    } else if (this.state.detdate === 'd1') {
      dtar = '收入质保金结算-' + item[0].name;
    }
    this.setState({ Inputvalue: dtar, showElem: 'none' }, () => {
      form.setFieldValue('Conmoney', item.money);
      form.setFieldValue('SelectHeshou', item.name);
      form.setExtendFieldValue('SelectHeshou', {
        data: item.name,
      });
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
  //搜索框
  onSearchBarChange(value) {
    this.setState({ SearchBarvalue: value });
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('SelectHeshou');
    const label = form.getFieldProp('SelectHeshou', 'label');
    const required = form.getFieldProp('SelectHeshou', 'required');
    const placeholder = form.getFieldProp('SelectHeshou', 'placeholder');
    const tabs = [
      { title: '收入合同' },
      { title: '收入进度款结算' },
      { title: '收入完工结算' },
      { title: '收入质保金结算' },
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
      } else if (index === 1) {
        newpage.defaultActiveKey = 'c';
        newpage.rk_id = ['c'];
      } else if (index === 1) {
        newpage.defaultActiveKey = 'd';
        newpage.rk_id = ['d'];
      }
      this.setState({
        allData: newpage,
        detdate: newpage.defaultActiveKey + '1',
      });
      this.asyncSetFieldProps(newpage);
    };
    const sidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入名称"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          showCancelButton
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
    return (
      <div className="mobile-wrap">
        <div className="label" onClick={this.onOpenChange}>
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}
          {label}
        </div>
        <div>
          <InputItem
            clear
            value={this.state.inputvalue}
            placeholder="点击选择"
            onFocus={this.onOpenChange}
          ></InputItem>
          {/* 使用这种方式，将组件挂在到根元素下，防止样式污染 */}
          <Tabs
            tabs={tabs}
            initialPage={1}
            onChange={(tab, index) => {
              console.log('onChange', index, tab);
            }}
            onTabClick={onTabClick}
          ></Tabs>
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
        </div>
      </div>
    );
  },
};

export default FormField;
