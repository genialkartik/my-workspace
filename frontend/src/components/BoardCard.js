import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';

export default function BoardCard() {
  const [open, setOpen] = useState(false);
  // title of board
  const [usrname, setName] = useState('')

  const handleClickOpen = () => () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const createBoard = async () => {
    await axios.post('https://dash-clicks.herokuapp.com/board', {
      username: usrname
    })
      .then(res => {
        console.log(res.data)
      })
      // close modal
    setOpen(false);
    // reloading as I'm not a good Frontend Developer :)
    window.location.reload();
  }

  return (
    <div>
      <Button onClick={handleClickOpen('paper')}>
        <Fab color="secondary">
          <AddIcon />
        </Fab>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      ><div style={{ padding: '40px' }}>
          <Typography variant="h4" style={{ textAlign: 'center' }}>
            Add User
          </Typography>
          <TextField id="standard-basic" label="Enter User Name"
            onChange={e => setName(e.target.value)} /><br /><br />
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={createBoard} variant="contained" color="primary" fontWeight="bold">Create</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}