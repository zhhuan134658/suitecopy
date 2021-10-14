import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  DatePicker,
  InputItem,
  Drawer,
  List,
  NavBar,
  Icon,
  Switch,
  SearchBar,
  Button,
  WhiteSpace,
  WingBlank,
  Toast,
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
      Inputmoney1: '',
      checked: false,
      treevalue: undefined,
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
      treeData: [],
      maxnum: '',
      date: now,
      checkindex: '',
      SearchBarvalue: '',
      showElem: 'none',
      showElem2: 'none',
      inputvalue: '',
      Numbervalue1: '',
      Numbervalue2: '',
      Numbervalue3: '',
      Numbervalue4: '',
      Numbervalue5: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      petty_sele: '否',
      materialList: [
        {
          ke_name: '',
          money: '',
          remarks: '',
        },
      ],
    };
  },
  asyncSetFieldProps(vlauedata, type) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    vlauedata.petty_sele = this.state.petty_sele;
    // vlauedata.petty_yu = this.state.Numbervalue1;
    // vlauedata.project_name = this.state.Numbervalue2;
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
        console.log(JSON.parse(res.dataList[0].value));
        //   表格数据
        let newarr;
        //   表格数据
        try {
          newarr = JSON.parse(res.dataList[0].value).data;
        } catch (e) {}

        if (type == '12') {
          var menuId = [];
          var len = newarr.length;
          for (var i = 0; i < len; i++) {
            var item = newarr[i];
            if (item.children && item.children.length != 0) {
              var children = item.children;
              for (var j = 0; j < children.length; j++) {
                newarr[len + j] = children[j];
              }
              len = newarr.length;
            }
            menuId.push(item);
          }
          var add = menuId.filter(item => {
            if (!item.children) {
              return item;
            }
          });
          this.setState({
            listData: add,
          });
          console.log('2222222', add);
        } else if (type == '11') {
          this.setState({
            Numbervalue1: Number(newarr.sy),
            Numbervalue3: Number(newarr.fybx_dk_spz),
            Numbervalue4: Number(newarr.re_money_spz),
            maxnum:
              Number(newarr.sy) -
              Number(newarr.fybx_dk_spz) -
              Number(newarr.re_money_spz),
          });
        }

        //   树状图数据
        // const newtarr = JSON.parse(res.dataList[0].extendValue);
        // const newtarr1 = [
        //   {
        //     title: '物资类型',
        //     key: '0',
        //     children: newtarr,
        //   },
        // ];
        // this.setState({
        //   treeData: [...newtarr1],
        // });
      });
  },
  onOpenChange(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;
    newdate.rk_id = ['a'];
    this.asyncSetFieldProps(newdate, '12');
    this.setState({ showElem: 'inherit', checkindex: index });
  },
  onOpenChange2(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate);
    this.setState({ showElem2: 'inherit', checkindex: index });
  },
  habdlClick(item: { value: any }) {
    const { form } = this.props;
    console.log(item);
    let arr = this.state.materialList;
    let arrindex = this.state.checkindex;

    arr[arrindex].ke_name = item.value;

    this.setState(
      { inputvalue: item.value, showElem: 'none', materialList: arr },
      () => {
        form.setFieldValue('TestExpe', item.value);
        form.setExtendFieldValue('TestExpe', {
          data: item.value,
        });
      },
    );
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
    var sonData = {
      ke_name: '',
      money: '',
      remarks: '',
    };
    this.setState({
      materialList: [...this.state.materialList, sonData],
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
      Inputmoney1: eval(newarr2.join('+')).toFixed(2),
    });
    console.log(arr);
  },
  onDatechange(types, index, dateString) {
    // let arr = this.state.materialList;
    // let purchase_riqi = 'purchase_riqi';
    // arr[index][purchase_riqi] = dateString;
    // this.setState({ materialList: [...arr] });
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');
      let editData = {
        hanmoney: '',
        nomoney: '',
        detailedData: [], //物资明细
        petty_sele: '', //备用金抵扣
        Numbervalue1: '', //备用金余额
        Numbervalue2: '', //本次抵扣金额
        Numbervalue3: '', //审批中的费用报销抵扣
        Numbervalue4: '', //审批中的归还
        Numbervalue5: '', //财务应支付金额
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = this.state.Inputmoney1;
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = this.state.Inputmoney2;
      }

      editData.detailedData = this.state.materialList;
      editData.petty_sele = this.state.petty_sele;
      editData.Numbervalue1 = this.state.Numbervalue1;
      editData.Numbervalue2 = this.state.Numbervalue2;
      editData.Numbervalue3 = this.state.Numbervalue3;
      editData.Numbervalue4 = this.state.Numbervalue4;
      editData.Numbervalue5 = this.state.Numbervalue5;
      const { form } = this.props;
      form.setFieldValue('TestExpe', editData);
      form.setExtendFieldValue('TestExpe', {
        data: editData,
      });
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestExpe');
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestExpe', 'label');
    const onSelect = (selectedKeys: React.Key[], info: any) => {
      let arr = this.state.materialList;
      let newindex = this.state.checkindex;
      arr[newindex].ke_name = info.node.title;
      this.setState({ showElem2: 'none', materialList: [...arr] });
      const treedata = { type: selectedKeys[0], number: '10', page: '1' };
      this.setState({
        allData: treedata,
      });
      this.asyncSetFieldProps(treedata);
      console.log('selected', selectedKeys, info.node.title);
    };

    const onCheck = (checkedKeys: React.Key[], info: any) => {
      console.log('onCheck', checkedKeys, info);
    };
    const sidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          showCancelButton
          onCancel={() => this.setState({ showElem: 'none' })}
        />

        <List>
          {this.state.listData.map((item, index) => {
            return (
              <List.Item
                onClick={this.habdlClick.bind(this, item)}
                key={index}
                multipleLine
              >
                {item.value}
              </List.Item>
            );
          })}
        </List>
      </div>
    );
    const treesidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          onCancel={() => this.setState({ showElem2: 'none' })}
          showCancelButton
        />

        <Tree onSelect={onSelect} treeData={this.state.treeData} />
      </div>
    );
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();

      const {
        hanmoney = '',
        detailedData = [],
        petty_sele = '',
        Numbervalue1 = '',
        Numbervalue2 = '',
        Numbervalue3 = '',
        Numbervalue4 = '',
      } = value;
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
                      if (!item[itemname.dataIndex]) {
                        return null;
                      }
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
          <div className="m-field-view">
            <label className="m-field-view-label">备用金抵扣</label>
            <div className="m-field-view-value"> {petty_sele}</div>
          </div>{' '}
          <div className="m-field-view">
            <label className="m-field-view-label">备用金余额</label>
            <div className="m-field-view-value"> {Numbervalue1}</div>
          </div>{' '}
          <div className="m-field-view">
            <label className="m-field-view-label">本次抵扣金额</label>
            <div className="m-field-view-value"> {Numbervalue2}</div>
          </div>
          <div className="m-field-view">
            <label className="m-field-view-label">审批中的费用报销抵扣</label>
            <div className="m-field-view-value"> {Numbervalue3}</div>
          </div>{' '}
          <div className="m-field-view">
            <label className="m-field-view-label">审批中的归还</label>
            <div className="m-field-view-value"> {Numbervalue4}</div>
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
                                          editable={false}
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.ke_name}
                                          placeholder="请选择"
                                          onClick={this.onOpenChange.bind(
                                            this,
                                            index,
                                          )}
                                          onChange={e =>
                                            this.onInputchange(
                                              'ke_name',
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
                                          className="ant-input m-mobile-inner-input"
                                          value={item.remarks}
                                          placeholder="请输入"
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
                <span className="add-button-text">增加1明细</span>
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
                            type="text"
                            className="ant-input m-mobile-inner-input"
                            value={this.state.Inputmoney1}
                            placeholder="自动获取"
                            readOnly
                            editable={false}
                          />
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
                          <span>备用金抵扣</span>
                        </div>
                      </div>
                      <div className="m-field-box">
                        <div className="m-field-content left">
                          <div className="input-wrapper">
                            <Switch
                              checked={this.state.checked}
                              onChange={checked => {
                                console.log(checked);
                                if (checked == false) {
                                  this.setState({
                                    petty_sele: '否',
                                  });
                                } else {
                                  this.setState({
                                    petty_sele: '是',
                                  });
                                  const newdate = this.state.allData;
                                  newdate.rk_id = ['是'];
                                  this.asyncSetFieldProps(newdate, '11');
                                }

                                this.setState({
                                  checked: !this.state.checked,
                                });
                              }}
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
              {this.state.checked ? (
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
                                  type="text"
                                  className="ant-input m-mobile-inner-input"
                                  value={this.state.Numbervalue1}
                                  placeholder="自动获取"
                                  readOnly
                                  editable={false}
                                />
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
                              <span>审批中的费用报销抵扣</span>
                            </div>
                          </div>
                          <div className="m-field-box">
                            <div className="m-field-content left">
                              <div className="input-wrapper">
                                <InputItem
                                  type="text"
                                  className="ant-input m-mobile-inner-input"
                                  value={this.state.Numbervalue3}
                                  placeholder="自动获取"
                                  readOnly
                                  editable={false}
                                />
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
                              <span>审批中的归还</span>
                            </div>
                          </div>
                          <div className="m-field-box">
                            <div className="m-field-content left">
                              <div className="input-wrapper">
                                <InputItem
                                  type="text"
                                  className="ant-input m-mobile-inner-input"
                                  value={this.state.Numbervalue4}
                                  placeholder="自动获取"
                                  readOnly
                                  editable={false}
                                />
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
                              <span>本次抵扣金额</span>
                            </div>
                          </div>
                          <div className="m-field-box">
                            <div className="m-field-content left">
                              <div className="input-wrapper">
                                <input
                                  type="number"
                                  max={this.state.maxnum}
                                  className="ant-input m-mobile-inner-input"
                                  value={this.state.Numbervalue2}
                                  placeholder="请输入"
                                  onChange={e => {
                                    //   e.target.value
                                    const number1 = this.state.maxnum;
                                    const number2 = this.state.Inputmoney1;
                                    let val = Number(e.target.value);
                                    if (number1 > number2) {
                                      if (val > this.state.Inputmoney1) {
                                        const aa = this.state.Inputmoney1;
                                        const bb =
                                          Number(aa) -
                                          Number(this.state.maxnum);
                                        this.setState({
                                          Numbervalue2: this.state.Inputmoney1,
                                          Numbervalue5: bb.toFixed(2),
                                        });
                                      } else {
                                        const aa = this.state.Inputmoney1;
                                        const bb = aa - val;
                                        this.setState({
                                          Numbervalue2: val.toFixed(2),
                                          Numbervalue5: bb.toFixed(2),
                                        });
                                      }
                                    } else {
                                      if (val > this.state.maxnum) {
                                        const aa = this.state.Inputmoney1;
                                        const bb = aa - this.state.maxnum;
                                        this.setState({
                                          Numbervalue2:
                                            this.state.maxnum.toFixed(2),
                                          Numbervalue5: bb.toFixed(2),
                                        });
                                      } else {
                                        const aa = this.state.Inputmoney1;
                                        const bb = aa - val;
                                        this.setState({
                                          Numbervalue2: val.toFixed(2),
                                          Numbervalue5: bb.toFixed(2),
                                        });
                                      }
                                    }

                                    console.log(e.target.value);
                                  }}
                                />
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
                              <span>财务应支付金额</span>
                            </div>
                          </div>
                          <div className="m-field-box">
                            <div className="m-field-content left">
                              <div className="input-wrapper">
                                <input
                                  readOnly
                                  type="number"
                                  className="ant-input m-mobile-inner-input"
                                  value={this.state.Numbervalue5}
                                  placeholder="请输入"
                                />
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
        </div>
        {/* 合计 */}
        {/* <List>
          <List.Item>
            <div className="label">候选供应商名单</div>
            <div>
              <InputItem
                clear
                value={remarks}
                placeholder="请输入"
                onChange={e => this.onInputchange('remarks', index, e)}
              ></InputItem>
            </div>
          </List.Item>
        </List> */}
        {/* 物资明细 */}
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,

              display: this.state.showElem,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={sidebar}
            onOpenChange={this.onOpenChange}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,
              display: this.state.showElem2,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={treesidebar}
            onOpenChange={this.onOpenChange2}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
      </div>
    );
  },
};

export default FormField;
