import { Pagination } from 'antd';
import { Tree } from 'antd';
const { DirectoryTree } = Tree;
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Table,
  Tooltip,
  notification,
  Modal,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
  Cascader,
} from 'antd';
const { Search } = Input;
import { IFormField } from '../../types';
const { Column } = Table;
import { FormInstance } from 'antd/lib/form';

import './pc.less';

/**
 * 自定义控件运行态 PC 视图
 */
const FormField: ISwapFormField = {
  getInitialState() {
    const { form } = this.props;

    return {
      options: [],
      //   Inputvalue: '123',
      current_page: '', //当前页
      total2: '',
      allData: { type: '0', number: '10', page: '1', name: '' },
      isModalVisible: false,
      listData: [],
      project_name: '',
      contract_name: '',
      case_number: '',
      handler: '',
      handler_mobile: '',
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    const newdate = this.state.allData;
    this.asyncSetFieldProps(newdate);
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
        //   表格数据
        try {
          newarr = JSON.parse(res?.dataList[0]?.value).data;
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
    console.log('qqqqqq', this.props);
    const { viewMode } = runtimeProps;
    console.log('qqqqqq', viewMode);

    const field = form.getFieldInstance('Selectregister');
    console.log('qqqqqq', field);
    const label = form.getFieldProp('Selectregister', 'label');
    const required = form.getFieldProp('Selectregister', 'required');
    const placeholder = form.getFieldProp('Selectregister', 'placeholder');
    const { dataSource, selectedRowKeys } = this.state;

    // 详情页
    if (viewMode) {
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
          <div className="label">项目名称</div>
          {JSON.stringify(project_name)}
          <div className="label">合同</div>
          {JSON.stringify(contract_name)}
          <div className="label">案件编号</div>
          {JSON.stringify(case_number)}
          <div className="label">经办法官</div>
          {JSON.stringify(handler)}
          <div className="label">法官电话</div>
          {JSON.stringify(handler_mobile)}
        </div>
      );
    }

    return (
      <div className="pc-custom-field-wrap">
        <div className="label">
          {' '}
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          项目名称
        </div>
        <div>
          <Input
            readOnly
            value={this.state.project_name}
            onClick={this.handleAdd}
            placeholder="请选择合同"
          />
        </div>
        <div className="label">
          {' '}
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          合同
        </div>
        <div>
          <Input
            readOnly
            value={this.state.contract_name}
            onClick={this.handleAdd}
            placeholder="请选择合同"
          />
        </div>
        <div className="label">
          {' '}
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          案件编号
        </div>
        <div>
          <Input
            readOnly
            value={this.state.case_number}
            onClick={this.handleAdd}
            placeholder="请选择合同"
          />
        </div>
        <div className="label">
          {' '}
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          经办法官
        </div>
        <div>
          <Input
            readOnly
            value={this.state.handler}
            onClick={this.handleAdd}
            placeholder="请选择合同"
          />
        </div>
        <div className="label">
          {' '}
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          法官电话
        </div>
        <div>
          <Input
            readOnly
            value={this.state.handler_mobile}
            onClick={this.handleAdd}
            placeholder="请选择合同"
          />
        </div>
      </div>
    );
  },
};

export default FormField;
