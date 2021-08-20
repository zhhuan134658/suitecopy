// 本地代理
// anyproxy --intercept --rule proxy.js

module.exports = {
    summary: 'a rule to modify response',
    *beforeSendRequest(requestDetail) {
        let path = requestDetail.url;
        let headers = requestDetail.requestOptions;

        // 如果是xxx的js，那么就修改为请求本地
        if (path.match(/.*dev\.dingtalk\.com\/main\.bundle\.js/)) {
            var newOption = Object.assign({}, requestDetail.requestOptions, {
                hostname: '127.0.0.1', // 本地ip
                port: 3001,
                headers: {...headers}
            });
            return {
                protocol: 'http',
                requestOptions: newOption
            }
        }
    },

};