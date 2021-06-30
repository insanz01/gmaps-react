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

  const removeSelected = () => {
    bankData.forEach(res => {
      res.is_selected = false;
    });
  };

  const handleTitle = (data) => {
    // console.log(data);
    removeSelected();

    selectItem(data.id)
    setTitle(data.nama_lokasi);
    setURL(data.url);

    document.title = data.nama_lokasi;
  }

  useEffect(() => {
    const urlAPI = `http://localhost:4000/`;
    
    const getAllData = async () => {
      await axios.get(`${urlAPI}banks`)
        .then((res) => {
          // console.log(res.data);
          const allData = res.data;
          getBankData(allData);
        })
        .catch(err => console.error(`Error: ${err}`));
    }

    getAllData();

  }, []);

  return (
    <div className="App">
      <Container fluid className="mt-3">
        <Row>
          <Col>
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
                {/*<BankList banks={data}/>*/}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <iframe title="Maps Bank Banjarbaru" src={mapURL} width="100%" height="400px" allowFullScreen={true} loading="lazy" id="map"/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
