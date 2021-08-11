import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const SwapCustomSetter = {
  // setter内state变量
  // 生命周期方法中可通过this.setState({})改变setter的
  getInitialState() {
    return {
      OSSData: {},
    };
  },
  async componentDidMount() {
    await this.init();
  },

  init: async () => {
    try {
      const OSSData = await this.mockGetOSSData();

      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  },
  // Mock get OSS api
  // https://help.aliyun.com/document_detail/31988.html
  // Mock get OSS api
  // https://help.aliyun.com/document_detail/31988.html
  mockGetOSSData: () => ({
    dir: 'user-dir/',
    expire: '1577811661',
    host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  }),

  onChange: ({ fileList }) => {
    const { onChange } = this.props;
    console.log('Aliyun OSS:', fileList);
    if (onChange) {
      onChange([...fileList]);
    }
  },

  onRemove: file => {
    const { value, onChange } = this.props;

    const files = value.filter(v => v.url !== file.url);

    if (onChange) {
      onChange(files);
    }
  },

  getExtraData: file => {
    const { OSSData } = this.state;

    return {
      key: file.url,
      OSSAccessKeyId: OSSData.accessId,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  },

  beforeUpload: async file => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;

    if (expire < Date.now()) {
      await this.init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = OSSData.dir + filename;

    return file;
  },

  /** setter控件渲染 */
  fieldRender() {
    const { form, runtimeProps } = this.props;

    const { viewMode } = runtimeProps;

    const field = form.getFieldInstance('AntdUpload');

    const label = form.getFieldProp('AntdUpload', 'label');
    const required = form.getFieldProp('AntdUpload', 'required');
    const placeholder = form.getFieldProp('AntdUpload', 'placeholder');

    const { value } = this.props;
    const props = {
      name: 'file',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      onRemove: this.onRemove,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div className="pc-custom-field-wrap">
        <div className="label">
          {label}
          <Form labelCol={{ span: 4 }}>
            <Form.Item label="Photos" name="photos">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  },
};

export default SwapCustomSetter;
