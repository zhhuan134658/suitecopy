import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { IFormField } from '../../types';
import {
  DatePicker,
  InputItem,
  Drawer,
  Tabs,
  List,
  Toast,
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
import { searchBarChange, searchBarSubmit } from '../../utils/searchUtils';
import { fpAdd, fpDivide, fpMul, toFixed } from '../../utils/fpOperations';
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
          dataIndex: 'det_quantity',
        },
        {
          title: '不含税单价(元)',
          dataIndex: 'no_unit_price',
        },
        {
          title: '含税单价(元)',
          dataIndex: 'unit_price',
        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
        },

        {
          title: '税额(元)',
          dataIndex: 'tax_amount',
        },
        {
          title: '含税金额(元)',
          dataIndex: 'amount_tax',
        },
        {
          title: '不含税金额(元)',
          dataIndex: 'no_amount_tax',
        },
      ],
      Inputmoney1: '',
      checkData: [],
      chenkdata: '',
      treevalue: undefined,
      treeData: [],
      detdate: 'a1',
      date: now,
      checkindex: '',
      fixedColumn: '',
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
          det_quantity: '',
          no_unit_price: '',
          tax_rate: '',
          tax_amount: '',
          amount_tax: '',
          no_amount_tax: '',
        },
      ],
    };
  },
  asyncSetFieldProps(vlauedata, type = 0) {
    const { form, spi } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    vlauedata.project_name = Pro_name;
    const TestSetField = form.getFieldInstance('TestSet');
    const key = TestSetField.getProp('id');
    const value = '1';
    const bizAsyncData = [
      {
        key,
        bizAlias: 'TestSet',
        extendValue: vlauedata,
        value,
      },
    ];

    // 入参和返回参考套件数据刷新集成接口文档

    spi
      .refreshData({
        modifiedBizAlias: ['TestSet'], // spi接口要改动的是leaveReason的属性值
        bizAsyncData,
      })
      .then(res => {
        console.log(JSON.parse(res.dataList[0].value));
        //   表格数据
        let newarr = [];
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
        // this.setState({
        //   treeData: [...newtarr1],
        // });

        if (type === 1) {
          console.log('98879871111', newarr);
          const newssarr = [...newarr];
          this.setState({
            materialList: newssarr,
          });
          // 含税金额合计;

          let newarr2 = [];

          newarr2 = newssarr.filter(item => {
            if (item.amount_tax) {
              return item;
            }
          });
          newarr2 = newarr2.map(item => {
            return item.amount_tax;
          });
          if (newarr2.length > 0) {
            this.setState({
              Inputmoney1: eval(newarr2.join('+')),
            });
          }
          // 不含税金额合计;

          let newarr4 = [];
          newarr4 = newssarr.filter(item => {
            if (item.no_amount_tax) {
              return item;
            }
          });
          newarr4 = newarr4.map(item => {
            return item.no_amount_tax;
          });
          if (newarr4.length > 0) {
            this.setState({
              Inputmoney2: eval(newarr4.join('+')),
            });
          }
        } else if (type === 2) {
          this.setState({
            checkData: newarr,
          });
        }
      });
  },
  onExtraClick() {
    this.setState({
      chenkdata: '',
      materialList: [],
      Inputmoney2: 0,
      Inputmoney1: 0,
    });

    console.log('测试点击');
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
    const { form } = this.props;
    const Pro_name = form.getFieldValue('Autopro');
    if (!Pro_name) {
      return Toast.info('请先选择项目', 1);
    }
    console.log('sss');
    console.log(args);
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
    console.log('CLICK HANDLE ITEM', item);
    let arr = this.state.materialList;
    let arrindex = this.state.checkindex;

    arr[arrindex].name = item.name;
    arr[arrindex].size = item.size;
    arr[arrindex].unit = item.unit;
    this.setState({
      //   chenkdata: item.name,
      showElem: 'none',
      materialList: arr,
    });
  },
  checkClick(item) {
    const { form } = this.props;
    console.log('CHECK CLICK', item);
    const cDataid = [item.id];
    const newdate = this.state.allData;
    let dtar = '';
    if (this.state.detdate === 'a1') {
      dtar = '采购合同-' + item.name;
    } else if (this.state.detdate === 'b1') {
      dtar = '采购订单-' + item.name;
    } else if (this.state.detdate === 'c1') {
      dtar = '材料入库-' + item.name;
    } else if (this.state.detdate === 'd1') {
      dtar = '质保金结算-' + item.name;
    }
    form.setFieldValue('Conname', item.contract_name);
    newdate.rk_id = [this.state.detdate, ...cDataid];
    this.asyncSetFieldProps(newdate, 1);
    this.setState({
      chenkdata: dtar,
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
    if (!value) {
      const newData = this.state.allData;
      newData.name = value;
      this.asyncSetFieldProps(newData);
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
      det_quantity: '',
      no_unit_price: '',
      tax_rate: '',
      tax_amount: '',
      unit_price: '',
      amount_tax: '',
      no_amount_tax: '',
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
    //   含税金额
    let newarr2 = [];

    newarr2 = list.filter(item => {
      if (item.amount_tax) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.amount_tax;
    });
    //不含税金额
    let newarr4 = [];

    newarr4 = list.filter(item => {
      if (item.no_amount_tax) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.no_amount_tax;
    });
    let newdata1 = this.toFixed(eval(newarr2.join('+')), 2);

    if (isNaN(newdata1)) {
      this.setState({
        Inputmoney1: 0,
      });
    } else {
      this.setState({
        Inputmoney1: newdata1,
      });
    }
    let newdata2 = this.toFixed(eval(newarr4.join('+')), 2);

    if (isNaN(newdata2)) {
      this.setState({
        Inputmoney2: 0,
      });
    } else {
      this.setState({
        Inputmoney2: newdata2,
      });
    }
    // this.setState({
    //   Inputmoney1: eval(newarr2.join('+')).toFixed(2),
    //   Inputmoney2: eval(newarr4.join('+')).toFixed(2),
    // });
  },
  // 两个浮点数相减
  accSub(num1, num2) {
    var r1, r2, m, n;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  },
  // 两数相除
  accDiv(num1, num2) {
    var t1, t2, r1, r2;
    try {
      t1 = num1.toString().split('.')[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = num2.toString().split('.')[1].length;
    } catch (e) {
      t2 = 0;
    }
    r1 = Number(num1.toString().replace('.', ''));
    r2 = Number(num2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  // 两个浮点数相乘
  accMul(num1, num2) {
    var m = 0,
      s1 = num1.toString(),
      s2 = num2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  },
  // 两个浮点数求和
  accAdd(num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
  },
  toFixed(dight, bits) {
    return Math.round(dight * Math.pow(10, bits)) / Math.pow(10, bits);
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
    let fixedColumn = this.state.fixedColumn;
    arr[newindex][newtype] = arrindex;
    if (!reg.test(arr[newindex].tax_rate)) {
      if (
        !reg.test(arr[newindex].no_unit_price) &&
        reg.test(arr[newindex].unit_price)
      ) {
        this.setState({
          fixedColumn: 'unit_price',
        });
      }
      return this.setState({
        materialList: [...arr],
      });
    }
    switch (newtype) {
      case 'no_unit_price':
        if (!reg.test(arr[newindex].unit_price)) {
          this.setState({
            fixedColumn: 'no_unit_price',
          });
        }

        if (
          reg.test(arr[newindex].no_unit_price) &&
          reg.test(arr[newindex].tax_rate)
        ) {
          //   含税单价
          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let a = 1 + arr[newindex].tax_rate * 0.01;
          arr[newindex].unit_price = toFixed(
            fpMul(arr[newindex].no_unit_price, a),
            2,
          );
        } else if (
          arr[newindex].no_unit_price == null &&
          reg.test(arr[newindex].tax_rate) &&
          arr[newindex].unit_price
        ) {
          //   newData[index].no_unit_price = (
          //     row.unit_price /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let a = 1 + arr[newindex].tax_rate * 0.01;
          arr[newindex].no_unit_price = toFixed(
            fpDivide(arr[newindex].unit_price, a),
            2,
          );
        }
        break;
      case 'unit_price':
        console.log(
          'No Unit Price REGEX',
          reg.test(arr[newindex].no_unit_price),
        );
        if (!reg.test(arr[newindex].no_unit_price)) {
          console.log('change fixed column');
          this.setState({
            fixedColumn: 'unit_price',
          });
        }

        if (arr[newindex].unit_price && reg.test(arr[newindex].tax_rate)) {
          //   bu含税单价
          let a = 1 + arr[newindex].tax_rate * 0.01;
          arr[newindex].no_unit_price = toFixed(
            fpDivide(arr[newindex].unit_price, a),
            2,
          );
          //   newData[index].no_unit_price = (
          //     row.unit_price /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        } else if (
          arr[newindex].unit_price == null &&
          reg.test(arr[newindex].tax_rate) &&
          arr[newindex].no_unit_price
        ) {
          let a = 1 + arr[newindex].tax_rate * 0.01;
          arr[newindex].unit_price = toFixed(
            fpMul(arr[newindex].no_unit_price, a),
            2,
          );
          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }
        if (arr[newindex].unit_price && arr[newindex].det_quantity) {
          //   newData[index].amount_tax = (
          //     row.unit_price * row.det_quantity
          //   ).toFixed(2);
          arr[newindex].amount_tax = toFixed(
            fpMul(arr[newindex].unit_price, arr[newindex].det_quantity),
            2,
          );
        }

        //不含税金额
        if (
          arr[newindex].unit_price &&
          arr[newindex].det_quantity &&
          reg.test(arr[newindex].tax_rate)
        ) {
          let a = 1 + arr[newindex].tax_rate * 0.01;
          let b = fpMul(arr[newindex].unit_price, arr[newindex].det_quantity);

          arr[newindex].no_amount_tax = toFixed(fpDivide(b, a), 2);

          //   newData[index].no_amount_tax = (
          //     (row.unit_price * row.det_quantity) /
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
          let c = arr[newindex].unit_price * arr[newindex].det_quantity;
          let d = 1 + arr[newindex].tax_rate * 0.01;
          let e = fpDivide(c, d);
          let f = arr[newindex].tax_rate * 0.01;
          arr[newindex].tax_amount = toFixed(fpMul(e, f), 2);

          //   newData[index].tax_amount = (
          //     ((row.unit_price * row.det_quantity) / (1 + row.tax_rate * 0.01)) *
          //     row.tax_rate *
          //     0.01
          //   ).toFixed(2);
        }

        break;
      case 'tax_rate':
        if (
          arr[newindex].no_unit_price &&
          !reg.test(arr[newindex].unit_price)
        ) {
          //   let a = 1 + row.tax_rate * 0.01;
          //   newData[index].unit_price = toFixed(
          //     fpMul(row.no_unit_price, a, 2),
          //   );
          console.log('FIXED COLUMN IS', this.state.fixedColumn);
          if (this.state.fixedColumn === 'unit_price') {
            let taxedUnitPrice = arr[newindex].unit_price;
            let taxRate = arr[newindex].tax_rate;
            if (taxRate) {
              let calcedTaxFreeUnitPrice = fpDivide(
                taxedUnitPrice,
                1 + taxRate * 0.01,
              );
              arr[newindex].no_unit_price = toFixed(calcedTaxFreeUnitPrice, 2);
            }
          } else {
            arr[newindex].unit_price = toFixed(
              arr[newindex].no_unit_price * (1 + arr[newindex].tax_rate * 0.01),
              2,
            );
          }
        } else if (
          !reg.test(arr[newindex].no_unit_price) &&
          arr[newindex].unit_price
        ) {
          //   let a = 1 + row.tax_rate * 0.01;
          //   newData[index].no_unit_price = toFixed(
          //     fpDivide(row.unit_price, a),
          //     2,
          //   );

          arr[newindex].no_unit_price = toFixed(
            arr[newindex].unit_price / (1 + arr[newindex].tax_rate * 0.01),
            2,
          );

          arr[newindex].amount_tax = toFixed(
            arr[newindex].unit_price * arr[newindex].det_quantity,
            2,
          );
          arr[newindex].no_amount_tax = toFixed(
            (arr[newindex].unit_price * arr[newindex].det_quantity) /
              (1 + arr[newindex].tax_rate * 0.01),
            2,
          );
          arr[newindex].tax_amount = toFixed(
            arr[newindex].amount_tax - arr[newindex].no_amount_tax,
            2,
          );
        } else if (arr[newindex].no_unit_price && arr[newindex].unit_price) {
          console.log('FIXED COLUMN IS', this.state.fixedColumn);
          if (this.state.fixedColumn === 'unit_price') {
            let taxedUnitPrice = arr[newindex].unit_price;
            let taxRate = arr[newindex].tax_rate;
            if (taxRate) {
              let calcedTaxFreeUnitPrice = fpDivide(
                taxedUnitPrice,
                1 + taxRate * 0.01,
              );
              arr[newindex].no_unit_price = calcedTaxFreeUnitPrice;
            }
          } else {
            arr[newindex].unit_price = toFixed(
              arr[newindex].no_unit_price * (1 + arr[newindex].tax_rate * 0.01),
              2,
            );
          }

          //   newData[index].unit_price = (
          //     row.no_unit_price *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }
        if (
          reg.test(arr[newindex].no_unit_price) &&
          reg.test(arr[newindex].det_quantity) &&
          reg.test(arr[newindex].tax_rate)
        ) {
          let a = fpMul(
            arr[newindex].no_unit_price,
            arr[newindex].det_quantity,
          );
          let b = fpMul(arr[newindex].tax_rate, 0.01);
          arr[newindex].tax_amount = toFixed(fpMul(a, b), 2);
          //   newData[index].tax_amount = (
          //     row.no_unit_price *
          //     row.det_quantity *
          //     row.tax_rate *
          //     0.01
          //   ).toFixed(2);
          let c = fpMul(
            arr[newindex].no_unit_price,
            arr[newindex].det_quantity,
          );
          let d = 1 + arr[newindex].tax_rate * 0.01;
          arr[newindex].amount_tax = toFixed(fpMul(c, d), 2);
          //   newData[index].amount_tax = (
          //     row.no_unit_price *
          //     row.det_quantity *
          //     (1 + row.tax_rate * 0.01)
          //   ).toFixed(2);
        }

        break;
      default:
        break;
    }

    //税额
    if (newtype != 'unit_price') {
      if (
        arr[newindex].no_unit_price &&
        arr[newindex].det_quantity &&
        reg.test(arr[newindex].tax_rate)
      ) {
        let a = fpMul(arr[newindex].no_unit_price, arr[newindex].det_quantity);
        let b = fpMul(arr[newindex].tax_rate, 0.01);
        arr[newindex].tax_amount = toFixed(fpMul(a, b), 2);
        // newData[index].tax_amount = (
        //   row.no_unit_price *
        //   row.det_quantity *
        //   row.tax_rate *
        //   0.01
        // ).toFixed(2);
      }
      //   不含税
      if (arr[newindex].no_unit_price && arr[newindex].det_quantity) {
        arr[newindex].no_amount_tax = toFixed(
          fpMul(arr[newindex].no_unit_price, arr[newindex].det_quantity),
          2,
        );
        // newData[index].no_amount_tax = (
        //   row.no_unit_price * row.det_quantity
        // ).toFixed(2);
      }
      //含税
      if (
        arr[newindex].no_unit_price &&
        arr[newindex].det_quantity &&
        reg.test(arr[newindex].tax_rate)
      ) {
        let a = fpMul(arr[newindex].no_unit_price, arr[newindex].det_quantity);
        let b = 1 + arr[newindex].tax_rate * 0.01;

        arr[newindex].amount_tax = toFixed(fpMul(a, b), 2);
        // newData[index].amount_tax = (
        //   row.no_unit_price *
        //   row.det_quantity *
        //   (1 + row.tax_rate * 0.01)
        // ).toFixed(2);
      }
    }
    //   含税金额
    let newarr2 = [];

    newarr2 = arr.filter(item => {
      if (item.amount_tax) {
        return item;
      }
    });
    newarr2 = newarr2.map(item => {
      return item.amount_tax;
    });
    //不含税金额
    let newarr4 = [];

    newarr4 = arr.filter(item => {
      if (item.no_amount_tax) {
        return item;
      }
    });
    newarr4 = newarr4.map(item => {
      return item.no_amount_tax;
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
        hanmoney: 0,
        nomoney: 0,
        detailname: '',
        detailedData: [], //物资明细
      };
      if (this.state.Inputmoney1) {
        editData.hanmoney = Number(this.state.Inputmoney1);
      }
      if (this.state.Inputmoney2) {
        editData.nomoney = Number(this.state.Inputmoney2);
      }
      editData.detailname = this.state.chenkdata;
      editData.detailedData = this.state.materialList;
      // 打印数据
      let newlistdata = this.state.materialList;
      let str2 = this.state.chenkdata;
      let str0 =
        '\n' +
        '设备名称 单位 规格型号 数量 不含税单价 含税单价 税率 税额 不含税金额 含税金额';
      let str1 =
        '\n' +
        '不含税金额合计(元):' +
        this.state.Inputmoney2 +
        '\n' +
        '含税金额合计(元):' +
        this.state.Inputmoney1;
      for (let i = 0; i < newlistdata.length; i++) {
        str0 +=
          '\n' +
          newlistdata[i].name +
          ' ' +
          newlistdata[i].unit +
          ' ' +
          newlistdata[i].size +
          ' ' +
          newlistdata[i].det_quantity +
          ' ' +
          newlistdata[i].no_unit_price +
          ' ' +
          newlistdata[i].unit_price +
          ' ' +
          newlistdata[i].tax_rate +
          ' ' +
          newlistdata[i].tax_amount +
          ' ' +
          newlistdata[i].no_amount_tax +
          ' ' +
          newlistdata[i].amount_tax;
      }
      let str = str2 + str0 + str1;
      console.log(str);
      const { form } = this.props;
      form.setFieldValue('TestSet', str);
      form.setFieldExtendValue('TestSet', editData);
    }

    // this.state.dataSource;
    // this.state.Inputmoney1;
    // this.state.Inputmoney2;
  },
  fieldRender() {
    // fix in codepen
    const { form, runtimeProps } = this.props;
    const { viewMode } = runtimeProps;
    const field = form.getFieldInstance('TestSet');
    const required = form.getFieldProp('SelectPro', 'required');
    const label = form.getFieldProp('TestSet', 'label');
    const tabs = [
      { title: '采购合同' },
      { title: '采购订单' },
      { title: '材料入库' },
    ];
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
          onSubmit={val => {
            const _this = this;
            searchBarSubmit(_this, val, 0);
          }}
          onChange={val => {
            const _this = this;
            searchBarChange(_this, val, 0);
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
                {item.name +
                  `${item.unit ? '/' + item.unit : ''}` +
                  `${item.size ? '/' + item.size : ''}`}
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
          onSubmit={val => {
            const _this = this;
            searchBarSubmit(_this, val, 2);
          }}
          onChange={val => {
            const _this = this;
            searchBarChange(_this, val, 2);
          }}
          showCancelButton
          onCancel={() => this.setState({ showElem3: 'none' })}
        />
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log('onChange', index, tab);
            this.setState({ detdate: 'a1' });
            let newpage = {
              defaultActiveKey: 'a',
              rk_id: ['a'],
              number: '1000',
              page: 1,
              name: '',
            };
            if (index === 0) {
              this.setState({ detdate: 'a1' });
              newpage.rk_id = ['a'];
            } else if (index === 1) {
              this.setState({ detdate: 'b1' });
              newpage.rk_id = ['b'];
            } else if (index === 2) {
              this.setState({ detdate: 'c1' });
              newpage.rk_id = ['c'];
            }
            this.setState({
              allData: newpage,
            });
            this.asyncSetFieldProps(newpage, 2);
          }}
        >
          <div>
            {' '}
            <List className="noWrap">
              {this.state.checkData.map((item, index) => {
                return (
                  <List.Item
                    onClick={this.checkClick.bind(this, item)}
                    key={index}
                    multipleLine
                  >
                    {item.name +
                      `${item.supplier ? '/' + item.supplier : ''}` +
                      `${item.contract_money ? '/' + item.contract_money : ''}`}
                  </List.Item>
                );
              })}
            </List>
          </div>
          <div>
            {' '}
            <List className="noWrap">
              {this.state.checkData.map((item, index) => {
                return (
                  <List.Item
                    onClick={this.checkClick.bind(this, item)}
                    key={index}
                    multipleLine
                  >
                    {item.name +
                      `${item.supplier ? '/' + item.supplier : ''}` +
                      `${
                        item.tax_total_money ? '/' + item.tax_total_money : ''
                      }`}
                  </List.Item>
                );
              })}
            </List>
          </div>
          <div>
            {' '}
            <List className="noWrap">
              {this.state.checkData.map((item, index) => {
                return (
                  <List.Item
                    onClick={this.checkClick.bind(this, item)}
                    key={index}
                    multipleLine
                  >
                    {item.name +
                      `${item.supplier ? '/' + item.supplier : ''}` +
                      `${item.extend_four ? '/' + item.extend_four : ''}`}
                  </List.Item>
                );
              })}
            </List>
          </div>
        </Tabs>
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
      let value = field.getExtendValue() || {};
      if (!value.detailedData) {
        value = field.getValue();
      }
      const {
        hanmoney = 0,
        nomoney = 0,
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
                <label className="m-field-view-label">含税金额合计(元)</label>
                <div className="m-field-view-value">
                  <span>{hanmoney ? Number(hanmoney).toFixed(2) : ''}</span>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="m-field-view">
                <label className="m-field-view-label">不含税金额合计(元)</label>
                <div className="m-field-view-value">
                  <span>{nomoney ? Number(nomoney).toFixed(2) : ''}</span>
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
                          extra="x"
                          onExtraClick={this.onExtraClick}
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
                          {this.state.materialList.length > 0 ? (
                            <div
                              className="dele_item"
                              onClick={this.deleteItem.bind(this, index, item)}
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
                                        <span style={{ color: 'red' }}>
                                          物资名称
                                        </span>
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
                                        <span>数量</span>
                                      </div>
                                    </div>
                                    <div className="m-field-box">
                                      <div className="m-field-content left">
                                        <div className="input-wrapper">
                                          <InputItem
                                            value={item.det_quantity}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'det_quantity',
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
                                            value={item.no_unit_price}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'no_unit_price',
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
                                            value={item.unit_price}
                                            placeholder="请输入"
                                            onChange={e =>
                                              this.onInputchange(
                                                'unit_price',
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
                                            editable={false}
                                            clear
                                            value={item.tax_amount}
                                            placeholder="自动计算"
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
                                            editable={false}
                                            clear
                                            value={item.no_amount_tax}
                                            placeholder="自动计算"
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
                                            editable={false}
                                            clear
                                            value={item.amount_tax}
                                            placeholder="自动计算"
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
      </div>
    );
  },
};

export default FormField;
