const express = require("express");
const musicMp3Router = express.Router();
const passport = require("passport");
const MusicMp3 = require("../model/MusicMp3");

//api tao bai hat 
musicMp3Router.post(
    "/createMp3",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { name, describe, image, link } = req.body;
        const account = req.user._id;

        const newMusicMp3 = new MusicMp3({ name, describe, image, link, account });
        MusicMp3.findOne({ account: account }, (err, exists) => {
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

//api lay thong tin bai hat
musicMp3Router.get(
    "/getMp3",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const account = req.user._id;
        MusicMp3.findOne({ account }, (err, result) => {
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

//api xóa bài hát

musicMp3Router.delete(
    "/deleteMp3",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const account = req.user._id;

        MusicMp3.deleteOne({ account }, (err) => {
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