const SECRET = "dfgdgf"
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401)
        .json({ error: "missing auth header" })
    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ error: "wrong token format" })
    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error)
    }
}
module.exports = auth;