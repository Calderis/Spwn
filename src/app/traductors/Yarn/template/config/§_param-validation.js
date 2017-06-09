import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  <§- data -> model -§>
    // POST /api/<§ model.plurialName §>
    create<§ model.className §>: {
      body: {
        <§- model.array -> param -§>
          <§! param.type.className == 'String' !§>
            <§ param.name §>: Joi.string().required(),
          <!§!>
          <§! param.type.className == 'Number' !§>
            <§ param.name §>: Joi.number().required(),
          <!§!>
        <-§->
      }
    },

    // UPDATE /api/<§ model.plurialName §>/:<§ model.name §>Id
    update<§ model.className §>: {
      body: {
      },
      params: {
        <§ model.name §>Id: Joi.string().hex().required()
      }
    },
  <-§->

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
