// 选择项目
// import React from 'react';
// import { Input } from 'antd';
// import { IFormField } from '../../types';

// import './pc.less';

// interface ISwapFormField extends IFormField {
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// /**
//  * 自定义控件运行态 PC 视图
//  */
// const FormField: ISwapFormField = {
//   handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { form } = this.props;
//     form.setFieldValue('PositionDes', e.target.value);
//   },

//   fieldRender() {
//     const { form } = this.props;
//     const field = form.getFieldInstance('PositionDes');
//     const label = form.getFieldProp('PositionDes', 'label');
//     const placeholder = form.getFieldProp('PositionDes', 'placeholders');

//     return (
//       <div className="pc-custom-field-wrap">
//         <div className="label">{label}</div>
//         {field.getProp('viewMode') ? (
//           field.getValue()
//         ) : (
//           <Input placeholder={placeholder} onChange={this.handleChange} />
//         )}
//       </div>
//     );
//   },
// };

// export default Fo,rmField;
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
    };
  },
  /** 控件首次渲染完成之后 */
  fieldDidMount() {
    const newdate = this.state.allData;
    this.asyncSetFieldProps(newdate);
  },

  //   onClick() {
  //     const newdate = this.state.allData;
  //     this.asyncSetFieldProps(newdate);
  //   },
  onChangevalue(value, selectedOptions) {
    const { form } = this.props;

    let desData = { Optionsid: '', Optionsname: '' };

    desData.Optionsid =
      selectedOptions[0].value +
      '/' +
      selectedOptions[1].value +
      '/' +
      selectedOptions[2].value;
    desData.Optionsname =
      selectedOptions[0].label +
      '/' +
      selectedOptions[1].label +
      '/' +
      selectedOptions[2].label;

    console.log(desData, value);
    form.setFieldValue('PositionDes', desData);
    form.setExtendFieldValue('PositionDes', {
      data: desData,
    });
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
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res?.dataList[0]?.value).data;
        } catch (e) {}

        this.setState({
          options: [...newarr],
          current_page: JSON.parse(res.dataList[0].value).page,
          total2: JSON.parse(res.dataList[0].value).count,
        });
      });
  },

  fieldRender() {
    const { form, runtimeProps } = this.props;
    console.log('qqqqqq', this.props);
    const { viewMode } = runtimeProps;
    console.log('qqqqqq', viewMode);

    const field = form.getFieldInstance('PositionDes');
    console.log('qqqqqq', field);
    const label = form.getFieldProp('PositionDes', 'label');
    const required = form.getFieldProp('PositionDes', 'required');
    const placeholder = form.getFieldProp('PositionDes', 'placeholder');
    const { dataSource, selectedRowKeys } = this.state;

    // 详情页
    if (viewMode) {
      const value = field.getValue();
      const { Optionsname = '' } = value;
      return (
        <div>
          <div className="label">{label}</div>
          <div style={{ marginTop: '10px' }}>{Optionsname}</div>
        </div>
      );
    }

    return (
      <div className="pc-custom-field-wrap">
        <div className="label">
          {required ? (
            <span style={{ color: '#ea6d5c' }}>*</span>
          ) : (
            <span style={{ color: '#fff' }}>*</span>
          )}{' '}
          {label}
        </div>

        <div>
          <Cascader
            options={this.state.options}
            onChange={this.onChangevalue}
            placeholder="请选择"
          />
        </div>
      </div>
    );
  },
};

export default FormField;
