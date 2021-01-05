const router = require('express').Router();
const { v4: uuidv4 } = require('uuid')

const Board = require('../models/database')

router.route('/dashboard')
  .get(async (req, res) => {
    // find all user boards and tasks
    const tasks = await Board.find({});
    res.json({ tasks_list: tasks ? tasks : [] })
  })

router.route('/board')
  // create new Board
  .post(async (req, res) => {
    try {
      if (!req.body.username) throw 'no input provided';
      const newUser = new Board({
        userid: uuidv4(), // random generated id
        username: req.body.username
      })
      var user = await newUser.save(); // save user board
      res.json({ new_user: user ? user : null })
    } catch (error) {
      console.log(error)
      res.json({ new_user: null })
    }
  })
  // modify user name
  .put(async (req, res) => {
    try {
      if (!req.body.newText) throw 'input can\'t be empty';
      // edit user name of board
      const update_resp = await Board.updateOne(
        { _id: req.body.userid },
        { username: req.body.newText }
      );
      // if (not modified) { nModified == 0 }
      res.json({ updated: update_resp.nModified == 1 ? true : false })
    } catch (error) {
      console.log(error)
      res.json({ updated: false })
    }
  })

router.route('/board/delete/:userid')
  // delete user board
  .delete(async (req, res) => {
    try {
      const delete_resp = await Board.findByIdAndDelete({ _id: req.params.userid });
      res.json({ deleted: delete_resp ? true : false })
    } catch (error) {
      console.log(error)
      res.json({ deleted: false })
    }
  })

router.route('/task')
  // create new task
  .post(async (req, res) => {
    try {
      if (!req.body.newtask) throw 'input can\'t be empty';
      // add a new task to user board
      const update_resp = await Board.updateOne(
        { _id: req.body.userid },
        {
          $push: {
            tasks: {
              taskid: uuidv4(),
              text: req.body.newtask
            }
          }
        }
      );
      res.json({ added: update_resp.nModified == 1 ? true : false })
    } catch (error) {
      console.log(error)
      res.json({ added: false })
    }
  })
  // edit task
  .put(async (req, res) => {
    try {
      if (!req.body.newText) throw 'input can\'t be empty';
      // edit task text in user's board
      const update_resp = await Board.updateOne(
        { _id: req.body.userid, "tasks.taskid": req.body.taskid },
        { $set: { "tasks.$.text": req.body.newText } });
      res.json({ updated: update_resp.nModified == 1 ? true : false })
    } catch (error) {
      console.log(error)
      res.json({ updated: false })
    }
  })

router.route('/task/update')
  // delete the task
  .put(async (req, res) => {
    try {
      // remove task from user's board
      const update_resp = await Board.updateOne(
        { _id: req.body.userid },
        { $pull: { tasks: { taskid: req.body.taskid } } }
      );
      res.json({ task_deleted: update_resp.nModified == 1 ? true : false })
    } catch (error) {
      console.log(error)
      res.json({ task_deleted: false })
    }
  })

router.route('/task/move')
  .post(async (req, res) => {
    try {
      // push task to target user's board
      const moveto = await Board.updateOne(
        { _id: req.body.dropto_user_id },
        {
          $push: {
            tasks: {
              taskid: req.body.taskid,
              text: req.body.txt
            }
          }
        }
      );
      // remove task from previous board
      const movefrom = await Board.updateOne(
        { _id: req.body.pickup_user_id },
        { $pull: { tasks: { taskid: req.body.taskid } } }
      );
      // both tasks perform successully
      res.json({
        moved: (moveto.nModified == 1 && movefrom.nModified == 1) ?
          true : false
      })
    } catch (error) {
      console.log(error)
      res.json({ moved: false })
    }
  })

module.exports = router;