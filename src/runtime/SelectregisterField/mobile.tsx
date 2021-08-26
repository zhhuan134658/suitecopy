import React from 'react';
import { IFormField } from '../../types';
import { PickerView, InputItem, Picker, Modal, List } from 'antd-mobile';
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
      titleleis: [{ title: '', datacalue: '' }],
      project_name: '',
      contract_name: '',
      case_number: '',
      handler: '',
      handler_mobile: '',
    };
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
    }
  },

  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;

    const SelectregisterField = form.getFieldInstance('Selectregister');

    // const leaveReasonField = form.getFieldInstance('leaveReason');
    const key = SelectregisterField.getProp('id');
    // const value = SelectregisterField.getValue();
    const value = '1';

    // const extendValue = SelectregisterField.getExtendValue();
    const bizAsyncData = [
      {
        key,
        bizAlias: 'Selectregister',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['Selectregister'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        let newarr;
        console.log('weqweq', JSON.parse(res.dataList[0].value));

        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}

        this.setState({
          project_name: newarr.project_name,
          contract_name: newarr.contract_name,
          case_number: newarr.case_number,
          handler: newarr.handler,
          handler_mobile: newarr.handler_mobile,
        });
        form.setFieldValue('Selectregister', newarr);
        form.setExtendFieldValue('Selectregister', newarr);
      });
  },
  fieldRender() {
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('Selectregister');
    const label = form.getFieldProp('Selectregister', 'label');
    const required = form.getFieldProp('Selectregister', 'required');
    const placeholder = form.getFieldProp('Selectregister', 'placeholder');
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();
      const {
        project_name = '',
        contract_name = '',
        case_number = '',
        handler = '',
        handler_mobile = '',
      } = value;
      return (
        <div>
          <div className="field-wrapper">
            <div className="m-field-view">
              <label className="m-field-view-label">项目名称</label>
              <div className="m-field-view-value">
                {JSON.stringify(project_name)}
              </div>
            </div>
          </div>
          <div className="field-wrapper">
            <div className="m-field-view">
              <label className="m-field-view-label">合同</label>
              <div className="m-field-view-value">
                {JSON.stringify(contract_name)}
              </div>
            </div>
          </div>
          <div className="field-wrapper">
            <div className="m-field-view">
              <label className="m-field-view-label">案件编号</label>
              <div className="m-field-view-value">
                {JSON.stringify(case_number)}
              </div>
            </div>
          </div>
          <div className="field-wrapper">
            <div className="m-field-view">
              <label className="m-field-view-label">经办法官</label>
              <div className="m-field-view-value">
                {JSON.stringify(handler)}
              </div>
            </div>
          </div>
          <div className="field-wrapper">
            <div className="m-field-view">
              <label className="m-field-view-label">法官电话</label>
              <div className="m-field-view-value">
                {JSON.stringify(handler_mobile)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-mobile-input vertical">
                <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                  <label className="m-field-label">
                    <span>项目名称</span>
                  </label>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        clear
                        readOnly
                        value={this.state.project_name}
                        placeholder="点击选择"
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-mobile-input vertical">
                <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                  <label className="m-field-label">
                    <span>合同</span>
                  </label>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        clear
                        readOnly
                        value={this.state.contract_name}
                        placeholder="点击选择"
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-mobile-input vertical">
                <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                  <label className="m-field-label">
                    <span>案件编号</span>
                  </label>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        clear
                        readOnly
                        value={this.state.case_number}
                        placeholder="点击选择"
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-mobile-input vertical">
                <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                  <label className="m-field-label">
                    <span>经办法官</span>
                  </label>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        clear
                        readOnly
                        value={this.state.handler}
                        placeholder="点击选择"
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-mobile-input vertical">
                <div className="m-field-head" style={{ marginLeft: '-5px' }}>
                  <label className="m-field-label">
                    <span>法官电话</span>
                  </label>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        clear
                        readOnly
                        value={this.state.handler_mobile}
                        placeholder="点击选择"
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export default FormField;
