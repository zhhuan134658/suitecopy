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
import { asyncSetProps } from '../../utils/asyncSetProps';
import { searchBarChange, searchBarSubmit } from '../../utils/searchUtils';
/**
 * 自定义控件运行态 Mobile 视图
 */
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const FormField: IFormField = {
  getInitialState() {
    const { form } = this.props;
    return {
      checkData: [],
      treevalue: undefined,
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
          title: '账存数量',
          dataIndex: 'wz_number',
        },
        {
          title: '盘点数量',
          dataIndex: 'pd_number',
        },
      ],
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
          wz_number: '',
          pd_number: '',
        },
      ],
    };
  },
  asyncSetFieldProps(vlauedata, typename = 'TestMaterial') {
    const _this = this;
    const promise = asyncSetProps(_this, vlauedata, 'TestMaterial');
    promise.then(res => {
      console.log('new async props');
      const type = typename;
      let arrayData;
      try {
        arrayData = res['dataArray'];
      } catch (e) {
        console.log(e);
      }
      if (type === 'CorpHouse') {
        _this.setState({
          checkData: [...arrayData],
        });
      } else if (type === 'TestMaterial') {
        _this.setState({
          listData: [...arrayData],
        });
      } else if (type === 'alllist') {
        _this.setState({
          materialList: [...arrayData],
        });
      }
    });
  },
  onOpenChange(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = {
      ck_name: '',
      isHouse: '2',
      name: '',
      number: '9999',
      page: 1,
      type: 0,
    };

    this.asyncSetFieldProps(newdate, 'TestMaterial');
    this.setState({ showElem: 'inherit', checkindex: index });
  },
  onOpenChange2(index: any, ...args: any[]) {
    console.log('sss');
    console.log(args);
    const newdate = this.state.allData;

    this.asyncSetFieldProps(newdate, 'CorpHouse');
    this.setState({ showElem3: 'inherit', checkindex: index });
  },
  habdlClick(item: { name: any; size: any; unit: any; wz_number: any }) {
    const { form } = this.props;
    let arrindex = this.state.checkindex;
    let arr = this.state.materialList;
    arr[arrindex].name = item.name;
    arr[arrindex].size = item.size;
    arr[arrindex].unit = item.unit;
    arr[arrindex].wz_number = item.wz_number;
    this.setState(
      { inputvalue: item.name, showElem: 'none', materialList: arr },
      () => {
        form.setFieldValue('TestMaterial', item.name);
        form.setExtendFieldValue('TestMaterial', {
          data: item.name,
        });
      },
    );
  },
  checkClick(item) {
    const cDataid = [item.id];
    console.log(item);
    // let arr = this.state.materialList;
    // let arrindex = this.state.checkindex;

    // arr[arrindex].name = item.name;
    // arr[arrindex].size = item.size;
    // arr[arrindex].unit = item.unit;
    // arr[arrindex].wz_number = item.wz_number;

    const newdate = this.state.allData;
    newdate.ck_name = item.name;
    newdate.type = 0;
    newdate.page = 1;
    newdate.isHouse = '2';
    this.asyncSetFieldProps(newdate, 'alllist');
    this.setState({
      Inputvalue: item.name,
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
  onSubmitStorage(value) {
    const newdate = this.state.allData;
    newdate.name = value;
    this.asyncSetFieldProps(newdate, 'CorpHouse');
  },
  onSubmitItems(value) {
    const newdate = this.state.allData;
    newdate.name = value;
    this.asyncSetFieldProps(newdate, 'alllist');
  },
  onSearchBarChange(value) {
    if (!value) {
      this.onSubmit('');
    }
    this.setState({ SearchBarvalue: value });
  },
  onSearchBarChangeStorage(value) {
    console.log('Search Bar Change', value);
    if (!value) {
      this.onSubmitStorage('');
    }
    this.setState({ SearchBarvalue: value });
  },
  onSearchBarChangeItems(value) {
    if (!value) {
      this.onSubmitItems('');
    }
    this.setState({ SearchBarvalue: value });
  },
  //增加明细
  addSon() {
    var sonData = {
      typename: '',
      name: '',
      size: '',
      unit: '',
      wz_number: '',
      pd_number: '',
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
  getcheckdata() {
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');

    this.setState({ dstatus: '1' });
    let newpage = {
      rk_id: ['a'],
      number: '10',
      page: 1,
      name: '',
      isHouse: '1',
    };
    this.setState({
      allData: newpage,
    });
    this.asyncSetFieldProps(newpage, 'CorpHouse');

    this.setState({ showElem3: 'inherit' });
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
        warehouse: '',
        detailedData: [], //物资明细
      };
      editData.warehouse = this.state.Inputvalue;
      editData.detailedData = this.state.materialList;
      const { form } = this.props;
      form.setFieldValue('TestMaterial', editData);
      form.setExtendFieldValue('TestMaterial', {
        data: editData,
      });
    }
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestMaterial');
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestMaterial', 'label');
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
    const checkdebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={val => {
            const _this = this;
            searchBarSubmit(_this, val, 'CorpHouse');
          }}
          onChange={val => {
            const _this = this;
            searchBarChange(_this, val, 'CorpHouse');
          }}
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
                {item.name}
              </List.Item>
            );
          })}
        </List>
      </div>
    );
    const sidebar = (
      <div>
        <SearchBar
          value={this.state.SearchBarvalue}
          placeholder="请输入"
          onSubmit={val => {
            const _this = this;
            searchBarSubmit(_this, val, 'TestMaterial');
          }}
          onChange={val => {
            const _this = this;
            searchBarChange(_this, val, 'TestMaterial');
          }}
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
          onSubmit={val => {
            const _this = this;
            searchBarSubmit(_this, val, 'TestMaterial');
          }}
          onChange={val => {
            const _this = this;
            searchBarChange(_this, val, 'TestMaterial');
          }}
          onCancel={() => this.setState({ showElem2: 'none' })}
          showCancelButton
        />

        <Tree onSelect={onSelect} treeData={this.state.treeData} />
      </div>
    );
    //详情
    if (this.props.runtimeProps.viewMode) {
      const value = field.getValue();

      const { warehouse = '', detailedData = [] } = value;
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
                <label className="m-field-view-label">仓库</label>
                <div className="m-field-view-value">
                  <span>{warehouse}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="CorpHouse_class_m">
        {' '}
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
                        value={this.state.Inputvalue}
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
                                        <span>账存数量</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            clear
                                            value={item.wz_number}
                                            placeholder="自动获取"
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
                                        <span>盘点数量</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            clear
                                            value={item.pd_number}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'pd_number',
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
              })}{' '}
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
          {/* 合计 */}
          {/* <List>
          <List.Item>
            <div className="label">候选供应商名单</div>
            <div>
              <InputItem
                clear
                value={candidate_list}
                placeholder="请输入"
                onChange={e => this.onInputchange('candidate_list', index, e)}
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
                display: this.state.showElem3,
              }}
              enableDragHandle
              contentStyle={{
                color: '#A6A6A6',
                textAlign: 'center',
                paddingTop: 42,
              }}
              sidebar={checkdebar}
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
