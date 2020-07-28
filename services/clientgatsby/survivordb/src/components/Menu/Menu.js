import React from "react"
import PropTypes from "prop-types"

import { FaHome } from "react-icons/fa/"
import { GrGraphQl } from "react-icons/gr/"
import { GiFireBowl, GiSolarTime } from "react-icons/gi/"
import { IoIosPeople } from "react-icons/io/"
import { GoRequestChanges } from "react-icons/go"

import Item from "./Item"
import Expand from "./Expand"
import "./style.css"

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.itemList = React.createRef()

    this.items = [
      { to: "/", label: "Home", icon: FaHome },
      { to: "/seasons/", label: "Seasons", icon: GiSolarTime },
      { to: "/players/", label: "Players", icon: IoIosPeople },
      { to: "/versus/", label: "Versus", icon: GiFireBowl },
      { to: "/graph/", label: "Connections", icon: GrGraphQl },
      { to: "/contact/", label: "Request Features ", icon: GoRequestChanges }
    ]

    this.renderedItems = [] // will contain references to rendered DOM elements of menu
  }

  state = {
    open: false,
    hiddenItems: []
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    fixed: PropTypes.bool.isRequired,
    screenWidth: PropTypes.number.isRequired,
    fontLoaded: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.renderedItems = this.getRenderedItems()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.path !== prevProps.path ||
      this.props.fixed !== prevProps.fixed ||
      this.props.screenWidth !== prevProps.screenWidth ||
      this.props.fontLoaded !== prevProps.fontLoaded
    ) {
      if (this.props.path !== prevProps.path) {
        this.closeMenu()
      }
      this.hideOverflowedMenuItems()
    }
  }

  getRenderedItems = () => {
    const itemList = this.itemList.current
    return Array.from(itemList.children)
  }

  hideOverflowedMenuItems = () => {
    const PADDING_AND_SPACE_FOR_MORELINK =
      this.props.screenWidth >= 1024 ? 60 : 0

    const itemsContainer = this.itemList.current
    const maxWidth = itemsContainer.offsetWidth - PADDING_AND_SPACE_FOR_MORELINK

    this.setState({ hiddenItems: [] }) // clears previous state

    const menu = this.renderedItems.reduce(
      (result, item) => {
        item.classList.add("item")
        item.classList.remove("hideItem")

        const currentCumulativeWidth = result.cumulativeWidth + item.offsetWidth
        result.cumulativeWidth = currentCumulativeWidth

        if (
          !item.classList.contains("more") &&
          currentCumulativeWidth > maxWidth
        ) {
          const link = item.querySelector("a")

          item.classList.add("hideItem")
          item.classList.remove("item")
          result.hiddenItems.push({
            to: link.getAttribute("data-slug"),
            label: link.text
          })
        }
        return result
      },
      { visibleItems: [], cumulativeWidth: 0, hiddenItems: [] }
    )

    this.setState(prevState => ({ hiddenItems: menu.hiddenItems }))
  }

  toggleMenu = e => {
    e.preventDefault()

    if (this.props.screenWidth < 1024) {
      this.renderedItems.map(item => {
        const oldClass = this.state.open ? "showItem" : "hideItem"
        const newClass = this.state.open ? "hideItem" : "showItem"

        if (item.classList.contains(oldClass)) {
          item.classList.add(newClass)
          item.classList.remove(oldClass)
        }
      })
    }

    this.setState(prevState => ({ open: !prevState.open }))
  }

  closeMenu = e => {
    //e.preventDefault();

    if (this.state.open) {
      this.setState({ open: false })
      if (this.props.screenWidth < 1024) {
        this.renderedItems.map(item => {
          if (item.classList.contains("showItem")) {
            item.classList.add("hideItem")
            item.classList.remove("item")
          }
        })
      }
    }
  }

  render() {
    const { screenWidth, theme } = this.props
    const { open } = this.state

    return (
      <React.Fragment>
        <nav className={`menu ${open ? "open" : ""}`} rel="js-menu">
          <ul className="itemList" ref={this.itemList}>
            {this.items.map(item => (
              <Item
                item={item}
                key={item.label}
                icon={item.icon}
                theme={theme}
              />
            ))}
          </ul>
          {this.state.hiddenItems.length > 0 && (
            <Expand onClick={this.toggleMenu} theme={theme} />
          )}
          {open && screenWidth >= 1024 && (
            <ul className="hiddenItemList">
              {this.state.hiddenItems.map(item => (
                <Item item={item} key={item.label} hiddenItem theme={theme} />
              ))}
            </ul>
          )}
        </nav>
      </React.Fragment>
    )
  }
}

export default Menu
