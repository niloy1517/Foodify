import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userAuth.model.js';
import { transporter } from '../config/nodeMailer.js';


// ACCOUNT CREATE FUNCTION
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check requied fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // 2. Check email type
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            })
        }

        // 3. Check password length at least six digit 
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            })
        }

        // 4. Password hash
        const hash_password = await bcrypt.hash(password, 10)

        // 5. Create user
        const user = await userModel.create({
            profile: { name: name, email: email },
            auth: { passwordHash: hash_password }
        })

        // 6. Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        // 7. Token add in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        // 8. Send account created message to user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Hi ${name}`,
            text: `
                Thank you for registering at Foodify!  
                Your account has been created successfully.  

                Now you can explore delicious foods, add them to your cart, and enjoy quick delivery.  

                Happy ordering! 🍔🍕  
                The Foodify Team`,
        }

        await transporter.sendMail(mailOptions)

        res.status(201).json({
            success: true,
            message: 'User created successfully'
        })

    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({
                success: false,
                message: 'User already exist'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


// ACCOUNT LOGIN FUNCTION
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check requied fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const user = await userModel.findOne({ 'profile.email': email })

        // 2. User existing & email validation
        if ((!user) || (!validator.isEmail(email))) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a vaild email!'
            })
        }

        // 3. Check password match
        const check_password = await bcrypt.compare(password, user.auth.passwordHash)

        if (!check_password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid password!'
            })
        }

        // 4. Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })


        // 5. Token add in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        // 6. Send account login message to user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Hi ${user.profile.name}`,
            text: `
                You have successfully logged in to your Foodify account.
                
                If this was you, no further action is needed.  
                If you did not login, please reset your password immediately to secure your account.  

                Stay safe,  
                The Foodify Team
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
        console.log(error)
    }
}


// ACCOUNT LOGOUT FUNCTION
const logout = async (req, res) => {
    try {
        // 1. Remove token from cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "Account logout successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


// PASSWORD RESET OTP SEND FUNCTION
const sendResetOpt = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check requied fields
        if (!email) {
            return res.status(404).json({
                success: false,
                message: 'Enter your email address'
            })
        }

        // 2. Check exist user
        const user = await userModel.findOne({ 'profile.email': email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            })
        }

        // 3. Generate otp 
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.passwordReset.otp = otp;
        user.passwordReset.otpExpireAt = Date.now() + 30 * 60 * 1000;

        await user.save()

        // 4. Send reset password otp by email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.profile.email,
            subject: `Hi ${user.profile.name}`,
            text: `
                Hi ${user.profile.name},

                We received a request to reset your password.  
                Your OTP code is: ${otp}

                This OTP will expire in 30 minutes.  
                If you did not request this, please ignore this email.

                Stay safe,  
                The Foodify Team
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success: true,
            message: 'Otp send successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


//REST PASSWORD FUNCTION
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // 1. Check requied fields
        if (!otp) {
            return res.status(404).json({
                success: false,
                message: 'Please enter 6-digit otp!'
            })
        }

        if (!newPassword) {
            return res.status(404).json({
                success: false,
                message: 'Please enter new password'
            })
        }

        // 2. Check exist user
        const user = await userModel.findOne({ 'profile.email': email });

        // 3. Check otp & password validation
        if (user.passwordReset.otp !== otp) {
            return res.status(404).json({
                success: false,
                message: 'Please enter vaild otp'
            })
        }

        if (user.passwordReset.otpExpireAt < Date.now()) {
            return res.status(404).json({
                success: false,
                message: 'Please enter vaild otp'
            })
        }

        if (newPassword.length < 6) {
            return res.status(404).json({
                success: false,
                message: 'Password must be at least 6 characters long!'
            })
        }

        // 4. Password hash 
        const hash_password = await bcrypt.hash(newPassword, 10)


        user.auth.passwordHash = hash_password;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save()

        // 4. Send password rest message by email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.profile.email,
            subject: 'Password Reset Successful',
            text: `
                Your password has been reset successfully. 
                If you did not perform this action, please contact our support team immediately.
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


//CHANGE PASSWORD OTP SEND FUNCTION
const sendChangePasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. check exist user
        const user = await userModel.findOne({ 'profile.email': email })

        // 2. Generate otp
        const otp = String(Math.floor(100000 + Math.random() * 900000))


        user.changePassword.otp = otp;
        user.changePassword.otpExpireAt = Date.now() + 1 * 60 * 1000;

        await user.save()

        // 3. Send change password otp by email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `HIi ${user.profile.email}`,
            text: `
              Hi ${user.profile.name},

                We received a request to change your password.  
                Your OTP code is: ${otp}

                This OTP will expire in 1 minutes.  
                If you did not request this, please ignore this email.

                Stay safe,  
                The Foodify Team
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success: true,
            message: 'Otp send successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


//CHANGE PASSWORD OTP VERIFY FUNCTION
const changePasswordOtpVerify = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;

        // 1. Check exist user
        const user = await userModel.findById(userId)

        // 2. Check otp validation 
        if (!otp === user.changePassword.otp) {
            return res.status(404).json({
                success: false,
                message: 'Please enter vaild otp'
            })
        }

        if (user.changePassword.otpExpireAt < Date.now()) {
            return res.status(404).json({
                success: false,
                message: 'Please enter vaild otp'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Otp verify successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


//CHANGE PASSWORD FUNCTION
const changePassword = async (req, res) => {
    try {
        const userId = req.userId;

        const { currentPassword, newPassword, confirmPassword } = req.body;

        // 1. Check required fields
        if (!currentPassword) {
            return res.json({ success: false, message: 'Enter your current password' })
        }

        if (!newPassword) {
            return res.json({ success: false, message: 'Enter your new password' })
        }

        if (!confirmPassword) {
            return res.json({ success: false, message: 'Enter your confirm password' })
        }

        // 2. Check exsit user
        const user = await userModel.findById(userId)

        // 3. Check password validation
        const password = await bcrypt.compare(currentPassword, user.auth.passwordHash)


        if (!password) {
            return res.status(404).json({
                success: false,
                message: 'Enter valid password'
            })
        }

        if (newPassword.length < 6) {
            return res.status(404).json({
                success: false,
                message: 'Enter 6-digit password'
            })
        }

        if (confirmPassword.length < 6) {
            return res.status(404).json({
                success: false,
                message: 'Enter 6-digit password'

            })
        }

        if (newPassword != confirmPassword) {
            return res.status(404).json({
                success: false,
                message: 'Enter same password'
            })
        }

        // 4. Password hash & store database
        const hash_password = await bcrypt.hash(newPassword, 10);

        user.auth.passwordHash = hash_password;
        user.changePassword.otp = '';
        user.changePassword.otpExpireAt = '';

        await user.save()

        // 5. Send password change message by email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.profile.email,
            subject: 'Password Reset Successful',
            text: `
                Your password has been reset successfully. 
                If you did not perform this action, please contact our support team immediately.
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success: true,
            message: 'Password change successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

//GET USER PROFILE DATA
const getUserProfileData = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Check exist user
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Profile data not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Profile data found',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


export { register, login, logout, sendResetOpt, resetPassword, sendChangePasswordOtp, changePasswordOtpVerify, changePassword, getUserProfileData }