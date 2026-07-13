import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforproductionsbstocksplatform2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email address');
  }

  const user = await User.create({
    name,
    email,
    password,
    balance: 100000
  });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      avatar: user.avatar,
      createdAt: user.createdAt
    }
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      avatar: user.avatar,
      createdAt: user.createdAt
    }
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId, { name, avatar }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  await user.save();
  return user;
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  return true;
};
