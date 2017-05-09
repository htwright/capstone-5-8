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



describe('Share Your Knowledge', function() {


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






  describe('GET endpoints', function(){

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

  describe('Post endpoint', function(){
    it('should add a new item', function(){
      const newItem = {
        subject: 'Gaming',
        title: 'Hearthstone',
        content: 'GetGud'
      };

      return chai.request(app)
      .post('/items')
      .send(newItem)
      .then(result => {
        result.should.have.status(201);
        result.should.be.json;
        result.should.be.a('object');
        result.body.should.include.keys('id','subject','title','content');
        result.body.id.should.not.be.null;

        return Item.findById(result.body.id);
      })
      .then(item => {
        item.subject.should.equal(newItem.subject);
        item.title.should.equal(newItem.title);
        item.content.should.equal(newItem.content);
      });
    });
  });

  describe('Put endpoint', function(){
    it('should update and return them item who\'s ID was passed in through params', function(){
      let updatedItem = {
        title: 'Cooking'
      };
      let dbItem;
      return Item
      .findOne()
      .then(result => {
        dbItem = result;
        updatedItem.id = result.id;
        return chai.request(app)
        .put(`/items/${result.id}`)
        .send(updatedItem);
      })
      .then(result => {
        result.body.id.should.equal(dbItem.id);
        result.body.subject.should.equal(dbItem.subject);
        result.body.title.should.equal(updatedItem.title);
        result.body.content.should.equal(dbItem.content);
        return Item.findById(updatedItem.id);
      })
      .then(item => {
        item.id.should.equal(dbItem.id);
        item.subject.should.equal(dbItem.subject);
        item.title.should.equal(updatedItem.title);
        item.content.should.equal(dbItem.content);

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
});//--- End of Parent describe