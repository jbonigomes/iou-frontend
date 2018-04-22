import React from 'react'
import gql from 'graphql-tag'

import { Query } from 'react-apollo'

import { Cell } from 'react-md'
import { List } from 'react-md'
import { Grid } from 'react-md'
import { Button } from 'react-md'
import { ListItem } from 'react-md'
import { CircularProgress } from 'react-md'

import ListMenu from './ListMenu'
import ListImage from './ListImage'

const ALL_LISTS_QUERY = gql`
  query {
    allLists {
      id
      name
      image
      bought {
        price
      }
    }
  }
`

const sumPrice = (list) => list.reduce((a, b) => a + b.price, 0) || '0.00'

const Lists = () => {
  return (
    <Query query={ALL_LISTS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <CircularProgress id="loading-lists" />
          )
        }

        if (error) {
          return (
            <div>Error loading list: {error.message}</div>
          )
        }

        return (
          <Grid>
            <Cell size={6} phoneOffset={0} tabletOffset={1} desktopOffset={3}>
              <List className="md-paper md-paper--1 iou-list">
                {data.allLists.map((list, i) => (
                  <ListItem
                    key={i}
                    primaryText={list.name}
                    rightIcon={<ListMenu id={i} />}
                    secondaryText={sumPrice(list.bought)}
                    leftAvatar={<ListImage image={list.image} />}
                  />
                ))}
              </List>
            </Cell>
            <Button floating primary fixed fixedPosition="br">add</Button>
          </Grid>
        )
      }}
    </Query>
  )
}

export default Lists
