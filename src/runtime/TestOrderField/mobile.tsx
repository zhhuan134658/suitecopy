import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  DatePicker,
  InputItem,
  Drawer,
  Toast,
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
      deColumns: [
        {
          title: '物资名称',
          dataIndex: 'name',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },
        {
          title: '规格型号',
          dataIndex: 'size',
        },
        {
          title: '数量',
          dataIndex: 'rk_number',
        },
        {
          title: '不含税单价(元)',
          dataIndex: 'extend_first',
        },
        {
          title: '含税单价(元)',
          dataIndex: 'tax_price',
        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
        },

        {
          title: '税额(元)',
          dataIndex: 'notax_price(元)',
        },
        {
          title: '不含税金额(元)',
          dataIndex: 'notax_money',
        },
        {
          title: '含税金额(元)',
          dataIndex: 'tax_money',
        },
      ],
      Inputmoney1: '',
      checkData: [],
      chenkdata: '',
      treevalue: undefined,
      treeData: [],
      date: now,
      checkindex: '',
      SearchBarvalue: '',
      showElem: 'none',
      showElem2: 'none',
      showElem3: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      materialList: [
        {
          typename: '',
          name: '',
          size: '',
          unit: '',
          rk_number: '',
          extend_first: '',
          tax_rate: '',
          notax_price: '',
          tax_money: '',
          notax_money: '',
        },
      ],
    };
  },
  asyncSetFieldProps(vlauedata, type) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestOrderField = form.getFieldInstance('TestOrder');
    const key = TestOrderField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestOrder',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestOrder'], // spi接口要改动的是leaveReason的属性值
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

        this.setState({
          listData: [...newarr],
        });
        //   树状图数据
        const newtarr = JSON.parse(res.dataList[0].extendValue);
        const newtarr1 = [
          {
            title: '物资类型',
            key: '0',
            children: newtarr,
          },
        ];
        this.setState({
          treeData: [...newtarr1],
        });
        // this.setState({
        //   checkData: [...newarr],
        // });
        if (type === 1) {
          console.log('9887987', newarr);
          this.setState({
            materialList: [...newarr],
          });
        } else if (type === 2) {
          this.setState({
            checkData: [...newarr],
          });
        }
      });
  },
  getcheckdata() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    if (!Pro_name) {
      return Toast.info('请先选择项目', 1);
    }
    this.setState({ dstatus: '1' });
    let newpage = {
      rk_id: ['a'],
      number: '10',
      page: 1,
      name: '',
    };
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage, 2);

    this.setState({ showElem3: 'inherit' });
  },
  onOpenChange(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    if (!Pro_name) {
      return Toast.info('请先选择项目', 1);
    }
    const newdate = this.state.allData;
    newdate.rk_id = ['-1'];
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
    let arr = this.state.materialList;
    let arrindex = this.state.checkindex;

    arr[arrindex].name = item.name;
    arr[arrindex].size = item.size;
    arr[arrindex].unit = item.unit;
    this.setState(
      { inputvalue: item.name, showElem: 'none', materialList: arr },
      () => {
        form.setFieldValue('TestOrder', item.name);
        form.setExtendFieldValue('TestOrder', {
          data: item.name,
        });
      },
    );
  },
  checkClick(item) {
    const cDataid = [item.id];
    const newdate = this.state.allData;
    newdate.rk_id = ['a1', ...cDataid];
    this.asyncSetFieldProps(newdate, 1);
    this.setState({
      chenkdata: item.name,
      showElem3: 'none',
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
    var sonData = {
      typename: '',
      name: '',
      size: '',
      unit: '',
      rk_number: '',
      extend_first: '',
      tax_rate: '',
      notax_price: '',
      tax_money: '',
      notax_money: '',
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
    console.log('120', this.state.materialList);
    const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    let arrindex = e;
    let newindex = index;
    let newtype = types;

    arr[newindex][newtype] = arrindex;
    if (arr[newindex].tax_rate == '') {
      return this.setState({
        materialList: [...arr],
      });
    }
    switch (newtype) {
      case 'extend_first':
        if (
          arr[newindex].extend_first != '' &&
          reg.test(arr[newindex].tax_rate)
        ) {
          //   含税单价
          arr[newindex].tax_price = (
            arr[newindex].extend_first *
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        }
        break;
      case 'tax_price':
        if (arr[newindex].tax_price && reg.test(arr[newindex].tax_rate)) {
          //   bu含税单价

          arr[newindex].extend_first = (
            arr[newindex].tax_price /
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        }
        if (arr[newindex].tax_price && arr[newindex].rk_number) {
          (arr[newindex].tax_money =
            arr[newindex].tax_price * arr[newindex].rk_number).toFixed(2);
        }

        //不含税金额
        if (
          arr[newindex].tax_price &&
          arr[newindex].rk_number &&
          reg.test(arr[newindex].tax_rate)
        ) {
          arr[newindex].notax_money = (
            (arr[newindex].tax_price * arr[newindex].rk_number) /
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
          arr[newindex].notax_price = (
            ((arr[newindex].tax_price * arr[newindex].rk_number) /
              (1 + arr[newindex].tax_rate * 0.01)) *
            arr[newindex].tax_rate *
            0.01
          ).toFixed(2);
        }

        break;
      case 'tax_rate':
        if (arr[newindex].extend_first && !arr[newindex].tax_price) {
          arr[newindex].tax_price = (
            arr[newindex].extend_first *
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        } else if (!arr[newindex].extend_first && arr[newindex].tax_price) {
          arr[newindex].extend_first = (
            arr[newindex].tax_price /
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        } else if (arr[newindex].extend_first && arr[newindex].tax_price) {
          arr[newindex].tax_price = (
            arr[newindex].extend_first *
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        }
        if (
          arr[newindex].extend_first &&
          arr[newindex].rk_number &&
          reg.test(arr[newindex].tax_rate)
        ) {
          arr[newindex].notax_price = (
            arr[newindex].extend_first *
            arr[newindex].rk_number *
            arr[newindex].tax_rate *
            0.01
          ).toFixed(2);
          arr[newindex].tax_money = (
            arr[newindex].extend_first *
            arr[newindex].rk_number *
            (1 + arr[newindex].tax_rate * 0.01)
          ).toFixed(2);
        }

        break;
      default:
        break;
    }

    //税额
    if (newtype != 'tax_price') {
      if (
        arr[newindex].extend_first &&
        arr[newindex].rk_number &&
        reg.test(arr[newindex].tax_rate)
      ) {
        arr[newindex].notax_price = (
          arr[newindex].extend_first *
          arr[newindex].rk_number *
          arr[newindex].tax_rate *
          0.01
        ).toFixed(2);
      }
      //   不含税
      if (arr[newindex].extend_first && arr[newindex].rk_number) {
        arr[newindex].notax_money = (
          arr[newindex].extend_first * arr[newindex].rk_number
        ).toFixed(2);
      }
      //含税
      if (
        arr[newindex].extend_first &&
        arr[newindex].rk_number &&
        reg.test(arr[newindex].tax_rate)
      ) {
        arr[newindex].tax_money = (
          arr[newindex].extend_first *
          arr[newindex].rk_number *
          (1 + arr[newindex].tax_rate * 0.01)
        ).toFixed(2);
      }
    }
    //   含税金额
    let newarr2 = [];

    newarr2 = arr.filter(item => {
      if (item.tax_money) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.tax_money;
    });
    //不含税金额
    let newarr4 = [];

    newarr4 = arr.filter(item => {
      if (item.notax_money) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.notax_money;
    });
    this.setState({
      materialList: [...arr],
      Inputmoney1: eval(newarr2.join('+')),
      Inputmoney2: eval(newarr4.join('+')),
    });
    console.log('12', arr);
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
        detailname: '',
        detailedData: [], //物资明细
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = this.state.Inputmoney1;
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = this.state.Inputmoney2;
      }
      editData.detailname = this.state.chenkdata;
      editData.detailedData = this.state.materialList;
      const { form } = this.props;
      form.setFieldValue('TestOrder', editData);
      form.setExtendFieldValue('TestOrder', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestOrder');
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestOrder', 'label');
    const onSelect = (selectedKeys: React.Key[], info: any) => {
      let arr = this.state.materialList;
      let newindex = this.state.checkindex;
      arr[newindex].typename = info.node.title;
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
                {item.name}/{item.unit}/{item.size}
              </List.Item>
            );
          })}
        </List>
      </div>
    );
    const checkdebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={this.onSubmit}
          onChange={this.onSearchBarChange}
          showCancelButton
          onCancel={() => this.setState({ showElem3: 'none' })}
        />

        <List>
          {this.state.checkData.map((item, index) => {
            return (
              <List.Item
                onClick={this.checkClick.bind(this, item)}
                key={index}
                multipleLine
              >
                {' '}
                {item.name}/ {item.supplier}/ {item.contract_money}
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
        nomoney = '',
        detailname = '',
        detailedData = [],
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
          <div>
            <div className="field-wrapper">
              <div className="m-field-view">
                <label className="m-field-view-label">不含税金额合计(元)</label>
                <div className="m-field-view-value">
                  <span>{nomoney}</span>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="m-field-view">
                <label className="m-field-view-label">含税金额合计(元)</label>
                <div className="m-field-view-value">
                  <span>{hanmoney}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="field-wrapper">
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-select-field">
                <div className="m-field-head">
                  <div className="m-field-label">
                    <span>{label}</span>
                  </div>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        editable={false}
                        value={this.state.chenkdata}
                        onClick={this.getcheckdata}
                        placeholder="请选择"
                        readOnly
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                        {/* <div>
                          <div className="field-wrapper">
                            <div className="m-group m-group-mobile">
                              <div className="m-field-wrapper">
                                <div className="m-field m-field-mobile m-select-field">
                                  <div className="m-field-head">
                                    <div className="m-field-label">
                                      <span>物资类型</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.typename}
                                          placeholder="请选择"
                                          onClick={this.onOpenChange2.bind(
                                            this,
                                            index,
                                          )}
                                          onChange={e =>
                                            this.onInputchange(
                                              'typename',
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
                        </div> */}
                        <div>
                          <div className="field-wrapper">
                            <div className="m-group m-group-mobile">
                              <div className="m-field-wrapper">
                                <div className="m-field m-field-mobile m-select-field">
                                  <div className="m-field-head">
                                    <div className="m-field-label">
                                      <span>物资名称</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          editable={false}
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.name}
                                          placeholder="请选择"
                                          onClick={this.onOpenChange.bind(
                                            this,
                                            index,
                                          )}
                                          onChange={e =>
                                            this.onInputchange('name', index, e)
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
                                      <span>规格型号</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          editable={false}
                                          type="text"
                                          className="ant-input m-mobile-inner-input"
                                          value={item.size}
                                          placeholder="自动获取"
                                          readOnly
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
                                      <span>单位</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          editable={false}
                                          type="text"
                                          readOnly
                                          className="ant-input m-mobile-inner-input"
                                          value={item.unit}
                                          placeholder="自动获取"
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
                                      <span>数量</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          value={item.rk_number}
                                          placeholder="请输入"
                                          onChange={e =>
                                            this.onInputchange(
                                              'rk_number',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>不含税单价(元)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          clear
                                          value={item.extend_first}
                                          placeholder="请输入"
                                          onChange={e =>
                                            this.onInputchange(
                                              'extend_first',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>含税单价(元)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          clear
                                          value={item.tax_price}
                                          placeholder="请输入"
                                          onChange={e =>
                                            this.onInputchange(
                                              'tax_price',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>税率(%)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          clear
                                          value={item.tax_rate}
                                          placeholder="请输入"
                                          onChange={e =>
                                            this.onInputchange(
                                              'tax_rate',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>税额(元)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          readOnly
                                          clear
                                          value={item.notax_price}
                                          placeholder="自动计算"
                                          onChange={e =>
                                            this.onInputchange(
                                              'notax_price',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>不含税金额(元)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          clear
                                          readOnly
                                          value={item.notax_money}
                                          placeholder="自动计算"
                                          onChange={e =>
                                            this.onInputchange(
                                              'notax_money',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
                                      <span>含税金额(元)</span>
                                    </div>
                                  </div>
                                  <div className="m-field-box">
                                    <div className="m-field-content left">
                                      <div className="input-wrapper">
                                        <InputItem
                                          readOnly
                                          clear
                                          value={item.tax_money}
                                          placeholder="自动计算"
                                          onChange={e =>
                                            this.onInputchange(
                                              'tax_money',
                                              index,
                                              e,
                                            )
                                          }
                                        ></InputItem>
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
        {/*  */}

        {/* 合计 */}
        <div className="field-wrapper">
          <div className="m-group m-group-mobile">
            <div className="m-field-wrapper">
              <div className="m-field m-field-mobile m-select-field">
                <div className="m-field-head">
                  <div className="m-field-label">
                    <span>不含税金额合计(元)</span>
                  </div>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        editable={false}
                        value={this.state.Inputmoney2}
                        placeholder="自动计算"
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
                    <span>含税金额合计(元)</span>
                  </div>
                </div>
                <div className="m-field-box">
                  <div className="m-field-content left">
                    <div className="input-wrapper">
                      <InputItem
                        editable={false}
                        value={this.state.Inputmoney1}
                        placeholder="自动计算"
                        readOnly
                      ></InputItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        {createPortal(
          <Drawer
            className="my-drawer"
            open={true}
            style={{
              minHeight: document.documentElement.clientHeight,
              display: this.state.showElem3,
            }}
            enableDragHandle
            contentStyle={{
              color: '#A6A6A6',
              textAlign: 'center',
              paddingTop: 42,
            }}
            sidebar={checkdebar}
            onOpenChange={this.onOpenChange3}
          ></Drawer>,
          document.getElementById('MF_APP'),
        )}
      </div>
    );
  },
};

export default FormField;
