const express = require("express");
const musicMp4Router = express.Router();
const passport = require("passport");
const MusicMp4 = require("../model/MusicMp4");

//api tao bai hat 
musicMp4Router.post(
    "/createMp4",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { keyId, name, like } = req.body;

        const newMusicMp4 = new MusicMp4({ keyId, name, like });
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
    passport.authenticate('jwt', { session: false }),
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