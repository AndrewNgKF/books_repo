import User from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const newUser = await User.create({
      ...req.body,
      isPendingApproval: true,
      pendingChanges: {
        pendingRequestMadeBy: req.user._id,
        name: req.body.name,
      },
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const editUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        pendingChanges: {
          name: req.body.name ? req.body.name : undefined,
          role: req.body.role ? req.body.role : undefined,
          pendingRequestMadeBy: req.user.id,
        },
        isPendingApproval: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const approveUserChanges = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });

    if (!user.isPendingApproval)
      return res.status(400).json({
        status: "failed",
        message: "User is not pending approval",
      });

    if (user.pendingChanges.pendingRequestMadeBy.equals(req.user._id))
      return res.status(400).json({
        status: "failed",
        message: "You cannot approve your own changes",
      });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: user.pendingChanges.name ? user.pendingChanges.name : user.name,
        role: user.pendingChanges.role ? user.pendingChanges.role : user.role,
        isPendingApproval: false,
        wasApprovedBy: req.user._id,
        approvedDate: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const markUserForDeletion = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        pendingChanges: {
          pendingDeletion: true,
          pendingRequestMadeBy: req.user.id,
        },
        isPendingApproval: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User marked for deletion",
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const approveUserDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });

    if (!user.pendingChanges.pendingDeletion)
      return res.status(400).json({
        status: "failed",
        message: "User is not pending deletion",
      });

    if (user.pendingChanges.pendingRequestMadeBy.equals(req.user._id))
      return res.status(400).json({
        status: "failed",
        message: "You cannot approve your own changes",
      });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

export default {
  getAllUsers,
  addUser,
  getUser,
  editUser,
  approveUserChanges,
  markUserForDeletion,
  approveUserDeletion,
};
