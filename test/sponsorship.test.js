const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const Trip = mongoose.model('Trips');

const { expect } = chai;
chai.use(chaiHttp);
var tripId = '';
var sponsorshipId = '';
var tripCreated = false;
describe("Sponsorship tests", () => {
  before(done => {
    Trip.find({}, (err, trips) => {
      if (err) done(err);
      else if (trips.length > 0) {
        tripId = trips[0]._id;
        done();
      } else {
        var new_trip = new Trip({
          "title": "NewTrip",
          "description": "Testing trip",
          "requirements": "Some requirements",
          "startDate": "2022-04-10T14:30:10.123Z",
          "endDate": "2022-05-15T15:31:11.321Z",
          "creator":"9e714482b1d63b27181d4989"
        });
        new_trip.save((err, trip) => {
          if (err) done(err);
          else {
            tripId = trip._id;
            tripCreated = true;
            done();
          }
        });
      }
    });
  });

  after(done => {
    if (tripCreated) {
      Trip.findByIdAndRemove(tripId, (err) => {
        if (err) done(err);
        else done();
      })
    } else {
      done();
    }
  })

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

  it("Pay sponsorship with ID and trip", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId + "/pay/" + tripId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(sponsorshipId);
        expect(res.body.payed).to.equal(true);
        expect(res.body.trips).to.include(tripId.toString());
        if (err) done(err);
        else done();
      });
  });

  it("Pay sponsorship with ID and trip twice", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId + "/pay/" + tripId)
      .end((err, res) => {
        expect(res).to.have.status(409);
        if (err) done(err);
        else done();
      });
  });

  it("Pay non-existing sponsorship with ID and trip", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/9e714482b1d63b27181d4989/pay/" + tripId)
      .end((err, res) => {
        expect(res).to.have.status(404);
        if (err) done(err);
        else done();
      });
  });

  it("Pay sponsorship with ID and non-existing trip", done => {
    chai
      .request(app)
      .put("/api/v1/actors/9e714482b1d63b27181d4989/sponsorships/" + sponsorshipId + "/pay/9e714482b1d63b27181d4989")
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