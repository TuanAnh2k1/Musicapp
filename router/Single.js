const express = require("express");
const singleRouter = express.Router();
const passport = require("passport");
const Single = require("../model/Single");

//api tao đơn hàng 
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
            status,
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
            quantity,
            status
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

//api lay thong tin 1 đơn hàng theo user
singleRouter.post(
    "/getSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { idUser } = req.body;
        Single.find({ idUser }, (err, result) => {
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

//api lay all đơn hàng
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

//api sua đơn hàng
singleRouter.patch(
    "/updateSingle",
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const data = ({
            _id,
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
            status
        } = req.body);

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

singleRouter.get('/best_selling', (req, res) => {
    const query = `
          SELECT s.idShirt, p.name, COUNT(s.idShirt) AS totalSold
          FROM singles s
          INNER JOIN shirts p ON s.idShirt = p._id
          WHERE s.status = '2'
          GROUP BY s.idShirt, p.name
          ORDER BY totalSold DESC
          LIMIT 1;
        `;

    // Thực hiện truy vấn đến cơ sở dữ liệu
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Không tìm thấy đơn hàng bán chạy nhất' });
            } else {
                const bestSellingOrder = results[0];

                // Lấy thông tin chi tiết của đơn hàng bán chạy nhất
                const getOrderQuery = `
                SELECT *
                FROM singles
                WHERE idShirt = ${bestSellingOrder.idShirt}
                  AND status = '2'
                LIMIT 1;
              `;

                connection.query(getOrderQuery, (error, orderResults) => {
                    if (error) {
                        res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
                    } else {
                        if (orderResults.length === 0) {
                            res.status(404).json({ message: 'Không tìm thấy đơn hàng bán chạy nhất' });
                        } else {
                            const bestSellingOrderDetails = orderResults[0];
                            res.json(bestSellingOrderDetails);
                        }
                    }
                });
            }
        }
    });
});

module.exports = singleRouter;