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
      treevalue: undefined,
      datadate: '',
      deColumns: [
        {
          title: '物资名称',
          dataIndex: 'name',
        },
        {
          title: '规格型号',
          dataIndex: 'size',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },
        {
          title: '估算数量',
          dataIndex: 'number',
        },
        {
          title: '物资采购部门',
          dataIndex: 'purchase_unit',
        },
        {
          title: '采购日期',
          dataIndex: 'purchase_riqi',
        },
        {
          title: '采购地点',
          dataIndex: 'purchase_address',
        },
        {
          title: '候选供应商名单',
          dataIndex: 'candidate_list',
        },
      ],
      treeData: [],
      date: now,
      checkindex: '',
      SearchBarvalue: '',
      showElem: 'none',
      showElem2: 'none',
      inputvalue: '',
      allData: { type: '0', number: '99999', page: '1', name: '' },
      listData: [],
      materialList: [
        {
          typename: '',
          name: '',
          size: '',
          unit: '',
          number: '',
          purchase_unit: '',
          purchase_riqi: '',
          purchase_address: '',
          candidate_list: '',
        },
      ],
    };
  },
  asyncSetFieldProps(vlauedata) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestBiddingField = form.getFieldInstance('TestBidding');
    const key = TestBiddingField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestBidding',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入 参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestBidding'], // spi接口要改动的是leaveReason的属性值
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
      });
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
  onChangedata(data, index) {
    const newdata = new Date(data);

    var datetime =
      newdata.getFullYear() +
      '-' +
      (newdata.getMonth() + 1) +
      '-' +
      newdata.getDate();
    let arr = this.state.materialList;
    arr[index].purchase_riqi = datetime;
    this.setState({ materialList: [...arr] });
    console.log(datetime, index);
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
        form.setFieldValue('TestBidding', item.name);
        form.setExtendFieldValue('TestBidding', {
          data: item.name,
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
          if (!value) {
            const newData = this.state.allData;
            newData.name = value;
            this.asyncSetFieldProps(newData);
          }

    this.setState({ SearchBarvalue: value });
  },
  //增加明细
  addSon() {
    const sonData = {
      typename: '',
      name: '',
      size: '',
      unit: '',
      number: '',
      purchase_unit: '',
      purchase_riqi: '',
      purchase_address: '',
      candidate_list: '',
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
    this.setState({ materialList: [...arr] });
    console.log(arr);
  },
  fieldDidUpdate() {
    if (!this.props.runtimeProps.viewMode) {
      console.log('发起页：fieldDidUpdate');

      let editData = {
        detailedData: [], //物资明细
      };

      editData.detailedData = this.state.materialList;
      const { form } = this.props;
      form.setFieldValue('TestBidding', editData);
      form.setExtendFieldValue('TestBidding', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestBidding');
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestBidding', 'label');
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

      const { detailedData = [] } = value;
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
        </div>
      );
    }

    return (
      <div className="CorpHouse_class_m">
        {' '}
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
                          {this.state.materialList.length > 0 ? (
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
                                              this.onInputchange(
                                                'name',
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
                                            type="text"
                                            readOnly
                                            editable={false}
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
                                        <span>估算数量</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            className="ant-input m-mobile-inner-input"
                                            value={item.number}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'number',
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
                                        <span>物资采购部门</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            type="text"
                                            className="ant-input m-mobile-inner-input"
                                            value={item.purchase_unit}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'purchase_unit',
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
                            <DatePicker
                              mode="date"
                              title="Select Date"
                              extra="Optional"
                              value={this.state.datadate}
                              onChange={date => this.onChangedata(date, index)}
                            >
                              <div className="field-wrapper">
                                <div className="m-group m-group-mobile">
                                  <div className="m-field-wrapper">
                                    <div className="m-field m-field-mobile m-select-field">
                                      <div className="m-field-head">
                                        <div className="m-field-label">
                                          <span>采购日期</span>
                                        </div>
                                      </div>

                                      <div className="m-field-box">
                                        <div className="m-field-content left">
                                          <div className="input-wrapper">
                                            <InputItem
                                              editable={false}
                                              clear
                                              value={item.purchase_riqi}
                                              placeholder="请选择"
                                            ></InputItem>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DatePicker>
                          </div>
                          <div>
                            <div className="field-wrapper">
                              <div className="m-group m-group-mobile">
                                <div className="m-field-wrapper">
                                  <div className="m-field m-field-mobile m-select-field">
                                    <div className="m-field-head">
                                      <div className="m-field-label">
                                        <span>采购地点</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            clear
                                            value={item.purchase_address}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'purchase_address',
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
                                        <span>候选供应商名单</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            clear
                                            value={item.candidate_list}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'candidate_list',
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
      </div>
    );
  },
};

export default FormField;
