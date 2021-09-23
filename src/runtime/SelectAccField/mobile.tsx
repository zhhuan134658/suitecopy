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
    const { form } = this.props;
    return {
      SearchBarvalue: '',
      showElem: 'none',
      inputvalue: form.getFieldInstance('SelectAcc').getValue() || '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
    };
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const SelectAccField = form.getFieldInstance('SelectAcc');
    const key = SelectAccField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'SelectAcc',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['SelectAcc'], // spi接口要改动的是leaveReason的属性值
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
        });
      });
  },
  onOpenChange(...args) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem: 'inherit' });
  },
  habdlClick(item: {
    accountname: any;
    accountnumber: any;
    bankofdeposit: any;
  }) {
    const { form } = this.props;
    console.log(item);
    form.setFieldValue('Inputvalue', item.accountname);
    form.setExtendFieldValue('Inputvalue', item.accountname);
    form.setFieldValue('Inputvalue1', item.accountnumber);
    form.setFieldValue('Inputvalue2', item.bankofdeposit);
    form.setExtendFieldValue('Inputvalue1', item.accountnumber);
    form.setExtendFieldValue('Inputvalue2', item.bankofdeposit);
    this.setState({ inputvalue: item.accountname, showElem: 'none' }, () => {
      form.setFieldValue('SelectAcc', item.accountname);
      form.setExtendFieldValue('SelectAcc', {
        data: item.accountname,
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
    const field = form.getFieldInstance('SelectAcc');
    const label = form.getFieldProp('SelectAcc', 'label');
    const required = form.getFieldProp('SelectAcc', 'required');
    const placeholder = form.getFieldProp('SelectAcc', 'placeholder');

    const sidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          onCancel={this.onCancel}
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
                {item.accountname}
              </List.Item>
            );
          })}
        </List>
      </div>
    );
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();
      return (
        <div className="field-wrapper">
          <div className="m-field-view">
            <label className="m-field-view-label">{label}</label>
            <div className="m-field-view-value"> {value}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="field-wrapper">
        <div className="m-group m-group-mobile">
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
                      placeholder="请选择"
                      value={this.state.inputvalue}
                      onClick={this.onOpenChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <InputItem
            clear
            value={this.state.inputvalue}
            placeholder="请选择"
            onClick={this.onOpenChange}
          ></InputItem> */}
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
