const { verify } = require("../utils/jwt");
const { fetchData } = require("../utils/postgres");

const verifyRole = (...roles) => {
  return async(req, res, next) => {
    let { token } = req.headers;

    if(!token){
        res.status(403).send({
            success: false,
            message: "Give token"
        })
        return
    }

    let { id } = verify(token);

    let [user] = await fetchData("SELECT * FROM users where id = $1", id);

    if (user) {
        if(roles.find(el => el == user.role)){
            next()
        } else {
            res.status(403).send({
                success: false,
                message: "You are not allowed"
              });
        }
    } else {
      res.status(403).send({
        success: false,
        message: "Error token",
      });
    }
  };
};


module.exports = verifyRole