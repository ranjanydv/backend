const CustomError = require('../errors')

const checkPermissions = async (requestUser, resourceUserId) => {
    // console.log(requestUser);
    // console.log(resourceUserId)
    // console.log(typeof resourceUserId)
    if (requestUser.role === 'admin') return
    // some features are only limited to owners
    // if (requestUser.role === 'owner') {
    //     if (requestUser.userId === resourceUserId) {
    //         return
    //     } else {
    //         throw new CustomError.UnauthorizedError(
    //             "Mind own business bitch! Trying to look other person's stuff"
    //         )
    //     }
    // }
    if (requestUser.userId === resourceUserId.toString()) return
    throw new CustomError.UnauthorizedError(
        "Mind own business bitch! Trying to look other person's stuff"
    )
}
module.exports = {checkPermissions}
