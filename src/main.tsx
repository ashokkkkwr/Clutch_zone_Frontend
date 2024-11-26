import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider,ApolloClient,InMemoryCache } from '@apollo/client'
import './index.css'
import App from './App.tsx'


const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // Ensure this is your GraphQL endpoint
  cache: new InMemoryCache(), // Set up caching for queries
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ApolloProvider client={client}>

    <App />
    </ApolloProvider>

  </StrictMode>,
)
