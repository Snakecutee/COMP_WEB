
const {
    signToken,
    register,
    generateRefreshToken,
    refreshJwtToken,
    revokeToken,
    changePassword,
  } = require("../service/auth.service");

  
  const authenticateController = {
    login: async (req, res) => {
        if(req.user.deleted) {
            res.status(400).json({message: "Your Account had been deactived, Please contact administrator for more detail"})
        }
        else {
            const refreshToken = await generateRefreshToken(req.user, req.ip);
            if (req.isAuthenticated()) {
              res.cookie("refresh-token", refreshToken.token, {
                httpOnly: true,
                maxAge: 30 * 64800,
                secure: false,
              });
              res.status(200).json({
                status: 200,
                user: req.user,
                isAuthenticated: true,
                token: signToken(req.user?.username),
              });
            }
        }
    },
    register: async (req, res) => {
        const registerAccount = req.body;
        const origin = req.get('origin')
        try {
            const createAccount = await register(registerAccount, origin);
            res.status(201).json({
                message: "Account registed successfully",
                status: 201,
                account: createAccount,
            });
        } catch (error) {
            res.status(400).json({message: error.message, status: 400});
        }
    },
    refeshToken: async (req, res) => {
        const refreshToken = req.cookies["refresh-token"];
        try {
            const responseData = await refreshJwtToken(refreshToken);
            res.status(200).json({...responseData})

        } catch (error) {
            console.log(error.message);
            res.status(400).json({message: error.message, status: 400})
        }
    },
    changePassword: async (req, res) => {
        const user = req.user;
        const {oldPassword, newPassword} = req.body;
        try {
            await changePassword(user, oldPassword, newPassword);
            res.status(200).json({message: "Password Changed"})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    },
    logout: async (req, res) => {
        const { refreshToken } = req.body;
        try {
            await revokeToken(refreshToken);
            res.clearCookie('refresh-token')
            res.status(200).json({ message: "lougout success", status: 200 });
        } catch (error) {
            res
                .status(400)
                .json({ message: error.message, status: 400 });

        }
    }
}

module.exports = authenticateController;