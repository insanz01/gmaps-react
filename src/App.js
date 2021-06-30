import './App.css';

import {Row, Container, Col, Card, ListGroup} from 'react-bootstrap';
import {useState, useEffect} from 'react';

import axios from 'axios';

const App = () => {

  const defaultURL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127441.5731561793!2d114.7301833890775!3d-3.459147814678052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de686ad57aa9fdf%3A0xd1f27863d3f52ead!2sBanjarbaru%2C%20Kota%20Banjar%20Baru%2C%20Kalimantan%20Selatan!5e0!3m2!1sid!2sid!4v1624874336019!5m2!1sid!2sid`;

  const defaultTitle = "Bank Kalsel Banjarbaru";

  const [mapURL, setURL] = useState(defaultURL);

  const [titleName, setTitle] = useState(defaultTitle);

  const [bankData, getBankData] = useState([]);

  const [selectedItem, selectItem] = useState();

  const [mapHeight, setHeight] = useState('400px');

  const removeSelected = () => {
    bankData.forEach(res => {
      res.is_selected = false;
    });
  };

  const handleTitle = (data) => {
    removeSelected(); // ga kepake

    selectItem(data.id)
    setTitle(data.nama_lokasi);
    setURL(data.url);

    document.title = data.nama_lokasi;
  }

  useEffect(() => {

    document.title = "Map Bank Banjarbaru";

    const handleResize = e => {
      const windowSize = window.innerWidth;
      const tempHeight = (windowSize >= 576) ? '400px' : '300px';
      console.log(tempHeight);
      setHeight(tempHeight);
    };

    window.addEventListener('resize', handleResize);

    // cara 1
    // const urlAPI = `http://localhost:4000/`;
    
    // cara 2
    const createURI = () => {
      const PORT = '4000'; // sesuaikan dengan port API backend

      let tempURI = window.location.origin.split(":");
      let result = ``;

      tempURI.forEach((res, index) => {
        if(index < 2) {
          result += `${res}:`
        }
      });

      result += `${PORT}/`

      return result;
    }

    const urlAPI = createURI();
    
    const getAllData = async () => {
      await axios.get(`${urlAPI}banks`)
        .then((res) => {
          const allData = res.data;
          
          getBankData(allData);
        })
        .catch(err => console.error(`Error: ${err}`));
    }

    getAllData();

  }, []);

  return (
    <div className="App">
      <Container fluid>
        <Row className="pb-3">
          <Col xs={12} md={6} className="mt-3">
            <iframe title="Maps Bank Banjarbaru" src={mapURL} width="100%" height={mapHeight} allowFullScreen={true} loading="lazy" id="map"/>
          </Col>
          <Col xs={12} md={6} className="mt-3">
            <Card>
              <Card.Body>
                <h3 className="font-weight-regular">{titleName}</h3>
                <hr/>
                <ListGroup>
                  {
                    bankData.map(res => 
                      <ListGroup.Item key={res.id.toString()} onClick={() => handleTitle(res)} active={selectedItem === res.id}>{res.nama_lokasi}</ListGroup.Item>
                    )
                  }
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
