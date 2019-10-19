const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event');
const checkAuth = require('../middleware/check-auth');

//get method about show all event
// router.get('/events', checkAuth, EventController.get_all_events);
//get method about show user events
router.get('/myevents', checkAuth, EventController.myEvent);
//get method about show single event
router.get('/events/single', checkAuth, EventController.show_event);
//post method about make new event
router.post('/events/new', checkAuth, EventController.create_new_event);
//put method about update exist event
router.put('/events/single/edit', checkAuth, EventController.event_edit);
//delete method about delete event
router.delete('/events/single/delete', checkAuth, EventController.event_delete);
//post method about going
router.post('/events/single/going', checkAuth, EventController.going);
//post method about not interested
router.post(
  '/events/single/notinterested',
  checkAuth,
  EventController.not_interested
);
//post method about interested
router.post('/events/single/interested', checkAuth, EventController.interested);
//get method about show going list
router.get('/events/single/going', checkAuth, EventController.get_going);
//get method about show not interested list
router.get(
  '/events/single/notinterested',
  checkAuth,
  EventController.get_not_interested
);
//get method about interested list
router.get(
  '/events/single/interested',
  checkAuth,
  EventController.get_interested
);

module.exports = router;
