import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import config from '../../config';
import { Grid, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { StateContext } from 'store/store';



const style = {
    root:{
        position:"absolute",
        height:"100vh",
        width:"100vw"
    },
    content:{
        width:"100%"
    }
}
export default function SheetPreview(prop) {
    const [open, setOpen] = React.useState(false);
    const [rows, setrows] = React.useState([])
    const [label, setlabel] = React.useState("Approve")
    const {notification,token,Alert} = React.useContext(StateContext)
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    let handleNext = prop.refresh
    const handleRefresh = React.useCallback(() => {
      handleNext()
    }, [prop.refresh])
    function getSheet() {
        let url = `${config.EndPionts}/beneficiaries/sheet/${prop.id}`
        fetch(url).then(res=>(res.json())).
        then(arr =>{
            let object =  arr.map(obj=>{
                return {id: obj._id, Name:obj.fullName, Gender:obj.gender,Phone:obj.phone,Occupation:obj.occupation,Batch:obj.batch,Disability:obj.disability,State:obj.state,LGA:obj.lga,Status:obj.status,onCellClick: ()=>console.log("first")}
            
              })
                setrows([...object])
        }).catch(err=>console.log(err))
        
    }
    function approveStatus() {
        setlabel("Approving...")
        let data = {
            code:prop.code,
            sheetId:prop.id,
            status:"processing"
        }
        fetch(`${config.EndPionts}/sheet/approve`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ token,
            },
            body:JSON.stringify(data)
        }).then(res=>(res.json())).
        then(res=>{
            notification("success","List has been successfully Approved")
            setlabel("Approve")
            handleRefresh()
            handleClose()
        }).catch(err=>{
            notification("error","Seession Error>> Reload page or Login again")
            setlabel("Approve")
           // notification("error","Operation failed")
        })
    }
    function rejectStatus() {
        let data = {
            sheetId:prop.id,
            status:"rejected"
        }
        fetch(`${config.EndPionts}/sheet`,{
            method:"POST",
            headers: {
                "x-auth-token": token,
            },
            body:JSON.stringify(data)
        }).then(res=>(res.json())).
        then(res=>{
            notification("success","List has been successfully Approved")
            handleRefresh()
            handleClose()
        })
    }
    const descriptionElementRef = React.useRef(null);
      React.useEffect(() => {
        getSheet()
      },[]) 
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
    const columns = [
        {field: 'Name', headerName: 'Name', width: 200, sortable: false},
        {field: 'Gender', headerName: 'Gender', sortable: false,},
        {field: 'Phone', headerName: 'Phone',width: 120, color:"blue"},
        {field: 'State', headerName: 'State', sortable: false,},
        {field: 'LGA', headerName: 'lga', sortable: false,},
        {field: 'Ward', headerName: 'Geo-Political Zone', sortable: false,},
        {field: 'Status', headerName: 'Status', sortable: false,},
      ];
  
    

    return (
        <div>
            <IconButton onClick={handleClickOpen} size="small" aria-label="delete">
                <VisibilityIcon />
            </IconButton>
            <Dialog
                open={open}
                sx={style.root}
                onClose={handleClose}
                scroll={'body'}
                aria-labelledby="Sheet Preview"
                aria-describedby="Sheet Preview"
            >
                 <CloseIcon
          onClick={handleClose}
          sx={{position:"absolute",
                top:"5px",
               left:"10px",
               cursor:"pointer",
               color:"red" 
             }}
          />
                <DialogTitle sx={{textAlign:"center"}} >{prop.code}</DialogTitle>
                <Grid p={2} gap={16} container flexDirection="row" >
                    <div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Total Entry :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.total}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Valid Entry :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.valid}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Invalid Entry :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.invalid}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >State :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.state}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >% Male :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.male}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >% Female :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.female}</span>
                        </div>

                    </div>
                    <div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Uploaded by :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.uploadBy}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Status :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.status}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >TimeStamps :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.timestamps}</span>
                        </div>
                        <hr />
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Approved by :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.appBy}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >Status :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.status}</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "13px", color: "grey" }} >TimeStamps :</span> <span style={{ fontSize: "13px", fontWeight: "bold" }} >{prop.appeovedTimestamps}</span>
                        </div>
                    </div>

                </Grid>
                <DialogContent sx={style.content} dividers={scroll === 'card'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}>
                    </DialogContentText>
                            <DataGrid  columns={columns} rows={rows} />     
                </DialogContent>
                <DialogActions>
                    <Button  color="secondary" onClick={rejectStatus}>Reject</Button>
                    <Button onClick={approveStatus}>{label}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
