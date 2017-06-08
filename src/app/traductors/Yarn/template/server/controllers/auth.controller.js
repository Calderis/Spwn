import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/users.model';

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const params = { email: req.body.email }
  const limit = 1;
  User.list({ limit }, params)
    .then(users => {
      if(users.length === 1){
        if(passwordHash.verify(req.body.password, users[0].password)){
          const token = jwt.sign({
            user: users[0]
          }, config.jwtSecret);
          res.json({
            token,
            user: users[0]
          })
        } else {
          const err = new APIError('Bad password', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
      } else {
        const err = new APIError('Bad email', httpStatus.NOT_FOUND, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
