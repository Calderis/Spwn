import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import <§ data.className §> from '../models/<§ data.plurialName §>.model';
<§! data.className == 'User' !§>
  import passwordHash from 'password-hash';
<!§!>

/**
 * Load <§ data.name §> and append to req.
 */
function load(req, res, next, id) {
  <§ data.className §>.get(id)
    .then((<§ data.name §>) => {
      req._<§ data.name §> = <§ data.name §>; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get <§ data.name §>
 * @returns {<§ data.className §>}
 */
function get(req, res) {
  return res.json(req._<§ data.name §>);
}

/**
 * Create new <§ data.name §>
  <§- data.array -> param -§>
    * @property {<§ param.type §>} req.body.<§ param.name §> - The <§ param.name §> of <§ data.name §>.
  <-§->
 * @returns {<§ data.className §>}
 */
function create(req, res, next) {
  const <§ data.name §> = new <§ data.className §>({
    <§- data.array -> param -§>
      <§! data.className == 'User' !§>
        <§! param.name == 'password' !§>
          password: passwordHash.generate(req.body.password),
        <!§!>
      <!§!>
      <§! param.name =!= 'password' !§>
        <§ param.name §>: req.body.<§ param.name §>,
      <!§!>
    <-§->
  });

  <§ data.name §>.save()
    .then(saved<§ data.className §> => res.json(saved<§ data.className §>))
    .catch(e => next(e));
}

/**
 * Update existing <§ data.name §>
  <§- data.array -> param -§>
    * @property {<§ param.type §>} req.body.<§ param.name §> - The <§ param.name §> of <§ data.name §>.
  <-§->
 * @returns {<§ data.className §>}
 */
function update(req, res, next) {
  const <§ data.name §> = req._<§ data.name §>;
  <§- data.array -> param -§>
     <§! data.className == 'User' !§>
        <§! param.name == 'password' !§>
          <§ data.name §>.password = passwordHash.generate(req.body.password);
        <!§!>
    <!§!>
    <§! param.name =!= 'password' !§>
      <§ data.name §>.<§ param.name §> = req.body.<§ param.name §>;
    <!§!>
  <-§->
  <§ data.name §>.save()
    .then(saved<§ data.className §> => res.json(saved<§ data.className §>))
    .catch(e => next(e));
}

/**
 * Get <§ data.name §> list.
 * @property {number} req.query.skip - Number of <§ data.plurialName §> to be skipped.
 * @property {number} req.query.limit - Limit number of <§ data.plurialName §> to be returned.
 * @returns {<§ data.className §>[]}
 */
function list(req, res, next) {
  const params = req.query;
  const limit = req.query.limit || 50;
  const skip = req.query.skip || 0;
  const sort = parseInt(req.query.sort) || 1;
  delete params.limit;
  delete params.skip;
  delete params.sort;
  <§ data.className §>.list({ limit, skip, sort }, params)
    .then(<§ data.plurialName §> => res.json(<§ data.plurialName §>))
    .catch(e => next(e));
}

/**
 * Delete <§ data.name §>.
 * @returns {<§ data.className §>}
 */
function remove(req, res, next) {
  const <§ data.name §> = req._<§ data.name §>;
  <§ data.name §>.remove()
    .then(deleted<§ data.className §> => res.json(deleted<§ data.className §>))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
