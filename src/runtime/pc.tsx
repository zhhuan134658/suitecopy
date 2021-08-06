import find from 'lodash/find';
import get from 'lodash/get';
import { ISuiteRuntime } from '../types';
import './pc.less';

interface ISwapDemoSuite extends ISuiteRuntime {
  formDataLinkagehandler: () => void;
  asyncSetFieldProps: () => void;
  formDataWatch: () => void;
}

const SwapDemoSuite: ISwapDemoSuite = {
  suiteDidMount() {
    const { form } = this.props;

    // const hiddenReason = form.getSuiteProp('hiddenReason');
    form.setFieldValue('DateFielddate', new Date().toLocaleDateString());
    const IsAutoOutExtendValue = form.getFieldExtendValue('IsAutoOut');
    const outPeopleField = form.getFieldInstance('outPeople');
    console.log(IsAutoOutExtendValue);
    if (IsAutoOutExtendValue?.key === 'option_2') {
      outPeopleField.hide();
    }

    this.formDataLinkagehandler();
    // this.asyncSetFieldProps();
    this.formDataWatch();
  },
  //监听值
  formDataWatch() {
    const { form } = this.props;

    //出库人是否隐藏
    const outPeopleField = form.getFieldInstance('outPeople');

    form.onFieldExtendValueChange('IsAutoOut', extendValue => {
      console.log(extendValue);
      if (extendValue.key === '2') {
        outPeopleField.hide();
      } else {
        outPeopleField.show();
      }
    });
    //监听物资选择
    // form.onFieldExtendValueChange('incomeMingxi', extendValue => {
    //   console.log(`当前输入文本值2：${extendValue}`);
    // });
    // form.onFieldValueChange('incomeMingxi', value => {
    //   console.log(`当前输入文本值3：${value}`);
    // });
  },
  // 关联选项
  formDataLinkagehandler() {
    // const { form } = this.props;
    // const leaveTypeField = form.getFieldInstance('leaveType');
    // const leaveReasonField = form.getFieldInstance('leaveReason');
    // leaveTypeField.onExtendValueChange(option => {
    //   if (option.key === 'option_2') {
    //     leaveReasonField.show();
    //   } else {
    //     leaveReasonField.hide();
    //   }
    // });
  },

  // 动态获取业务数据
  asyncSetFieldProps() {
    const { form, spi } = this.props;
    const leaveTypeField = form.getFieldInstance('leaveType');
    const leaveReasonField = form.getFieldInstance('leaveReason');

    const value = leaveTypeField.getValue();
    const extendValue = leaveTypeField.getExtendValue();
    const key = leaveTypeField.getProp('id');
    const bizAsyncData = [
      {
        key,
        bizAlias: 'leaveType',
        extendValue,
        value,
      },
    ];

    spi
      .refreshData({
        modifiedBizAlias: ['leaveReason'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        const leaveReasonData = find(
          res.dataList,
          item => item.bizAlias === 'leaveReason',
        );
        const show = get(leaveReasonData, 'props.invisible');
        if (show) {
          leaveReasonField.show();
        } else {
          leaveReasonField.hide();
        }
      });
  },
};

export default SwapDemoSuite;
