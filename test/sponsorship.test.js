const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const Trip = mongoose.model('Trips');

const { expect } = chai;
chai.use(chaiHttp);
var tripId = '';
var sponsorshipId = '';
describe("Sponsorship tests", () => {
  before(done => {
    Trip.find({}, (err, trips) => {
      if (err) done(err);
      else {
        tripId = trips[0]._id;
        done();
      }
    });
  });

  it("Get sponsorships", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post sponsorship", done => {
    chai
      .request(app)
      .post("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships")
      .send({"landingPage":"http://landingpage.com","sponsor":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.landingPage).to.equal('http://landingpage.com');
        expect(res.body.sponsor).to.equal('9e714482b1d63b27181d4989');
        sponsorshipId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Get sponsorship with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(sponsorshipId);
        expect(res.body.landingPage).to.equal('http://landingpage.com');
        expect(res.body.sponsor).to.equal('9e714482b1d63b27181d4989');
        if (err) done(err);
        else done();
      });
  });

  it("Get non-existing sponsorship with ID", done => {
    chai
      .request(app)
      .get("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Update sponsorship with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId)
      .send({"landingPage":"http://landingpagenew.com","sponsor":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(sponsorshipId);
        expect(res.body.landingPage).to.equal('http://landingpagenew.com');
        expect(res.body.sponsor).to.equal('9e714482b1d63b27181d4989');
        if (err) done(err);
        else done();
      });
  });

  it("Update non-existing sponsorship with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/9e714482b1d63b27181d4989")
      .send({"landingPage":"http://landingpage.com","sponsor":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Pay sponsorship with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId + "/pay")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(sponsorshipId);
        expect(res.body.payed).to.equal(true);
        if (err) done(err);
        else done();
      });
  });

  it("Pay non-existing sponsorship with ID", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/9e714482b1d63b27181d4989/pay")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Get trip sponsorships", done => {
    chai
      .request(app)
      .get("/api/v1/trips/" + tripId + "/sponsorships")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Get non-existing trip sponsorships", done => {
    chai
      .request(app)
      .get("/api/v1/trips/9e714482b1d63b27181d4989/sponsorships")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Delete sponsorship with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Sponsorship successfully deleted');
        if (err) done(err);
        else done();
      });
  });

  it("Delete non-existing sponsorship with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });
});