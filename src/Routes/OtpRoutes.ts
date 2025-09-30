import express from 'express';
import { sendOTP} from '../controllers/OtpController';

const router = express.Router();

router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);

export default router;
