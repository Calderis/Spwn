import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## <§ data.className §> APIs', () => {
  let <§ data.name §> = {
    <§- data.array -> param -§>
      <§! param.type == 'String' !§>
        <§ param.name §>: 'initial string',
      <!§!>
      <§! param.type == 'Number' !§>
        <§ param.name §>: 42,
      <!§!>
    <-§->
  };

  describe('# POST /api/<§ data.plurialName §>', () => {
    it('should create a new <§ data.name §>', (done) => {
      request(app)
        .post('/api/<§ data.plurialName §>')
        .send(<§ data.name §>)
        .expect(httpStatus.OK)
        .then((res) => {
          <§- data.array -> param -§>
            expect(res.body.<§ param.name §>).to.equal(<§ data.name §>.<§ param.name §>);
          <-§->
          <§ data.name §> = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/<§ data.plurialName §>/:<§ data.name §>Id', () => {
    it('should get <§ data.name §> details', (done) => {
      request(app)
        .get(`/api/<§ data.plurialName §>/${<§ data.name §>._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          <§- data.array -> param -§>
            expect(res.body.<§ param.name §>).to.equal(<§ data.name §>.<§ param.name §>);
          <-§->
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when <§ data.name §> does not exists', (done) => {
      request(app)
        .get('/api/<§ data.plurialName §>/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/<§ data.plurialName §>/:<§ data.name §>Id', () => {
    it('should update <§ data.name §> details', (done) => {
      <§- data.array -> param -§>
        <§! param.type == 'String' !§>
          <§ data.name §>.<§ param.name §> = 'KK';
        <!§!>
        <§! param.type == 'Number' !§>
          <§ data.name §>.<§ param.name §> = 24;
        <!§!>
      <-§->
      request(app)
        .put(`/api/<§ data.plurialName §>/${<§ data.name §>._id}`)
        .send(<§ data.name §>)
        .expect(httpStatus.OK)
        .then((res) => {
          
          <§- data.array -> param -§>
            <§! param.type == 'String' !§>
              expect(res.body.<§ param.name §>).to.equal('KK');
            <!§!>
            <§! param.type == 'Number' !§>
              expect(res.body.<§ param.name §>).to.equal(24);
            <!§!>
          <-§->
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/<§ data.plurialName §>/', () => {
    it('should get all <§ data.plurialName §>', (done) => {
      request(app)
        .get('/api/<§ data.plurialName §>')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all <§ data.plurialName §> (with limit and skip)', (done) => {
      request(app)
        .get('/api/<§ data.plurialName §>')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/<§ data.plurialName §>/', () => {
    it('should delete <§ data.name §>', (done) => {
      request(app)
        .delete(`/api/<§ data.plurialName §>/${<§ data.name §>._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          <§- data.array -> param -§>
            <§! param.type == 'String' !§>
              expect(res.body.<§ param.name §>).to.equal('KK');
            <!§!>
            <§! param.type == 'Number' !§>
              expect(res.body.<§ param.name §>).to.equal(24);
            <!§!>
          <-§->
          done();
        })
        .catch(done);
    });
  });
});
