import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import IconButton from '@mui/material/IconButton';



import DataTable from "examples/Tables/DataTable";

// Data


import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useEffect, useState } from "react";
import ModalBox from "./modal";
import ViewsBox from "./veiws";
import config from "../../config"






function UserList() {
    const [rows, setrows] = useState([])
    const erows = () => fetchUsers()
    const fetchUsers = () => {
        setrows([])
        fetch(`${config.EndPionts}/user/`)
            .then(res => res.json())
            .then(response => {
                response.map(obj => {
                    let object = {
                        name: (
                            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {obj.fullName}
                            </MDTypography>
                        ),
                        email: <Job title={obj.email} />,
                        type: (
                            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                            {`${obj.userType=="staff"?"Program Manager":obj.userType=="qa"?"Quality Assurance":obj.userType} ${obj.state?obj.state:""}`}
                        </MDTypography>
                        ),
                        phone: (
                            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {obj.phone}
                            </MDTypography>
                        ),
                        company: (
                            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {`${obj.company}/${obj.state && obj.state}`}
                            </MDTypography>
                        ),
                        action: (
                            <MDBox sx={{display:"flex"}} ml={-1}>
                                <IconButton size="small" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton size="small" aria-label="delete">
                                    <BlockIcon />
                                </IconButton>
                              {/* <ViewsBox  /> */}
                            </MDBox>
                        ),

                    }
                    setrows(prev => [...prev, object])
                })
            })
    }

    const Job = ({ title, description }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                {title}
            </MDTypography>
            <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
    );

    const columns = [
        { Header: "Name", accessor: "name", align: "left" },
        { Header: "Email", accessor: "email", align: "left" },
        { Header: "User Role", accessor: "type", align: "center" },
        { Header: "Phone", accessor: "phone", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ]

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container flexDirection={"column"} spacing={0}>

                    {rows.length == 0 ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: 400, flexDirection: "column" }} >
                            <h3>Users list will appear here</h3>
                        </div> :
                        <Grid item xs={12}>
                            <Card>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                            {/* <Footer /> */}
                        </Grid>}
                    <ModalBox 
                    setRows={erows}
                    />
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}
export default UserList;
