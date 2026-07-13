import * as adminService from '../services/adminService.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getPlatformAnalytics();
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id, role);
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
