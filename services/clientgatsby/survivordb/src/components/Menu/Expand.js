import { FaAngleDown } from "react-icons/fa/"
import PropTypes from "prop-types"
import React from "react"

const Expand = props => {
  const { onClick, theme } = props

  return (
    <React.Fragment>
      <button className="more" to="#" onClick={onClick} aria-label="expand">
        <FaAngleDown size={30} />
      </button>
    </React.Fragment>
  )
}

Expand.propTypes = {
  onClick: PropTypes.func,
  theme: PropTypes.object.isRequired
}

export default Expand
