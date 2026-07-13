import * as authService from '../services/authService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: result.token,
      user: result.user,
      data: result
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: result.token,
      user: result.user,
      data: result
    });
  } catch (error) {
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await authService.updateUserProfile(req.user._id, { name, avatar });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changeUserPassword(req.user._id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.message.includes('incorrect')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
