import React from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo'

const ALL_LISTS_QUERY = gql`
  query {
    allLists {
      id
      name
      image
    }
  }
`

const Lists = () => {
  return (
    <Query query={ALL_LISTS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div>Loading list...</div>
          )
        }

        if (error) {
          return (
            <div>Error loading list: {error.message}</div>
          )
        }

        return (
          <ul>
            {data.allLists.map((list, i) => (
              <li key={i}>{list.id} - {list.name}</li>
            ))}
          </ul>
        )
      }}
    </Query>
  )
}

export default Lists
