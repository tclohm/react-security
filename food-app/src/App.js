import React, { useState, useEffect } from 'react';
import './App.css';

// MARK: -- Third Party
import axios from 'axios';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';

// const apiUrl = 'http://localhost:8000'

// axios.interceptors.request.use(
//   config => {
//     const { origin } = new URL(config.url)
//     const allowedOrigins = [apiUrl]
//     const token = localStorage.getItem('token')

//     if (allowedOrigins.includes(origin)) {
//       config.headers.authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

function App() {
  const storedJwt = localStorage.getItem('token')
  const [newFoodMessage, setNewFoodMessage] = useState(null)
  const [jwt, setJwt] = useState(storedJwt || null)
  const [foods, setFoods] = useState([])
  const [fetchError, setFetchError] = useState(null)

  const getJwt = async () => {
    const { data } = await axios.get(`/jwt`)
    setJwt(data.token)
  }

  const getFoods = async () => {
    try {
      const { data } = await axios.get(`/foods`)
      setFoods(data)
      setFetchError(null)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  const createFood = async () => {
    try {
      const { data } = await axios.post('/foods');
      setNewFoodMessage(data.message)
      setFetchError(null)
    } catch (err) {
      setFetchError(err.message)
    }
  }

  useEffect(() => {
    const getCSRFToken = async () => {
      const { data } = await axios.get('/csrf-token')
      axios.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
    }

    getCSRFToken()
  }, [])

  return (
   <Container>
     <section style={{ marginBottom: '10px' }}>
       <Row className="mt-5">
          <Col xs={{ size: 12 }}>
            <Button color='primary' onClick={() => getJwt()}>Get JWT</Button>
          </Col>
       </Row>
       <Row className="mt-4">
          <Col xs={{ size: 12 }}>
            {jwt && (
                <Alert color="dark"><code style={{ color: 'black' }}>{jwt}</code></Alert>
            )}
          </Col>
        </Row>
      </section>
      <section>
        <Button color='primary' onClick={() => getFoods()}>
          Get Foods
        </Button>
        <Table className="mt-4">
          {foods.map((food, i) => (
            <tbody>
            <tr>
              <th>{food.id}</th>
              <td>{food.item}</td>
            </tr>
            </tbody>
          ))}
        </Table>
        {fetchError && (
          <Alert color="warning">{fetchError}</Alert>
        )}
      </section>
      <section>
        <Button color="primary" onClick={() => createFood()}>
          Create New Food
        </Button>
        {newFoodMessage && <Alert color="success">{newFoodMessage}</Alert>}
      </section>
   </Container>
  );
}

export default App;
