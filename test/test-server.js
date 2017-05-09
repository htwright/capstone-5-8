const  {runServer, closeServer, app} = require('../server');
const chai = require('chai');
const {Item} = require('../models');
const chaiHttp = require('chai-http');
const morgan = require('morgan');
const {TEST_DATABASE_URL} = require('../config');
const mongoose = require('mongoose');
const faker = require('faker');
const should = chai.should();
chai.use(chaiHttp);

function seedItemData(){
  const seed = [];
  for (let i = 0; i <=10; i++){
    seed.push({
      subject: faker.company.companyName(),
      title: faker.lorem.words(),
      content: faker.lorem.paragraph()
    });
  }
  return Item.insertMany(seed);
}

function dropData(){
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}



describe('PassionPlay.ru', function() {


  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedItemData();
  });

  afterEach(function(){
    return dropData();
  });

  after(function(){
    return closeServer();
  });






  describe.only('GET endpoints', function(){

    it('should return all items in the database', function(){
      let res;
      return chai.request(app)
      .get('/items')
      .then(response => {
        // console.log(response);
        res = response;
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.length.of.at.least(1);

        return Item.count();
      })
      .then(count =>{
        res.body.should.have.length.of(count);
      });
    });

    it('should return the item corresponding to the ID passed in', function(){
      let res;
      return Item
      .findOne()
      .then(result =>{
        res = result;
        return chai.request(app)
        .get(`/items/${res.id}`);
      })
      .then(item => {
        res.id.should.equal(item.body.id);
        res.content.should.equal(item.body.content);
        res.title.should.equal(item.body.title);
        res.subject.should.equal(item.body.subject);
        
      });
    });
    it('should return all fields seeded', function(){
      let res;
      return chai.request(app)
      .get('/items')
      .then(result =>{
        res = result.body[0];
        result.body.forEach(function(item){
          item.should.be.a('object');
          item.should.include.keys('subject', 'title', 'content', 'id');
        });
        return Item.findById(res.id);
      })
      .then(item =>{
        res.content.should.equal(item.content);
        res.title.should.equal(item.title);
        res.subject.should.equal(item.subject);
        res.id.should.equal(item.id);

      });

    });
  });



  describe('Home page should load', () =>{
    it('should have status 200', ()=>{
      chai.request(app)
          .get('/')
          .end((err, res) =>{
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
  });
});