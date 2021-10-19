import React from 'react';
import { IFormField } from '../../types';
import { PickerView, Picker, Modal, List } from 'antd-mobile';
import arrayTreeFilter from 'array-tree-filter';

import './mobile.less';

/**
 * 自定义控件运行态 Mobile 视图
 */

const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      pickerValuedata: '',
      pickerValue: [],
      visible: false,
      value: null,
      province: [],
      modal2: false,
      SearchBarvalue: '',
      showElem: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
    };
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
    }
  },
  sublisk() {
    const newdate = this.state.allData;
    this.asyncSetFieldProps(newdate);
    this.setState({ visible: true });
  },
  onOk() {
    this.setState({ visible: false });
  },
  onPickerChange(value) {
    const { form } = this.props;
    this.setState({ pickerValue: value });
    const valuedata = this.state.pickerValue;
    let desData = { Optionsid: '', Optionsname: '' };
    if (!value) {
      this.setState({ pickerValuedata: '' }, () => {
        form.setFieldValue('PositionDes', desData);
        form.setExtendFieldValue('PositionDes', {
          data: desData,
        });
      });
    } else {
      const treeChildren = arrayTreeFilter(
        this.state.province,
        (c, level) => c.value === value[level],
      );
      const newdata = treeChildren.map(v => v.label).join('/');
      desData.Optionsid = value;
      desData.Optionsname = newdata;
      this.setState({ pickerValuedata: newdata }, () => {
        form.setFieldValue('PositionDes', desData);
        form.setExtendFieldValue('PositionDes', {
          data: desData,
        });
      });
    }
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;

    const PositionDesField = form.getFieldInstance('PositionDes');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = PositionDesField.getProp('id');
    // const value = PositionDesField.getValue();
    const value = '1';

    // const extendValue = PositionDesField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'PositionDes',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['PositionDes'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log('weqweq111111111111111111', res);
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}

        this.setState({
          province: [...newarr],
          current_page: JSON.parse(res.dataList[0].value).page,
          total2: JSON.parse(res.dataList[0].value).count,
        });
      });
  },
  fieldRender() {
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('PositionDes');
    const label = form.getFieldProp('PositionDes', 'label');
    const required = form.getFieldProp('PositionDes', 'required');
    const placeholder = form.getFieldProp('PositionDes', 'placeholder');
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();
      const { Optionsname = '' } = value;
      return (
        <div className="field-wrapper">
          <div className="m-field-view">
            <label className="m-field-view-label">{label}</label>
            <div className="m-field-view-value">
              {/* {JSON.stringify(Optionsname)} */}
              {Optionsname}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="CorpHouse_class_m">
        <Picker
          visible={this.state.visible}
          data={this.state.province}
          value={this.state.pickerValue}
          onChange={this.onPickerChange}
          onOk={this.onOk}
          onDismiss={() => this.setState({ visible: false })}
        >
          <div className="field-wrapper">
            <div className="m-group m-group-mobile">
              <div className="m-field-wrapper">
                <div className="m-field m-field-mobile m-mobile-input vertical">
                  <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                    <label className="m-field-label">
                      <span>{label}</span>
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
                          value={this.state.pickerValuedata}
                          onClick={this.sublisk}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Picker>
      </div>
    );
  },
};

export default FormField;
