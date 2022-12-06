const getIndex = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello!",
  });
};

export default {
  getIndex,
};
