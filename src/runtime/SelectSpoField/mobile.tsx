import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
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
    const SelectSpoField = form.getFieldInstance('SelectSpo');
    const key = SelectSpoField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'SelectSpo',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['SelectSpo'], // spi接口要改动的是leaveReason的属性值
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
    const newdate = this.state.allData;
    newdate.rk_id = ['a'];

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem: 'inherit' });
  },
  habdlClick(item: { name: any }) {
    const { form } = this.props;
    console.log(item);

    this.setState({ inputvalue: item.name, showElem: 'none' }, () => {
      form.setFieldValue('SelectSpo', item.name);
      form.setExtendFieldValue('SelectSpo', {
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
    const field = form.getFieldInstance('SelectSpo');
    const label = form.getFieldProp('SelectSpo', 'label');
    const required = form.getFieldProp('SelectSpo', 'required');
    const placeholder = form.getFieldProp('SelectSpo', 'placeholder');

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
