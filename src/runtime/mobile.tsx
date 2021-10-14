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
    // form.setFieldValue('DateFielddate', new Date().toLocaleDateString());
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
    //监听项目类型
    const SelectHeField = form.getFieldInstance('SelectHe');

    form.onFieldExtendValueChange('RadioField', extendValue => {
      console.log('sdasdasdsads11111111', extendValue);
      console.log(SelectHeField);
      if (
        extendValue.label == '投标保证金支出' ||
        extendValue.label == '投标保证金退回'
      ) {
        SelectHeField.hide();
        const newdate = { isProject: '' };
        newdate.isProject = '2';
        this.asyncSetFieldProps(newdate, 'Selectbaopro');
      } else {
        SelectHeField.show();
        const newdate = { isProject: '' };
        newdate.isProject = '1';
        this.asyncSetFieldProps(newdate, 'Selectbaopro');
      }
    });
    form.onFieldExtendValueChange('Autoprobei', extendValue => {
      console.log('sdasdasdsads111112222111', extendValue);
      const newdate = { project_name: '' };
      try {
        newdate.project_name = extendValue.label;
        this.asyncSetFieldProps(newdate, 'Autoprobei');
        console.log('sdasdasdsads11111244442111', extendValue);
      } catch (e) {
        form.setFieldValue('Ljjiemoney', '');
        form.setFieldValue('Ljhuanmoney', '');
        form.setFieldValue('Beimoneyyu', '');
        form.setFieldValue('MoneyFeidk', '');
        form.setFieldValue('MoneyFeigh', '');
        console.log('343');
      }

      //   newdate.project_name = extendValue.label;
      //   this.asyncSetFieldProps(newdate, 'Autoprobei');
    });
  },
  // 关联选项
  formDataLinkagehandler() {},

  // 动态获取业务数据
  asyncSetFieldProps(vlauedata: any, apiname) {
    const { form, spi } = this.props;
    const SelectbaoproField = form.getFieldInstance(apiname);
    const key = SelectbaoproField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: apiname,
        extendValue: vlauedata,
        value,
      },
    ];
    spi
      .refreshData({
        modifiedBizAlias: [apiname], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        let newarr;
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}
        if (apiname == 'Selectbaopro') {
          form.setFieldProp(apiname, 'options', newarr);
        } else if (apiname == 'Autoprobei') {
          console.log(newarr);
          form.setFieldValue('Ljjiemoney', newarr.lj_jie);
          form.setFieldValue('Ljhuanmoney', newarr.lj_huan);
          form.setFieldValue('Beimoneyyu', newarr.bei_yu);
          form.setFieldValue('MoneyFeidk', newarr.fybx_dk_spz);
          form.setFieldValue('MoneyFeigh', newarr.re_money_spz);
        }
      });
  },
};

export default SwapDemoSuite;
