export function success(res, data = {}, code = 200, message = "Request successful",) {
  return res.status(code).json({
    code,
    status: "success",
    message,
    data,
  });
}

export function error(res, code = 500, message = "Something went wrong", type = "InternalError", details = null) {
  return res.status(code).json({
    code,
    status: "error",
    message,
    error: {
      type,
      details,
    },
  });
}
