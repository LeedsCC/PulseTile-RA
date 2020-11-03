import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import Button from "@material-ui/core/Button"
import Tooltip from "@material-ui/core/Tooltip"

const MAXIMAL_BUTTONS_NUMBER = 5

const styles = (theme) => ({
  paginatorRoot: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  button: {
    display: "block",
    border: `1px solid ${theme.palette.borderColor}`,
    height: 48,
    width: 48,
    boxSizing: "border-box",
    borderRadius: 0,
    color: theme.palette.mainColor,
    "&:hover": {
      color: "white",
      backgroundColor: theme.palette.mainColor,
    },
  },
  activeButton: {
    display: "block",
    border: `1px solid ${theme.palette.borderColor}`,
    height: 48,
    width: 48,
    boxSizing: "border-box",
    borderRadius: 0,
    color: "white",
    backgroundColor: theme.palette.mainColor,
    "&:hover": {
      color: "white",
      backgroundColor: theme.palette.mainColor,
    },
  },
})

class BundlePagination extends Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 1,
      pageDetails: null,
    }
  }

  componentDidMount() {
    const { bundle } = this.props

    if (!bundle) {
      return
    }

    const newPageDetails = this.parseLinks(bundle)

    this.setState({ pageDetails: newPageDetails })
  }

  componentDidUpdate() {
    const { pageDetails } = this.state

    if (pageDetails) {
      return
    }

    const { bundle } = this.props

    if (!bundle) {
      return
    }

    const newPageDetails = this.parseLinks(bundle)

    this.setState({ pageDetails: newPageDetails })
  }

  pageSelected(page) {
    const { pageDetails } = this.state

    if (!pageDetails) {
      return
    }

    this.setState({ page })

    const { pageSelected } = this.props

    pageSelected({ _page: page, _queryId: pageDetails.queryId })
  }

  getDigitButtons(buttonsNumber, page, classes) {
    let buttons = []
    if (buttonsNumber > MAXIMAL_BUTTONS_NUMBER) {
      const half = Math.ceil(MAXIMAL_BUTTONS_NUMBER / 2) - 1
      for (let i = 0; i < half; i++) {
        buttons.push(
          <Button
            onClick={() => this.pageSelected(i + 1)}
            aria-label={i + 1}
            className={page === i + 1 ? classes.activeButton : classes.button}
          >
            {i + 1}
          </Button>
        )
      }
      buttons.push(<Button className={classes.button}>{"..."}</Button>)
      for (let i = buttonsNumber - half; i < buttonsNumber; i++) {
        buttons.push(
          <Button
            onClick={() => this.pageSelected(i + 1)}
            aria-label={i + 1}
            className={page === i + 1 ? classes.activeButton : classes.button}
          >
            {i + 1}
          </Button>
        )
      }
    } else {
      for (let i = 0; i < buttonsNumber; i++) {
        buttons.push(
          <Button
            onClick={() => this.pageSelected(i + 1)}
            aria-label={i + 1}
            className={page === i + 1 ? classes.activeButton : classes.button}
          >
            {i + 1}
          </Button>
        )
      }
    }

    return buttons
  }

  /**
   * @param {fhir.Bundle} bundle
   */
  parseLinks(bundle) {
    const pageDetails = {
      pages: 1,
      queryId: "",
      currentPage: 1,
      total: bundle.total,
    }

    const { link } = bundle

    if (!link || !link.length) {
      return null
    }

    link.forEach((link) => {
      const keyValuePairs = link.url.split("?")[1].split("&")

      if (link.relation === "first") {
        keyValuePairs.forEach((kvp) => {
          const [key, value] = kvp.split("=")

          if (key === "_queryId") {
            pageDetails.queryId = value
          }
        })
      }

      if (link.relation === "last") {
        keyValuePairs.forEach((kvp) => {
          const [key, value] = kvp.split("=")

          if (key === "_page") {
            pageDetails.pages = Number(value)
          }
        })
      }

      if (link.relation === "self") {
        keyValuePairs.forEach((kvp) => {
          const [key, value] = kvp.split("=")

          if (key === "_page") {
            pageDetails.currentPage = Number(value)
          }
        })
      }
    })

    return pageDetails
  }

  render() {
    const { classes, itemsPerPage } = this.props

    const { pageDetails } = this.state

    if (!pageDetails) {
      return null
    }

    const page = pageDetails.currentPage
    const buttonsNumber = Math.ceil(pageDetails.total / itemsPerPage)
    const buttons = this.getDigitButtons(buttonsNumber, page, classes)
    return (
      <div className={classes.paginatorRoot}>
        <Tooltip title="First page">
          <IconButton
            onClick={() => this.pageSelected(page - 1)}
            className={classes.button}
            disabled={page === 1}
            aria-label="First page"
          >
            <FirstPageIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Previous page">
          <IconButton
            onClick={() => this.pageSelected(page - 1)}
            className={classes.button}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <KeyboardArrowLeft />
          </IconButton>
        </Tooltip>
        {buttons}
        <Tooltip title="Next page">
          <IconButton
            onClick={() => this.pageSelected(page + 1)}
            className={classes.button}
            disabled={page === buttonsNumber}
            aria-label="Next page"
          >
            <KeyboardArrowRight />
          </IconButton>
        </Tooltip>
        <Tooltip title="Last page">
          <IconButton
            onClick={() => this.pageSelected(buttonsNumber)}
            className={classes.button}
            disabled={page === buttonsNumber}
            aria-label="Last page"
          >
            <LastPageIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

export default withStyles(styles)(BundlePagination)
