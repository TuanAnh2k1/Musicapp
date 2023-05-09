const express = require("express");
const vnPayRouter = express.Router();
const passport = require("passport");
const Card = require("../model/Card");

//api tao thong tin the ngan hang 
vnPayRouter.get('/create_payment_url', function (req, res, next) {
    // var ipAddr = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;

    // var config = require('config');
    // var dateFormat = require('dateformat');


    var tmnCode = "WSGPM5XL";
    var secretKey = "GZFFILDPTSSHPUDWBCQAVTZUHNGRCVET";
    var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    var returnUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    var date = new Date();

    var createDate = '10/9/2023';
    var orderId = '12345';
    var amount = 100000 * 100;
    var bankCode = 'NCB';

    var orderInfo = "Thanh toán đơn hàng";
    var orderType = "biuldpayment";
    var locale = 'vn';
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    // vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    // var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    // vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)
});
// Vui lòng tham khảo thêm tại code demo

module.exports = vnPayRouter;