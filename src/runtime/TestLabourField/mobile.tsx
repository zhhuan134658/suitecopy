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
import { asyncSetProps } from '../../utils/asyncSetProps';
import { searchBarChange, searchBarSubmit } from '../../utils/searchUtils';
/**
 * 自定义控件运行态 Mobile 视图
 */
const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      detdate: 'a1',
      SearchBarvalue: '',
      showElem: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
    };
  },
  asyncSetFieldProps(vlauedata: any, typeName: any) {
    const _this = this;
    const promise = asyncSetProps(_this, vlauedata, 'TestLabour');
    promise.then(res => {
      const type = typeName;
      console.log(res);
      //   表格数据
      let newarr;
      //   表格数据
      try {
        newarr = res['dataArray'];
      } catch (e) {}

      this.setState({
        listData: newarr,
      });
    });
  },
  onExtraClick() {
    this.setState({ inputvalue: '' });

    console.log('测试点击');
  },
  onOpenChange(...args) {
    console.log('sss');
    console.log(args);
    const { form } = this.props;
    const newvalue = this.state.allData;
    newvalue.name = '';
    newvalue.type = 0;
    newvalue.page = 1;
    newvalue.rk_id = ['a'];
    newvalue.project_name = '';
    // this.setState({
    //   allData: newvalue,
    // });
    this.asyncSetFieldProps(newvalue);

    this.setState({ showElem: 'inherit' });
  },
  habdlClick(item) {
    const { form } = this.props;

    let dtar = '';
    if (this.state.detdate === 'a1') {
      dtar = '劳务进度款结算-' + item.name;
    } else if (this.state.detdate === 'b1') {
      dtar = '劳务完工结算-' + item.name;
    } else if (this.state.detdate === 'c1') {
      dtar = '劳务质保金结算-' + item.name;
    } else if (this.state.detdate === 'd1') {
      dtar = '零星劳务结算-' + item.name;
    } else if (this.state.detdate === 'e1') {
      dtar = '劳务合同-' + item.name;
    }
    console.log(dtar);
    form.setFieldValue('LabourField', item.contract_name);
    this.setState({ inputvalue: dtar, showElem: 'none' });
    form.setFieldValue('TestLabour', dtar);
    form.setFieldExtendValue('TestLabour', dtar);
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
    if (!value) {
      const newData = this.state.allData;
      newData.name = value;
      this.asyncSetFieldProps(newData);
    }

    this.setState({ SearchBarvalue: value });
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestLabour');
    const label = form.getFieldProp('TestLabour', 'label');
    const required = form.getFieldProp('TestLabour', 'required');
    const placeholder = form.getFieldProp('TestLabour', 'placeholder');
    const tabs = [
      { title: '劳务进度款' },
      { title: '劳务完工' },
      { title: '劳务质保金' },
      { title: '零星劳务' },
      { title: '劳务合同' },
    ];

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
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
            this.setState({ detdate: 'a1' });
            let newpage = {
              defaultActiveKey: 'a',
              rk_id: ['a'],
              number: '1000',
              page: 1,
              name: '',
            };
            if (index === 0) {
              this.setState({ detdate: 'a1' });
              newpage.rk_id = ['a'];
            } else if (index === 1) {
              this.setState({ detdate: 'b1' });
              newpage.rk_id = ['b'];
            } else if (index === 2) {
              this.setState({ detdate: 'c1' });
              newpage.rk_id = ['c'];
            } else if (index === 3) {
              this.setState({ detdate: 'd1' });
              newpage.rk_id = ['d'];
            }
            this.setState({
              allData: newpage,
            });
            this.asyncSetFieldProps(newpage);
          }}
        ></Tabs>
        <List>
          {this.state.listData.map((item, index) => {
            return (
              <List.Item
                onClick={this.habdlClick.bind(this, item)}
                key={index}
                multipleLine
              >
                {item.name}/{item.extend_first}/{item.reply_money}
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
      <div className="CorpHouse_class_m">
        {' '}
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
                      <InputItem
                        readOnly
                        extra="x"
                        onExtraClick={this.onExtraClick}
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
      </div>
    );
  },
};

export default FormField;
