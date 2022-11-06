const express = require("express");
const musicMp4Router = express.Router();
const passport = require("passport");
const MusicMp4 = require("../model/MusicMp4");
const User = require("../model/User");

//api tao bai hat 
musicMp4Router.post(
    "/createMp4",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { keyId, name } = req.body;

        const newMusicMp4 = new MusicMp4({ keyId, name, like: [], comment: [] });
        MusicMp4.findOne({ keyId }, (err, exists) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: {
                        msgBody: 'Có lỗi khi lấy dữ liệu',
                        msgError: true,
                    },
                    err,
                });
            } else {
                if (exists) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'bài nhạc đã tồn tại',
                            msgError: true,
                        },
                        existsMusicMp4: true,
                    });
                } else {
                    newMusicMp4.save((err, result) => {
                        if (err) {
                            if (err.code === 11000) {
                                return res.status(203).json({
                                    success: false,
                                    message: {
                                        msgBody: 'Bài nhạc đã được thêm',
                                        msgError: true,
                                    },
                                    existMusic: true,
                                });
                            }
                            return res.status(203).json({
                                success: false,
                                message: {
                                    msgBody: 'Có lỗi khi thêm bài nhạc vui lòng nhập đủ thông tin',
                                    msgError: true,
                                },
                                err,
                            });
                        } else {
                            return res.status(200).json({
                                success: true,
                                message: {
                                    msgBody: 'Thêm bài hát thành công',
                                    msgError: false,
                                },
                                result,
                            });
                        }
                    })
                }
            }
        })
    });

//api lay thong tin bai hat
musicMp4Router.get(
    "/getMp4",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { keyId } = req.body;
        MusicMp4.findOne({ keyId }, (err, result) => {
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
                            msgBody: 'Bài hát không có sẵn',
                            msgError: true,
                        },
                        existMusic: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy bài hát thành công',
                            msgError: true,
                        },
                        existMusic: true,
                        result,
                    })
                }
            }
        })
    }
)

//api lay tất cả thong tin bai hat
musicMp4Router.get(
    "/getAllMp4",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        MusicMp4.find((err, result) => {
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
                            msgBody: 'Bài hát không có sẵn',
                            msgError: true,
                        },
                        existMusic: false,
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Lấy tất cả bài hát thành công',
                            msgError: true,
                        },
                        existMusic: true,
                        result,
                    })
                }
            }
        })
    }
)

//api sửa thông tin, like, comment

musicMp4Router.patch(
    "/updateMp4",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({ username, keyId, like, comment } = req.body);

        const updates = data;

        const options = { new: true };

        User.findOne({ username }, (err, user) => {
            if (err)
                res.status(500).json({
                    message: { msgBody: "Error", msgError: true },
                });
            if (user) {
                MusicMp4.updateOne({ keyId }, updates, options).then((result) => {
                    if (result.nModified < 1) {
                        return res.status(201).json({
                            success: false,
                            message: {
                                msgBody: 'Có lỗi khi update bài hát',
                                msgError: true,
                            },
                        })
                    }
                    return res.status(200).json({
                        success: true,
                        message: {
                            msgBody: 'Update bài hát thành công',
                            msgError: false,
                        },
                        result,
                    })
                }).catch((err) => {
                    if (err.code === 11000) {
                        return res.status(201).json({
                            success: false,
                            message: {
                                msgBody: 'Bài hát đã tồn tại',
                                msgError: true,
                            },
                            existMusic: true,
                        })
                    }
                    return res.status(400).json({
                        success: false,
                        message: {
                            msgBody: 'Có lỗi khi update bài hát',
                            msgError: true,
                        },
                        err,
                    })
                })
            }
            else {
                res.status(201).json({
                    message: { msgBody: "Ban Can Dang Nhap", msgError: true },
                });
            }
        });
    }
)

//api xóa bài hát

musicMp4Router.delete(
    "/deleteMp4",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { keyId } = req.body;

        MusicMp4.deleteOne({ keyId }, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: {
                        msgBody: 'Xóa bài hát không thành công',
                        msgError: true,
                    },
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: {
                        msgBody: 'Xóa bài hát thành công',
                        msgError: false,
                    },
                });
            }
        })
    })

module.exports = musicMp4Router;