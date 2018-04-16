import React from 'react'

const ListImage = ({ image }) => (
  <img
    alt={image}
    className="left-avatar"
    src={`img/log_${image}.png`}
  />
)

export default ListImage
