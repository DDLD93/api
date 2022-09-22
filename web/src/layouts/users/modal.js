import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import MDButton from 'components/MDButton';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Grid, TextField } from '@mui/material';
import config from "../../config"
import { StateContext } from 'store/store';


const style = {
  modal: {
    position: 'absolute',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 1,
    pb: 3,
    pr: 4,
    pl: 4
  },
  card: {
    display: "flex",
    gap: 3,
    width: "100%",
    justifyContent: "space-between"
  }
};
const userType = [
  {
    value: '',
    label: '',
  },
  {
    value: 'staff',
    label: 'Program Manager',
  },
  {
    value: 'qa',
    label: 'Quality Assurance',
  },
  {
    value: 'coordinator',
    label: 'State Coordinator',
  },
];
const stateList = [
  "",
  "abia",
  "adamawa",
  "akwa Ibom",
  "anambra",
  "bauchi",
  "bayelsa",
  "benue",
  "borno",
  "cross River",
  "delta",
  "ebonyi",
  "edo",
  "ekiti",
  "enugu",
  "abuja",
  "gombe",
  "imo",
  "jigawa",
  "kaduna",
  "kano",
  "katsina",
  "kebbi",
  "kogi",
  "kwara",
  "lagos",
  "nasarawa",
  "niger",
  "ogun",
  "ondo",
  "osun",
  "oyo",
  "plateau",
  "rivers",
  "sokoto",
  "taraba",
  "yobe",
  "zamfara"
]
export default function ModalBox({ setRows }) {
  const [open, setOpen] = React.useState(false);
  const [emailError, setemailError] = React.useState(false)
  const [fullName, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState("");
  const [type, setType] = React.useState('');
  const [button, setButton] = React.useState(false)
  const [loading, setloading] = React.useState(false)
  const { notification,token } = React.useContext(StateContext)
  const changeRows = React.useCallback(() => {
    setRows()
  }, [setRows])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const submit = () => {
    setloading(true)
    setButton(true)
    const data = {
      fullName,
      phone,
      email,
      password: "FMHADMSD",
      userType: type,
      state,
    }
    fetch(`${config.EndPionts}/user/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => {
        setloading(false)
        setButton(false)
        if (res.code && res.code == 11000) {
          notification("error", "duplicate entry/entries")
        } else {
          changeRows();
          handleClose();
          notification("success", "user added")
        }
      }).catch(err => {
        setloading(false)
        setButton(false)
        notification("error", err.message)
      })
  };

  React.useEffect(() => {
    if (!email || !phone || !fullName || !type) {
      setButton(true)
    } else {
      if (/.+@.+\.[A-Za-z]+$/.test(email)) {
        setButton(false)
        setemailError(false)
      } else {
        setemailError(true)
      }
    }

  }, [email, phone, fullName, type])


  return (
    <div>
      <Fab onClick={handleOpen} style={{ position: "fixed", zIndex: 99, right: "30px", bottom: "70px" }} size="medium" color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Modal

        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box container sx={style.modal}>
            <Typography sx={{ m: 3 }} textAlign="center" id="transition-modal-title" variant="h4" component="h2">
              Add User
            </Typography>
            <Grid container gap={3}>
              <Grid item sm={12} >
                <TextField onChange={(e) => setName(e.target.value)} size='small' fullWidth label="Full Name" />
              </Grid>
              <Grid item sm={12} >
                <TextField error={emailError} helperText={emailError ? "invalid email" : ""} onChange={(e) => setEmail(e.target.value)} size='small' fullWidth label="Email" />
              </Grid>
              <Grid item sm={12} >
                <TextField onChange={(e) => setPhone(e.target.value)} size='small' fullWidth label="Phone" />
              </Grid>
              <Grid container flexWrap="nowrap" gap={1}>
                <Grid item sm={6} >
                  <TextField
                    select
                    label="User Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    size='small'
                    SelectProps={{
                      native: true,
                    }}
                    helperText="Please select user role"
                  >
                    {userType.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm={6} >
                  <TextField
                    select
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    disabled={type == "coordinator" ? false : true}
                    fullWidth
                    size='small'
                  >
                    {stateList.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <MDButton disabled={button} onClick={submit} sx={{ mt: 4 }} size="small" fullWidth={true} variant="gradient" color="primary" >{loading ? "Creating..." : "Create"}</MDButton>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}