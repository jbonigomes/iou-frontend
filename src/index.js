// React
import React from 'react'

import { render } from 'react-dom'

// Apollo
import ApolloClient from 'apollo-boost'

import { concat } from 'apollo-link'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Router
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'

// Components
import App from './App'

const httpLink = createHttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjfh6nor13ecz0103xirfsl94'
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('graphcoolToken') || null
    }
  });

  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
