import React from "react"
import { translate } from "react-admin"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const styles = (theme) => ({
  tableHeaderBlock: {
    background: theme.tableHeader.tableHeaderBlock.background,
    backgroundSize: "cover",
    color: "white",
    paddingLeft: "14px",
    paddingTop: "25px",
    paddingBottom: "14px",
  },
  mainHeader: {
    margin: 0,
  },
  title: {
    marginTop: 0,
    color: "#fff",
    fontSize: 24,
    fontWeight: 800,
  },
  description: {
    marginTop: 10,
    color: "#fff",
  },
})

/**
 * This component returns header for table
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  classes
 * @param {string} resource
 */
const TableHeader = ({ classes, resource, translate }) => {
  const title = translate("tableHeaders." + resource + ".title")
  let description = translate("tableHeaders." + resource + ".description")
  let subText = translate("tableHeaders." + resource + ".subText")

  if (title === "tableHeaders." + resource + ".title") {
    return null
  }

  if (description === "tableHeaders." + resource + ".description") {
    description = null
  }

  if (subText === "tableHeaders." + resource + ".subText") {
    subText = null
  }

  return (
    <div className={classes.tableHeaderBlock}>
      <h1 className={classes.mainHeader}>
        <Typography className={classes.title}>{title}</Typography>
      </h1>
      {(description && <Typography className={classes.description}>{description}</Typography>) || null}
      {(subText && (
        <Typography className={classes.description}>
          <div dangerouslySetInnerHTML={{ __html: subText }}></div>
        </Typography>
      )) ||
        null}
    </div>
  )
}

export default withStyles(styles)(translate(TableHeader))
