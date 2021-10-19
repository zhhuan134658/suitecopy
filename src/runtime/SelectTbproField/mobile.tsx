import React from 'react';
import { IFormField } from '../../types';

import './mobile.less';

/**
 * 自定义控件运行态 Mobile 视图
 */
const FormField: IFormField = {
  fieldRender() {
    // 如果不需要定制视图 这里直接return null即可 引擎会默认识别children进行渲染
    // return null;
    // 定制渲染
    return (
      <div className="CorpHouse_class_m">
        <div className="field-wrapper"></div>
      </div>
    );
  },
};

export default FormField;
