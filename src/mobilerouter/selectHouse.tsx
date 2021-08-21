import React from 'react';
import { IFormField } from '../../types';
import { PickerView, InputItem, Modal, List, Button } from 'antd-mobile';
import './mobile.less';

/**
 * 自定义控件运行态 Mobile 视图
 */
const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      allData: { type: '0', number: '99999', page: '1', name: '' },
      modalview: false,
      Inputvalue: '',
      listData: [],
    };
  },
  inputFocus() {
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({
      modalview: true,
    });
  },
  itemclick(item) {
    this.setState({
      modalview: false,
      Inputvalue: item.name,
    });
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    console.log(location.href);
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const SelectProField = form.getFieldInstance('SelectPro');
    const key = SelectProField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'SelectPro',
        extendValue: vlauedata,
        value,
      },
    ];
    // 入参和返回参考套件数据刷新集成接口文档
    spi
      .refreshData({
        modifiedBizAlias: ['SelectPro'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log(JSON.parse(res.listData[0].value));

        //   表格数据
        const newarr = JSON.parse(res.listData[0].value).data;

        this.setState({
          listData: [...newarr],
        });
      });
  },
  fieldRender() {
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('SelectPro');
    const label = form.getFieldProp('SelectPro', 'label');
    const required = form.getFieldProp('SelectPro', 'required');
    const placeholder = form.getFieldProp('SelectPro', 'placeholder');
    const season = [
      {
        label: '春',
        value: '春',
      },
      {
        label: '夏',
        value: '夏',
      },
    ];
    return (
      <div className="field-wrapper">
        <div className="label">
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}
          {label}
        </div>
        <InputItem value={this.state.Inputvalue} onFocus={this.inputFocus}>
          姓名
        </InputItem>
        <Modal
          popup
          visible={this.state.modalview}
          onClose={this.onClose('modalview')}
          animationType="slide-up"
        >
          {/* <List renderHeader={() => <div>项目名称</div>} className="popup-list">
            {this.state.listData.map((item, index) => (
              <List.Item key={index} onClick={this.itemclick.bind(this, item)}>
                {item}
              </List.Item>
            ))}
          </List> */}
        </Modal>
      </div>
    );
  },
};

export default FormField;
