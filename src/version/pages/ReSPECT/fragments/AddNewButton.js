import React from "react";

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';

const styles = theme => ({
    addNewButton: {
        display: "block",
        width: 150,
        height: 40,
        paddingTop: "6px !important",
        paddingLeft: "8px !important",
        backgroundColor: theme.palette.mainColor,
        color: "#fff",
        borderRadius: 20,
        fontSize: 16,
        fontWeight: 800,
        "& svg": {
            marginRight: 2,
        },
        "& span": {
            textTransform: "capitalize",
        },
        "&:hover": {
            border: `1px solid ${theme.palette.mainColor}`,
            backgroundColor: "#fff",
            color: theme.palette.mainColor,
        }
    },
});

const AddNewButton = ({ classes }) => {
    return (
        <Toolbar>
        <Tooltip title="Add new">
            <IconButton type="submit" className={classes.addNewButton}>
                Add new
                <AddIcon />
            </IconButton>
        </Tooltip>
        </Toolbar>
    );
};

export default withStyles(styles)(AddNewButton);