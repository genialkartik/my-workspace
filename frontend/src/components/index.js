import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

import BoardCard from './BoardCard';
export default function Dashboard() {
  const classes = useStyles();
  const [openCreate, setOpenCreate] = useState(false); // open modal to add new entity
  const [openEdit, setOpenEdit] = useState(false); // modal to edit 
  const [tasktext, setTask] = useState('');
  const [boards, setBoard] = useState([]); // array of user boards and tasks
  const [boardId, setBoardId] = useState(null);
  const [edittext, setEdit] = useState(''); // text to edit
  const [taskId, setTaskId] = useState(null)

  const handleClickOpen = (id) => () => {
    setOpenCreate(true);
    setBoardId(id) // set board (userid)
  };
  // save boardid and taskid to edit
  const openEditBox = (boardid, taskid) => () => {
    setOpenEdit(true);
    setBoardId(boardid);
    setTaskId(taskid);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenEdit(false);
  };

  // Modal to add new task
  const taskBox = (
    <Dialog open={openCreate} onClose={handleClose} style={{ padding: '50px' }}>
      <div style={{ padding: '40px' }}>
        <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px' }}>
          Add Task</Typography><br />
        <TextField id="standard-basic" label="Enter Task"
          onChange={e => setTask(e.target.value)} /><br /><br />
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={() => addTask()} variant="contained" color="primary" fontWeight="bold">Add</Button>
        </DialogActions>
      </div>
    </Dialog>
  )
  // Modal to edit task or user name
  const editBox = (
    <Dialog open={openEdit} onClose={handleClose} style={{ padding: '50px' }}>
      <div style={{ padding: '40px' }}>
        <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px' }}>
          Edit Text</Typography><br />
        <TextField id="standard-basic" label="Enter Task"
          onChange={e => setEdit(e.target.value)} /><br /><br />
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={() => editText()} variant="contained" color="primary" fontWeight="bold">Edit</Button>
        </DialogActions>
      </div>
    </Dialog>
  )

  useEffect(() => {
    (async () => {
      // get user task data
      await axios.get('https://dash-clicks.herokuapp.com/dashboard')
        .then(res => {
          setBoard(res.data.tasks_list)
        })
        .catch(err => {
          console.log(err)
          setBoard([])
        });
    })();
  }, [])

  const addTask = async () => {
    // add new task
    await axios.post('https://dash-clicks.herokuapp.com/task', {
      userid: boardId,
      newtask: tasktext
    });
    setOpenCreate(false);
    // reloading to avoid extra effort in frontend :)
    window.location.reload();
  }

  const editText = async () => {
    if (taskId) {
      // edit task
      await axios.put('https://dash-clicks.herokuapp.com/task', {
        userid: boardId,
        taskid: taskId,
        newText: edittext
      });
    } else {
      // edit user name
      await axios.put('https://dash-clicks.herokuapp.com/board', {
        userid: boardId,
        newText: edittext
      });
    }
    setOpenEdit(false);
    // sideffects of not being a good frontend dev
    window.location.reload();
  }

  const deleteTask = async (userid, taskid) => {
    // delete task
    await axios.put('https://dash-clicks.herokuapp.com/task/update', {
      userid: userid,
      taskid: taskid,
    });
    // do I need to remind again?
    window.location.reload();
  }

  // dragging
  const ondragStart = (ev, dragfrom_userid, taskid, txt) => {
    // pidx == pickup_user_index , idx == task_index
    // ev.dataTransfer.setData("pidx", pidx)
    // ev.dataTransfer.setData("idx", idx)

    // save userid of drag_from board, task to dragNdrop and task_text
    ev.dataTransfer.setData("dragfrom_userid", dragfrom_userid)
    ev.dataTransfer.setData("taskid", taskid)
    ev.dataTransfer.setData("txt", txt)
  }
  const ondragOver = (ev) => {
    // to prevent actions on dragging
    ev.preventDefault();
    ev.stopPropagation();
  }
  const ondrop = async (ev, target_userid) => {
    // const pidx = parseInt(ev.dataTransfer.getData("pidx"))
    // const idx = parseInt(ev.dataTransfer.getData("idx"))
    const board_id = ev.dataTransfer.getData("dragfrom_userid")
    const task_id = ev.dataTransfer.getData("taskid")
    const txt = ev.dataTransfer.getData("txt")
    // let temp_board = boards;
    // await temp_board[index].tasks.push(temp_board[pidx].tasks[idx])
    // await temp_board[pidx].tasks.pop(temp_board[pidx].tasks[idx])

    // save changes in dragNdrop
    await axios.post('https://dash-clicks.herokuapp.com/task/move', {
      dropto_user_id: target_userid,
      pickup_user_id: board_id,
      taskid: task_id,
      txt: txt
    })
      .then(res => {
        // puff!! frontend is a mesh
        window.location.reload();
      })
      .catch(err => {
        console.log(err)
      });
  }

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <BoardCard />
            <Typography variant="h6" className={classes.title}>
              Add User
          </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Container className={classes.maincontainer} maxWidth="xl">
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={4}>
          {boards.map(({ _id, username, tasks }) => (
            <Grid key={_id} item className={classes.taskCont}
              onDragOver={e => ondragOver(e)}
              // save user board id on drop
              onDrop={e => ondrop(e, _id)}>
              <Tooltip title="Add" aria-label="add">
                <Fab color="primary" className={classes.absolute}
                  onClick={async () => {
                    // delete user board
                    await axios.delete(`https://dash-clicks.herokuapp.com/board/delete/${_id}`)
                      .then(res => {
                        if (res.data.deleted) window.location.reload()
                        else alert('Something went wrong')
                      })
                      .catch(err => {
                        console.log(err)
                      });
                  }} >
                  <ClearIcon />
                </Fab>
              </Tooltip>
              <Paper className={classes.paper}>
                <Typography variant="h6" className={classes.title}>
                  {username}
                  <IconButton edge="end" aria-label="edit"
                    onClick={openEditBox(_id, null)}>
                    <EditIcon />
                  </IconButton>
                </Typography>
                <hr />
                <div className={classes.demo}>
                  <List>
                    {tasks.map(({ taskid, text }) => (
                      <div key={taskid}
                        // get user board id, task id and task text on drag start
                        onDragStart={e => ondragStart(e, _id, taskid, text)}
                        draggable
                      >
                        <ListItem className={classes.tasklist}>
                          <ListItemText primary={text} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit"
                              onClick={openEditBox(_id, taskid)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete"
                              onClick={() => deleteTask(_id, taskid)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </div>
                    ))}
                  </List>
                </div>
                <Tooltip title="Add" aria-label="add">
                  <Fab onClick={handleClickOpen(_id)}>
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </Paper>
              {taskBox}
              {editBox}
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  maincontainer: {
    padding: '20px'
  },
  taskCont: {
  },
  cardcont: {
    minWidth: 275,
  },
  paper: {
    minHeight: 250,
    minWidth: 430,
    borderRadius: '8px'
  },
  absolute: {
    position: 'relative',
    right: '-48%',
    top: '20px'
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: '10px'
  },
  tasklist: {
    background: '#535252'
  }
}));