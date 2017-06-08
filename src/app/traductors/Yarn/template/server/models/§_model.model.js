import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * <§ data.className §> Schema
 */
const <§ data.className §>Schema = new mongoose.Schema({
  
  <§- data.array -> param -§>
    <§ param.name §>: {
      <§! param.type == 'Object' !§>
        ref: '<§ param.className §>',
      <!§!>
      type: <§ param.type §>
    },
  <-§->

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
<§ data.className §>Schema.method({
});

/**
 * Statics
 */
<§ data.className §>Schema.statics = {
  /**
   * Get <§ data.name §>
   * @param {ObjectId} id - The objectId of <§ data.name §>.
   * @returns {Promise<<§ data.className §>, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((<§ data.name §>) => {
        if (<§ data.name §>) {
          return <§ data.name §>;
        }
        const err = new APIError('No such <§ data.name §> exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List <§ data.plurialName §> in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of <§ data.plurialName §> to be skipped.
   * @param {number} limit - Limit number of <§ data.plurialName §> to be returned.
   * @returns {Promise<<§ data.className §>[]>}
   */
  list({ skip = 0, limit = 50, sort = 1  } = {}, params = {}) {
    return this.find(params)
      .sort({ createdAt: +sort })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef <§ data.className §>
 */
export default mongoose.model('<§ data.className §>', <§ data.className §>Schema);