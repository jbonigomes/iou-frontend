import React from 'react'

import { ListItem } from 'react-md'
import { FontIcon } from 'react-md'
import { MenuButton } from 'react-md'

const ListMenu = ({ id }) => (
  <MenuButton
    id={id}
    icon
    centered
    menuItems={[
      <ListItem key={1} primaryText="View" leftIcon={<FontIcon key="data">visibility</FontIcon>} />,
      <ListItem key={2} primaryText="Edit" leftIcon={<FontIcon key="data">mode_edit</FontIcon>} />,
      <ListItem key={3} primaryText="Delete" leftIcon={<FontIcon key="data">delete</FontIcon>} />,
    ]}
    anchor={{
      y: MenuButton.VerticalAnchors.BOTTOM,
      x: MenuButton.HorizontalAnchors.INNER_LEFT
    }}
  >
    more_vert
  </MenuButton>
)

export default ListMenu
