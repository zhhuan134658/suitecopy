import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  DatePicker,
  Switch,
  InputItem,
  Drawer,
  List,
  NavBar,
  Icon,
  SearchBar,
  Button,
  WhiteSpace,
  WingBlank,
} from 'antd-mobile';
import { Tree } from 'antd';
import './mobile.less';
const Item = List.Item;

/**
 * 自定义控件运行态 Mobile 视图
 */
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      isShow: false,
      petty_sele: '',
      Numbervalue1: '',
      Numbervalue2: '',
      Housetype: '',
      treevalue: undefined,
      checked: false,
      deColumns: [
        {
          title: '费用科目',
          dataIndex: 'ke_name',
        },
        {
          title: '金额',
          dataIndex: 'money',
        },
        {
          title: '备注',
          dataIndex: 'remarks',
        },
      ],
      treeData: [
        {
          title: 'parent 0',
          key: '0-0',
          children: [
            { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
            { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
          ],
        },
        {
          title: 'parent 1',
          key: '0-1',
          children: [
            { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
            { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
          ],
        },
      ],
      Inputmoney1: '',
      date: now,
      checkindex: '',
      SearchBarvalue: '',
      showElem: 'none',
      showElem2: 'none',
      inputvalue: '',
      Inputvaluein: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      materialList: [
        {
          ke_name: '企业管理费',
          money: '',
          remarks: '',
        },
      ],
      sonData: {
        ke_name: '企业管理费',
        money: '',
        remarks: '',
      },
    };
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    vlauedata.petty_sele = this.state.petty_sele;

    const TestExpeField = form.getFieldInstance('TestExpe');
    const key = TestExpeField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestExpe',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestExpe'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}

        this.setState({
          listData: [...newarr],
        });
        //   树状图数据
        this.setState({
          Numbervalue1: newarr,
        });
      });
  },
  chhandleAdd(val) {
    const newdate = this.state.allData;
    newdate.isHouse = '1';
    console.log(val);
    this.setState({
      showElem: 'inherit',
      Housetype: val,
    });

    this.asyncSetFieldProps(newdate, '1');
  },
  onOpenChange(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem: 'inherit', checkindex: index });
  },
  onOpenChange2(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem2: 'inherit', checkindex: index });
  },
  habdlClick(item: { name: any; size: any; unit: any }) {
    const { form } = this.props;
    console.log(item);
    if (this.state.Housetype === 'out') {
      this.setState({
        Inputvalue: item.name,
        showElem: 'none',
      });
    } else if (this.state.Housetype === 'in') {
      this.setState({
        Inputvaluein: item.name,
        showElem: 'none',
      });
    }

    form.setFieldValue('TestExpe', item.name);
    form.setExtendFieldValue('TestExpe', {
      data: item.name,
    });
  },

  onCancel() {
    this.setState({ showElem: 'none' });
  },

  onSubmit(value) {
    const newdate = this.state.allData;
    newdate.name = value;

    this.asyncSetFieldProps(newdate);
  },
  onSearchBarChange(value) {
    this.setState({ SearchBarvalue: value });
  },
  //增加明细
  addSon() {
    this.setState({
      materialList: [...this.state.materialList, this.state.sonData],
    });
  },
  //删除明细
  deleteItem(index) {
    let list = this.state.materialList;
    list.splice(index, 1);
    this.setState({
      materialList: list,
    });
  },
  //更新数据
  onInputchange(types, index, e) {
    console.log(types, index, e, this);
    let arr = this.state.materialList;
    console.log(this.state.materialList);
    // let arrindex = e.target.value;
    let arrindex = e;
    let newindex = index;
    let newtype = types;
    // arr[newindex] = {};
    arr[newindex][newtype] = arrindex;
    //   含税金额
    let newarr2 = [];

    newarr2 = arr.filter(item => {
      if (item.money) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.money;
    });
    this.setState({
      materialList: [...arr],
      Inputmoney1: eval(newarr2.join('+')),
    });
    console.log(arr);
  },
  switchonChange() {
    console.log(this.state.checked);
    if (this.state.checked == false) {
      this.setState({
        isShow: true,
        petty_sele: '是',
      });
      const newdate = this.state.allData;
      newdate.rk_id = ['是'];

      this.asyncSetFieldProps(newdate);
    } else {
      this.setState({
        isShow: false,
        petty_sele: '否',
      });
    }
    this.setState({
      checked: !this.state.checked,
    });
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');
      const aaadata = this.state.Inputmoney1;
      const aaadata1 = this.state.Numbervalue1;
      this.setState({
        Numbervalue2: aaadata - aaadata1,
      });

      let editData = {
        hanmoney: '',
        nomoney: '',
        detailedData: [], //物资明细
        petty_sele: '', //备用金抵扣
        Numbervalue1: '', //备用金余额
        Numbervalue2: '', //折扣后合计
      };
      editData.detailedData = this.state.dataSource;
      editData.petty_sele = this.state.petty_sele;
      editData.Numbervalue1 = this.state.Numbervalue1;
      editData.Numbervalue2 = this.state.Numbervalue2;
      const { form } = this.props;
      form.setFieldValue('TestExpe', editData);
      form.setExtendFieldValue('TestExpe', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const field = form.getFieldInstance('TestExpe');
    const { viewMode } = runtimeProps;
    const required = form.getFieldProp('TestExpe', 'required');
    const label = form.getFieldProp('TestExpe', 'label');

    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();

      const { warehouse = '', warehousein = '', detailedData = [] } = value;
      return (
        <div className="field-wrapper">
          <div className="tablefield-mobile">
            <div className="tbody-row-wrap">
              {detailedData.map((item, index) => {
                return (
                  <div className="row">
                    <label className="label row-label-title">
                      {label}明细({index + 1})
                    </label>
                    {this.state.deColumns.map((itemname, indexname) => {
                      return (
                        <div>
                          <div className="field-wrapper">
                            <div className="m-field-view">
                              <label className="m-field-view-label">
                                {itemname.title}
                              </label>
                              <div className="m-field-view-value">
                                <span>{item[itemname.dataIndex]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="field-wrapper">
        <div className="tablefield-mobile">
          <div className="table-body  tbody  ">
            {this.state.materialList.map((item, index) => {
              return (
                <div>
                  <div className="tbody-row-wrap">
                    <div className="tbody-row-pannel">
                      <div
                        className="custom-list-title"
                        style={{
                          width: '100%',
                          paddingLeft: '15px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          {label}-明细({index + 1})
                        </div>
                        {this.state.materialList.length > 1 ? (
                          <div
                            className="dele_item"
                            onClick={this.deleteItem.bind(this, index)}
                          >
                            删除
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className="row">
                        <div>
                          <div className="field-wrapper">
                            <div className="m-group m-group-mobile">
                              <div className="m-field-wrapper">
                                <div className="m-field m-field-mobile m-select-field">
                                  <div className="m-field-head">
                                    <div className="m-field-label">
                                      <span>费用科目</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.ke_name}
                                          placeholder="点击选择"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="field-wrapper">
                            <div className="m-group m-group-mobile">
                              <div className="m-field-wrapper">
                                <div className="m-field m-field-mobile m-select-field">
                                  <div className="m-field-head">
                                    <div className="m-field-label">
                                      <span>金额</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.money}
                                          placeholder="请输入"
                                          onChange={e =>
                                            this.onInputchange(
                                              'money',
                                              index,
                                              e,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="field-wrapper">
                            <div className="m-group m-group-mobile">
                              <div className="m-field-wrapper">
                                <div className="m-field m-field-mobile m-select-field">
                                  <div className="m-field-head">
                                    <div className="m-field-label">
                                      <span>备注</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          type="text"
                                          readOnly
                                          className="ant-input m-mobile-inner-input"
                                          value={item.remarks}
                                          placeholder="点击选择"
                                          onChange={e =>
                                            this.onInputchange(
                                              'remarks',
                                              index,
                                              e,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="table-actions">
              <div className="tbody-add-button tTap" onClick={this.addSon}>
                <img
                  style={{ width: '20px' }}
                  src="https://dingyunlaowu.oss-cn-hangzhou.aliyuncs.com/xiezhu//Em46p8naW61629791119284.png"
                  alt=""
                />
                &nbsp;
                <span className="add-button-text">增加明细</span>
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-select-field">
                <div className="m-field-head">
                  <div className="m-field-label">
                    <span>报销合计</span>
                  </div>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        value={this.state.Inputmoney1}
                        placeholder="请输入"
                        readOnly
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
              <div className="m-field m-field-mobile m-select-field">
                <div className="m-field-head">
                  <div className="m-field-label">
                    <span>备用金抵扣</span>
                  </div>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <Switch
                        checked={this.state.checked}
                        onChange={this.switchonChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {this.state.isShow ? (
            <div>
              <div className="field-wrapper">
                <div className="m-group m-group-mobile">
                  <div className="m-field-wrapper">
                    <div className="m-field m-field-mobile m-select-field">
                      <div className="m-field-head">
                        <div className="m-field-label">
                          <span>备用金余额</span>
                        </div>
                      </div>
                      <div className="m-field-box">
                        <div className="m-field-content left">
                          <div className="input-wrapper">
                            <InputItem
                              value={this.state.Numbervalue1}
                              placeholder="请输入"
                              readOnly
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
                    <div className="m-field m-field-mobile m-select-field">
                      <div className="m-field-head">
                        <div className="m-field-label">
                          <span>折扣后合计</span>
                        </div>
                      </div>
                      <div className="m-field-box">
                        <div className="m-field-content left">
                          <div className="input-wrapper">
                            <InputItem
                              value={this.state.Numbervalue2}
                              placeholder="请输入"
                              readOnly
                            ></InputItem>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
};

export default FormField;
