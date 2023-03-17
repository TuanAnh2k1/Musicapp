const express = require("express");
const singleRouter = express.Router();
const passport = require("passport");
const Single = require("../model/Single");

//api tao bai hat 
singleRouter.post(
    "/createSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const {
            idShirt,
            idUser,
            name,
            describe,
            image,
            price,
            supplier,
            email,
            phone,
            address,
            quantity,
        } = req.body;

        const newSingle = new Single({
            idShirt,
            idUser,
            name,
            describe,
            image,
            price,
            supplier,
            email,
            phone,
            address,
            quantity
        });

        newSingle.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'Đơn hàng đã tồn tại',
                            msgError: true,
                        },
                        existSingle: true,
                    });
                }
                return res.status(203).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi tạo đơn hàng vui lòng nhập đủ thông tin',
                        msgError: true,
                    },
                    err,
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Thêm sản phẩm thành công',
                        msgError: false,
                    },
                    result,
                });
            }
        })
    });

//api lay thong tin 1 sản phẩm
singleRouter.post(
    "/getSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Single.findOne({ _id }, (err, result) => {
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
                            msgBody: 'Đơn hàng không có sẵn',
                            msgError: true,
                        },
                        existSingle: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy sản phẩm thành công',
                            msgError: true,
                        },
                        existSingle: true,
                        result,
                    })
                }
            }
        })
    }
)

//api lay all bai hat
singleRouter.get(
    "/getAllSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Single.find((err, result) => {
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
                        existSingle: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả sản phẩm thành công',
                            msgError: true,
                        },
                        existSingle: true,
                        result,
                    })
                }
            }
        })
    }
)

//api like, comment bai hat
singleRouter.patch(
    "/updateSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({ _id, name, describe, image, price, supplier } = req.body);

        const updates = data;

        const options = { new: true };
        Single.updateOne({ _id }, updates, options).then((result) => {
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
                    existSingle: true,
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

//api xóa bài hát

singleRouter.delete(
    "/deleteSingle",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Single.deleteOne({ _id }, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: {
                        msgBody: 'Xóa sản phẩm không thành công',
                        msgError: true,
                    },
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Xóa sản phẩm thành công',
                        msgError: false,
                    },
                });
            }
        })
    })

module.exports = singleRouter;