const express = require("express");
const cardRouter = express.Router();
const passport = require("passport");
const Card = require("../model/Card");

//api tao thong tin the ngan hang 
cardRouter.post(
    "/createCard",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const {
            tenchuthe,
            kieuthe,
            sothe,
            socvd,
            ngayhethan,
        } = req.body;

        const newCard = new Card({
            tenchuthe,
            kieuthe,
            sothe,
            socvd,
            ngayhethan,
        });

        newCard.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    return res.status(203).json({
                        success: false,
                        message: {
                            msgBody: 'Thông tin thẻ đã tồn tại',
                            msgError: true,
                        },
                        existCard: true,
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

module.exports = cardRouter;