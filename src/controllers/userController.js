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

const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);

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

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: user.pendingChanges.name ? user.pendingChanges.name : user.name,
        role: user.pendingChanges.role ? user.pendingChanges.role : user.role,
        pendingChanges: {
          name: undefined,
          role: undefined,
        },
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: {
        user: null,
      },
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
  approveUser,
  deleteUser,
};
