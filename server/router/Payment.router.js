const express = require('express');
const { auth, isStudent } = require('../middlewares/auth.middleware');
const { createOrder, verifySignature, sendPaymentSuccessEmail } = require('../controllers/Payment.controller');
const router = express.Router();

// ************************************************************************************************
//                                         Payment Route                                                  
// ************************************************************************************************
router.post("/capturePayment", auth, isStudent, createOrder)
// http://localhost:4000/api/v1/payment/capturePayment
router.post("/verifySignature", auth , isStudent , verifySignature);
// http://localhost:4000/api/v1/payment/verifySignature
router.post("/sendPaymentSuccessEmail", auth , isStudent , sendPaymentSuccessEmail);
// http://localhost:4000/api/v1/payment/sendPaymentSuccessEmail

module.exports = router;