const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const Trip = mongoose.model('Trips');

const { expect } = chai;
chai.use(chaiHttp);
var tripId = '';
describe("Trip tests", () => {
  it("Get trips", done => {
    chai
      .request(app)
      .get("/api/v1/trips")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        if (err) done(err);
        else done();
      });
  });

  it("Post trip", done => {
    chai
      .request(app)
      .post("/api/v1/trips")
      .send({"title":"NewTrip","description":"Testing trip","requirements":"Some requirements","startDate":"2022-04-10T14:30:10.123Z","endDate":"2022-05-15T15:31:11.321Z","creator":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal('NewTrip');
        expect(res.body.creator).to.equal('9e714482b1d63b27181d4989');
        expect(res.body.published).to.equal(false);
        expect(res.body.cancelled).to.equal(false);
        expect(res.body.deleted).to.equal(false);
        tripId = res.body._id;
        if (err) done(err);
        else done();
      });
  });

  it("Get trip with ID", done => {
    chai
      .request(app)
      .get("/api/v1/trips/" + tripId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(tripId);
        expect(res.body.title).to.equal('NewTrip');
        expect(res.body.creator).to.equal('9e714482b1d63b27181d4989');
        expect(res.body.published).to.equal(false);
        expect(res.body.cancelled).to.equal(false);
        expect(res.body.deleted).to.equal(false);
        if (err) done(err);
        else done();
      });
  });

  /*it("Get non-existing trip with ID", done => {
    chai
      .request(app)
      .get("/api/v1/trips/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/

  it("Update trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/" + tripId)
      .send({"title":"UpdatedTrip","description":"Testing trip","requirements":"Some requirements","startDate":"2022-04-10T14:30:10.123Z","endDate":"2022-05-15T15:31:11.321Z","creator":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(tripId);
        expect(res.body.title).to.equal('UpdatedTrip');
        expect(res.body.creator).to.equal('9e714482b1d63b27181d4989');
        expect(res.body.published).to.equal(false);
        expect(res.body.cancelled).to.equal(false);
        expect(res.body.deleted).to.equal(false);
        if (err) done(err);
        else done();
      });
  });

  /*it("Update non-existing trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/9e714482b1d63b27181d4989")
      .send({"title":"UpdatedTrip","description":"Testing trip","requirements":"Some requirements","startDate":"2022-04-10T14:30:10.123Z","endDate":"2022-05-15T15:31:11.321Z","creator":"9e714482b1d63b27181d4989"})
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/

  it("Publish trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/" + tripId + "/publish")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(tripId);
        expect(res.body.published).to.equal(true);
        if (err) done(err);
        else done();
      });
  });

  it("Publish non-existing trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/9e714482b1d63b27181d4989/publish")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Cancel trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/" + tripId + "/cancel")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(tripId);
        expect(res.body.cancelled).to.equal(true);
        if (err) done(err);
        else done();
      });
  });

  it("Cancel non-existing trip with ID", done => {
    chai
      .request(app)
      .put("/api/v1/trips/9e714482b1d63b27181d4989/cancel")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Delete trip with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/trips/" + tripId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Trip successfully deleted');
        if (err) done(err);
        else done();
      });
  });

  /*it("Delete non-existing trip with ID", done => {
    chai
      .request(app)
      .delete("/api/v1/trips/9e714482b1d63b27181d4989")
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });*/
});