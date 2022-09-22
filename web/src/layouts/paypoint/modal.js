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
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
    label: 'Staff',
  },
  {
    value: 'psp',
    label: 'PSP',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'qa',
    label: 'QA',
  },
  {
    value: 'coordinator',
    label: 'State Coordinator',
  },
];
const stateList = [
  "",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
]
export default function ModalBox({ setRows }) {
  const [open, setOpen] = React.useState(false);
  const [fullName, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("")
  const [email, setEmail] = React.useState("");
  const [emailErro, setemailErro] = React.useState(false)
  const [state, setState] = React.useState("");
  const [type, setType] = React.useState('');
  const [states, setstates] = React.useState([])
  const [button, setButton] = React.useState(false)
  const [focus, setfocus] = React.useState(false)
  const [loading, setloading] = React.useState(false)

  const { notification, user } = React.useContext(StateContext)
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
      location,
      password: "ABEDMS",
      userType: type,
      company: user.fullName,
    }
    fetch(`${config.EndPionts}/paypoint/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
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

  // const pspState = () => {

  //   fetch(`${config.EndPionts}/psp/state`).
  //   then(res => res.json())
  //     .then(res => {
  //       setstates(res)
  //     }).catch(err => notification("warning","error fetching psp asigned state"))
  // };

  React.useEffect(() => {
    if (!email || !phone || !fullName || !location) {
      setButton(true)
    } else {
      if (/.+@.+\.[A-Za-z]+$/.test(email)) {
        setButton(false)
        setemailErro(false)
      } else {
        setemailErro(true)
      }
    }

  }, [email, phone, fullName, location])


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
            <CloseIcon
              onClick={handleClose}
              sx={{
                position: "absolute",
                left: "10px",
                cursor: "pointer"
              }}
            />
            <Typography sx={{ m: 3 }} textAlign="center" id="transition-modal-title" variant="h4" component="h2">
              Add Paypoint
            </Typography>
            <Grid container gap={3}>
              <Grid item sm={12} >
                <TextField onChange={(e) => setName(e.target.value)} size='small' fullWidth label="Full Name" />
              </Grid>
              <Grid item sm={12} >
                <TextField error={emailErro} helperText={emailErro ? "invalid email" : ""} onChange={(e) => setEmail(e.target.value)} size='small' fullWidth label="Email" />
              </Grid>
              <Grid item sm={12} >
                <TextField onChange={(e) => setPhone(e.target.value)} size='small' fullWidth label="Phone" />
              </Grid>
              <Grid item sm={12} >
                <TextField onChange={(e) => setLocation(e.target.value)} size='small' fullWidth label="Location" />
              </Grid>
              <Grid container flexWrap="nowrap" gap={1}>
                {/* <Grid item sm={12} >
                  <TextField
                    select
                    label="State"
                    fullWidth
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    size='small'
                    SelectProps={{
                      native: true,
                    }}
                    helperText="Please select user role"
                  >
                    {stateList.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                </Grid> */}
                {/*
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
                </Grid> */}
              </Grid>
            </Grid>
            <MDButton disabled={button} onClick={submit} sx={{ mt: 4 }} size="small" fullWidth={true} variant="gradient" color="primary" >{loading ? "Creating..." : "Create"}</MDButton>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}