const  {app} = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);


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
