'use strict';
/*---------------AUDIT----------------------*/
var mongoose = require('mongoose'),
  Audit = mongoose.model('Audits'),
  Trip = mongoose.model('Trips');

exports.list_all_audits = function (req, res) {
  Audit.find({}, function (err, audits) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(audits);
    }
  });
};

exports.list_trip_audits = function (req, res) {
  Trip.findById(req.params.tripId, (err, trip) => {
    if (err) {
      res.send(err);
    } else if (trip) {
      Audit.find({trip: req.params.tripId}, function (err, audits) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(audits);
        }
      });
    } else {
      res.status(404).send("Trip not found");
    }
  });
}

exports.list_my_audits = function (req, res) {
  var idAuditor = req.params.actorId;
  Audit.find({auditor: idAuditor}, function (err, audits) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(audits);
    }
  });
};

exports.create_a_audit = function (req, res) {
  var new_audit = new Audit(req.body);
  new_audit.save(function (err, audit) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(audit);
    }
  });
};

exports.read_a_audit = function (req, res) {
  Audit.findById(req.params.auditId, function (err, audit) {
    if (err) {
      res.send(err);
    }
    else if (audit) {
      res.json(audit);
    } else {
      res.status(404).send("Audit not found");
    }
  });
};

exports.update_a_audit = function (req, res) {
  Audit.findById(req.params.auditId, (err, audit) => {
    if (err) {
      res.send(err);
    } else if (audit) {
      Audit.findOneAndUpdate({ _id: req.params.auditId }, req.body, { new: true }, function (err, audit) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(audit);
        }
      });
    } else {
      res.status(404).send("Audit not found");
    }
  });
};

exports.delete_a_audit = function (req, res) {
  Audit.findById(req.params.auditId, (err, audit) => {
    if (err) {
      res.send(err);
    } else if (audit) {
      Audit.remove({ _id: req.params.auditId }, function (err, audit) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Audit successfully deleted' });
        }
      });
    } else {
      res.status(404).send("Audit not found");
    }
  });
};