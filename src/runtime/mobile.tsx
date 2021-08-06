import { ISuiteRuntime } from '../types';
import './mobile.less';

interface ISwapDemoSuite extends ISuiteRuntime {
  formDataLinkagehandler: () => void;
}

const SwapDemoSuite: ISwapDemoSuite = {
  suiteDidMount() {
    const { form } = this.props;
    const hiddenReason = form.getSuiteProp('hiddenReason');

    if (hiddenReason) {
      form.getFieldInstance('leaveReason').hide();
    }

    this.formDataLinkagehandler();
  },

  // 关联选项
  formDataLinkagehandler() {
    const { form } = this.props;
    const leaveTypeField = form.getFieldInstance('leaveType');
    const leaveReasonField = form.getFieldInstance('leaveReason');

    leaveTypeField.onExtendValueChange(option => {
      if (option.key === 'option_2') {
        leaveReasonField.show();
      } else {
        leaveReasonField.hide();
      }
    });
  },
};

export default SwapDemoSuite;
