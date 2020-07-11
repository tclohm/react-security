import React, { useState } from 'react';
import './App.css';

// MARK: -- Third Party
import axios from 'axios';
import { Container, Row, Col, Button, Alert, Table } from 'reactstrap';

const apiUrl = 'http://localhost:8000'

axios.interceptors.request.use(
  config => {
    const { origin } = new URL(config.url)
    const allowedOrigins = [apiUrl]
    const token = localStorage.getItem('token')

    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function App() {
  const storedJwt = localStorage.getItem('token')
  const [jwt, setJwt] = useState(storedJwt || null)
  const [foods, setFoods] = useState([])
  const [fetchError, setFetchError] = useState(null)

  const getJwt = async () => {
    const { data } = await axios.get(`${apiUrl}/jwt`)
    localStorage.setItem('token', data.token)
    setJwt(data.token)
  }

  const getFoods = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/foods`)
      setFoods(data)
      setFetchError(null)
    } catch (err) {
      setFetchError(err.message)
    }
  }
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
   </Container>
  );
}

export default App;
