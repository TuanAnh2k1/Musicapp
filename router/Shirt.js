const express = require("express");
const shirtRouter = express.Router();
const passport = require("passport");
const Shirt = require("../model/Shirt");

//api tao bai hat 
shirtRouter.post(
    "/createShirt",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { name, describe, image, price, supplier } = req.body;

        const newShirt = new Shirt({ name, describe, image, price, supplier });

        newShirt.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'Sản phẩm đã tồn tại',
                            msgError: true,
                        },
                        existShirt: true,
                    });
                }
                return res.status(203).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi thêm sản phẩm vui lòng nhập đủ thông tin',
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
shirtRouter.post(
    "/getShirt",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Shirt.findOne({ _id }, (err, result) => {
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
                            msgBody: 'Sản phẩm không có sẵn',
                            msgError: true,
                        },
                        existShirt: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy sản phẩm thành công',
                            msgError: true,
                        },
                        existShirt: true,
                        result,
                    })
                }
            }
        })
    }
)

//api lay all bai hat
shirtRouter.get(
    "/getAllShirt",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Shirt.find((err, result) => {
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
                        existShirt: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả sản phẩm thành công',
                            msgError: true,
                        },
                        existShirt: true,
                        result,
                    })
                }
            }
        })
    }
)

//api like, comment bai hat
shirtRouter.patch(
    "/updateShirt",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({ _id, name, describe, image, price, supplier } = req.body);

        const updates = data;

        const options = { new: true };
        Shirt.updateOne({ _id }, updates, options).then((result) => {
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
                        msgBody: 'Sản phẩm đã tồn tại',
                        msgError: true,
                    },
                    existShirt: true,
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

shirtRouter.delete(
    "/deleteShirt",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Shirt.deleteOne({ _id }, (err) => {
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

module.exports = shirtRouter;