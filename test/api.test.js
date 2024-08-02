const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app'); // Adjust path as necessary

describe('API Tests', () => {
  let token;

  it('should register a new user', (done) => {
    request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should login the user', (done) => {
    request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('auth').to.be.true;
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('should create a new to-do item', (done) => {
    request(app)
      .post('/todos')
      .set('x-access-token', token)
      .send({ description: 'Test To-Do', status: 'pending' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should get all to-do items', (done) => {
    request(app)
      .get('/todos')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('description', 'Test To-Do');
        done();
      });
  });

  it('should update the to-do item', (done) => {
    request(app)
      .put(`/todos/1`)
      .set('x-access-token', token)
      .send({ description: 'Updated To-Do', status: 'completed' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('changes', 1);
        done();
      });
  });

  it('should delete the to-do item', (done) => {
    request(app)
      .delete(`/todos/1`)
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('changes', 1);
        done();
      });
  });
});
