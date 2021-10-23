import httpStatus from 'http-status';

/**
 * Middleware to authorize user, endpoint must have authenticate middleware
 *
 * @export
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.Next} next
 * @param {Array<ProfileType>} profileList
 * @returns void
 */
export default function authorize(profileList) {
  return (req, res, next) => {
    const hasAccess = req.user && profileList.find(o => o === req.user.profileType);

    return hasAccess ? next() : res.sendStatus(httpStatus.FORBIDDEN);
  };
}
