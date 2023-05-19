const express = require("express");
const saleRouter = express.Router();
const passport = require("passport");
const Sale = require("../model/Sale");

//api tao thong tin the ngan hang 
saleRouter.post(
    "/createSale",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const {
            phan_tram,
        } = req.body;

        const newSale = new Sale({
            phan_tram,
        });

        newSale.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'Thông tin thẻ đã tồn tại',
                            msgError: true,
                        },
                        existSale: true,
                    });
                }
                return res.status(203).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi tạo thông tin vui lòng nhập đủ thông tin',
                        msgError: true,
                    },
                    err,
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Thêm thông tin thẻ thành công',
                        msgError: false,
                    },
                    result,
                });
            }
        })
    });

saleRouter.get(
    "/getAllSale",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Sale.find((err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi lấy dữ liệu',
                        msgError: true,
                    },
                    err,
                })
            }
            else {
                if (!result) {
                    return res.status(201).json({
                        success: false,
                        message: {
                            msgBody: 'Danh sách sảm phẩm không có sẵn',
                            msgError: true,
                        },
                        existSale: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả sản phẩm thành công',
                            msgError: true,
                        },
                        existSale: true,
                        result,
                    })
                }
            }
        })
    }
)

//api sua sale
saleRouter.patch(
    "/updateSale",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({
            _id,
            phan_tram
        } = req.body);

        const updates = data;

        const options = { new: true };
        Sale.updateOne({ _id }, updates, options).then((result) => {
            if (result.nModified < 1) {
                return res.status(201).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi update sản phẩm',
                        msgError: true,
                    },
                })
            }
            return res.status(200).json({
                success: true,
                message: {
                    msgBody: 'Update sản phẩm thành công',
                    msgError: false,
                },
                result,
            })
        }).catch((err) => {
            if (err.code === 11000) {
                return res.status(201).json({
                    success: false,
                    message: {
                        msgBody: 'Đơn hàng đã tồn tại',
                        msgError: true,
                    },
                    existSale: true,
                })
            }
            return res.status(400).json({
                success: false,
                message: {
                    msgBody: 'Có lỗi khi update sản phẩm',
                    msgError: true,
                },
                err,
            })
        })
    }
)

module.exports = saleRouter;