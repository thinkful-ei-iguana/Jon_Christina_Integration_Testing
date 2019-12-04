const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('should return an array', () => {
    return supertest(app)
      .get('/apps?genres=action')
      .query({ 'Genres': 'Action' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });

  it('should have Genres key', () => {
    return supertest(app)
      .get('/apps')
      .query({'genres': 'Action'})
      .expect(200)
      .then(res => {
        expect (res.body.length).to.be.at.least(1)
        res.body.forEach(game => {
          expect(game).to.have.any.keys('Genres')
          expect(game.Genres).to.have.string('Action')
        })
      });
  });

  it('should return apps in ascending rating order', () => {
    return supertest(app)
      .get('/apps')
      .query({sort:'rating'})
      .expect(200)
      .then(res => {
        let sortedKey = 'Rating';
        res.body.forEach((game, i) => {
          let nextGame = res.body[i + 1];
          if (nextGame) {
            expect(game[sortedKey]).to.be.at.most(nextGame.Rating);
          }
        });
      });
  });
});