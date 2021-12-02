const changePage = (_this: any, page: any, rk_id?: string) => {
  const newpage = _this.state.allData;
  newpage.page = page;
  if (rk_id) {
    newpage.rk_id = [rk_id];
  }
  console.log(newpage);
  _this.setState({
    allData: newpage,
  });
  _this.asyncSetFieldProps(newpage);
};

export { changePage };
