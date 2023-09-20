const express = require("express");
const articalRouter = express.Router();
const passport = require("passport");
const Artical = require("../model/Artical");

//api tao ao 
articalRouter.post(
    "/createArtical",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { title, content } = req.body;

        const newArtical = new Artical({ title, content });

        newArtical.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'Bài báo đã tồn tại',
                            msgError: true,
                        },
                        existArtical: true,
                    });
                }
                return res.status(203).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi thêm Bài báo vui lòng nhập đủ thông tin',
                        msgError: true,
                    },
                    err,
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Thêm Bài báo thành công',
                        msgError: false,
                    },
                    result,
                });
            }
        })
    });

//api lay thong tin 1 Bài báo
articalRouter.post(
    "/getArtical",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Artical.findOne({ _id }, (err, result) => {
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
                            msgBody: 'Bài báo không có sẵn',
                            msgError: true,
                        },
                        existArtical: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy Bài báo thành công',
                            msgError: true,
                        },
                        existArtical: true,
                        result,
                    })
                }
            }
        })
    }
)

//api lay all ao
articalRouter.get(
    "/getAllArtical",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Artical.find((err, result) => {
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
                            msgBody: 'Danh sách bài báo không có sẵn',
                            msgError: true,
                        },
                        existArtical: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả Bài báo thành công',
                            msgError: true,
                        },
                        existArtical: true,
                        result,
                    })
                }
            }
        })
    }
)

//api search name

articalRouter.post(
    "/getAllArtical/search",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const search = req.body.search;
        Artical.find((err, result) => {
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
                            msgBody: 'Danh sách bài báo không có sẵn',
                            msgError: true,
                        },
                        existArtical: false,
                    })
                }
                else {
                    result = result.filter(artical => artical.name.toLowerCase().includes(search.toLowerCase()))
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả Bài báo theo tìm kiếm thành công',
                            msgError: true,
                        },
                        existArtical: true,
                        result,
                    })
                }
            }
        })
    }
)

//api like, comment ao
articalRouter.patch(
    "/updateArtical",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({ _id, title, content } = req.body);

        const updates = data;

        const options = { new: true };
        Artical.updateOne({ _id }, updates, options).then((result) => {
            if (result.nModified < 1) {
                return res.status(201).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi update Bài báo',
                        msgError: true,
                    },
                })
            }
            return res.status(200).json({
                success: true,
                message: {
                    msgBody: 'Update Bài báo thành công',
                    msgError: false,
                },
                result,
            })
        }).catch((err) => {
            if (err.code === 11000) {
                return res.status(201).json({
                    success: false,
                    message: {
                        msgBody: 'Bài báo đã tồn tại',
                        msgError: true,
                    },
                    existArtical: true,
                })
            }
            return res.status(400).json({
                success: false,
                message: {
                    msgBody: 'Có lỗi khi update Bài báo',
                    msgError: true,
                },
                err,
            })
        })
    }
)

//api xóa bài hát

articalRouter.delete(
    "/deleteArtical",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { _id } = req.body;
        Artical.deleteOne({ _id }, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: {
                        msgBody: 'Xóa Bài báo không thành công',
                        msgError: true,
                    },
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Xóa Bài báo thành công',
                        msgError: false,
                    },
                });
            }
        })
    })

module.exports = articalRouter;