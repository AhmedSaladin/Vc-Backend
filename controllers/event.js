const Event = require('../models/event');
const User = require('../models/user');

//show all event about what user follow have some problem
// exports.get_all_events = (req, res, next) => {
//   const userId = req.userId;
//   User.findOne({ _id: userId })
//     .then(result => {
//       res.status(200).json({ result: result });
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// };

//show single event
exports.show_event = (req, res, next) => {
  const eventId = req.query.id;
  Event.findOne({ _id: eventId })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// get my events
exports.myEvent = (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then(result => {
      res.status(200).json({ events: result.events });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//create new event
exports.create_new_event = (req, res, next) => {
  const userId = req.userId;
  const event = new Event({
    name: req.body.name,
    location: req.body.location,
    date: req.body.date,
    description: req.body.description,
    creator: req.body.id,
    image: req.body.image
  });
  User.findOne({ _id: userId })
    .then(result => {
      if (result.orgnization) {
        event.creator = result;
        event.save();
        result.events.push(event);
        result.save();
        res.status(200).json({ event });
      } else {
        res.status(405).json({ message: "you can't do that" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// update event
exports.event_edit = (req, res, next) => {
  const eventId = req.body.eventId;
  const userId = req.userId;
  Event.findOne({ _id: eventId })
    .then(result => {
      if (userId == result.creator._id) {
        Event.findOneAndUpdate({ _id: eventId }, req.body).exec();
        Event.findOne({ _id: eventId }).then(doc => {
          res.status(200).json({ doc });
        });
      } else {
        res.status(401).json({ message: "you can't do update this event" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//delete event
exports.event_delete = (req, res, next) => {
  const eventId = req.query.Id;
  const userId = req.userId;
  Event.findOne({ _id: eventId })
    .then(result => {
      if (userId == result.creator._id) {
        Event.findOneAndDelete({ _id: eventId })
          .then(() => {
            return User.findOne({ _id: userId });
          })
          .then(result => {
            if (result.events.indexOf(eventId) !== -1) {
              result.events.remove(eventId);
              result.save();
              res.status(200).json({ message: 'the event deleted' });
            }
          });
      } else {
        res.status(401).json({ message: "you can't delete this event" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//Going
exports.going = (req, res, next) => {
  userId = req.userId;
  eventId = req.body.eventId;
  Event.findOne({ _id: eventId }).then(result => {
    if (result.not_interested.indexOf(userId) !== -1) {
      result.not_interested.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId }).then(result => {
    if (result.interested.indexOf(userId) !== -1) {
      result.interested.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId })
    .then(result => {
      if (result.going.indexOf(userId) === -1) {
        result.going.push(userId);
        result.save();
      }
    })
    .then(() => res.status(200).json({ message: 'it done' }))
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//Not Interested
exports.not_interested = (req, res, next) => {
  userId = req.userId;
  eventId = req.body.eventId;
  Event.findOne({ _id: eventId }).then(result => {
    if (result.going.indexOf(userId) !== -1) {
      result.going.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId }).then(result => {
    if (result.interested.indexOf(userId) !== -1) {
      result.interested.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId })
    .then(result => {
      if (result.not_interested.indexOf(userId) === -1) {
        result.not_interested.push(userId);
        result.save();
        console.log(result);
      }
    })
    .then(() => res.status(200).json({ message: 'it done' }))
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//Interested
exports.interested = (req, res, next) => {
  userId = req.userId;
  eventId = req.body.eventId;
  Event.findOne({ _id: eventId }).then(result => {
    if (result.going.indexOf(userId) !== -1) {
      result.going.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId }).then(result => {
    if (result.not_interested.indexOf(userId) !== -1) {
      result.not_interested.remove(userId);
      result.save();
    }
  });
  Event.findOne({ _id: eventId })
    .then(result => {
      if (result.interested.indexOf(userId) === -1) {
        result.interested.push(userId);
        result.save();
      }
    })
    .then(() => res.status(200).json({ message: 'it done' }))
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//show going list
exports.get_going = (req, res, next) => {
  const eventId = req.query.eventId;
  Event.findOne({ _id: eventId })
    .populate('going', 'name avatar')
    .then(result => {
      res.status(200).json({ going: result.going });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//show interested list
exports.get_interested = (req, res, next) => {
  const eventId = req.query.eventId;
  Event.findOne({ _id: eventId })
    .populate('interested', 'name avatar')
    .then(result => {
      res.status(200).json({ interested: result.interested });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//show notinterested list
exports.get_not_interested = (req, res, next) => {
  const eventId = req.query.eventId;
  Event.findOne({ _id: eventId })
    .populate('not_interested', 'name avatar')
    .then(result => {
      res.status(200).json({ not_interested: result.not_interested });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
