export const successResponse = (req, res, data, code = 200) => {
  return res.send({
    code,
    data: data,
    success: true
  });
};

export const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) => {
  return res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false
  });
};

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach(f => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? errors.join(", ") + " are required fields." : "";
};

export const uniqueId = (length = 13) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
