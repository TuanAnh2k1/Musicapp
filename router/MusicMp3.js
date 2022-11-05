const express = require("express");
const musicMp3Router = express.Router();
const passport = require("passport");
const MusicMp3 = require("../model/MusicMp3");

//api tao bai hat 
musicMp3Router.post(
    "/createMp3",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { name, describe, image, link, like, comment } = req.body;

        const newMusicMp3 = new MusicMp3({ name, describe, image, link, like, comment });
        MusicMp3.findOne({ name: name }, (err, exists) => {
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
                        existsMusicMp3: true,
                    });
                } else {
                    newMusicMp3.save((err, result) => {
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

//api lay thong tin 1 bai hat
musicMp3Router.get(
    "/getMp3",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { name } = req.body;
        MusicMp3.findOne({ name }, (err, result) => {
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

//api lay all bai hat
musicMp3Router.get(
    "/getAllMp3",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        MusicMp3.find((err, result) => {
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

//api like, comment bai hat
musicMp3Router.patch(
    "/updateMp3",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({ name, like, comment } = req.body);

        const updates = data;

        const options = { new: true };

        MusicMp3.updateOne({ name }, updates, options).then((result) => {
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
)

//api xóa bài hát

musicMp3Router.delete(
    "/deleteMp3",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { name } = req.body;
        MusicMp3.deleteOne({ name }, (err) => {
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

module.exports = musicMp3Router;