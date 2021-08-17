import { ISuiteRuntime } from '../types';
import './mobile.less';

interface ISwapDemoSuite extends ISuiteRuntime {
  formDataLinkagehandler: () => void;
}

const SwapDemoSuite: ISwapDemoSuite = {
  suiteDidMount() {},

  // 关联选项
};

export default SwapDemoSuite;
