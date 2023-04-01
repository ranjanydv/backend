const CustomError = require('../errors')

const onlyUsersBid = async (requestUser, resourceUserId) => {
    if (requestUser.role === 'user') return
    if (requestUser.userId === resourceUserId.toString()) {
        throw new CustomError.UnauthorizedError(
            "Bitch!! You cannot bid on your own item"
        )
    }

}
module.exports = {onlyUsersBid}
