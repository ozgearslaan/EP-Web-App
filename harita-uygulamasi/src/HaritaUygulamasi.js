import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, LayerGroup } from 'react-leaflet';
import Select from 'react-select'; 
import './App.css';
import ilVeIlceSinirlari from './ilVeIlceSinirlari';
import L from 'leaflet';

function HaritaUygulamasi() {
  const [modalAcik, setModalAcik] = useState(false);
  const [selectedIl, setSelectedIl] = useState(null);
  const [selectedIlce, setSelectedIlce] = useState(null);
  const mapRef = useRef();
  const selectedIlceLabel = useRef('');

  const toggleModal = () => {
    setModalAcik(!modalAcik);
  };

  const handleIlClick = (il) => {
    setSelectedIl(il === selectedIl ? null : il);
    setSelectedIlce(null);

    if (il !== selectedIl) {
      const ilSinir = ilVeIlceSinirlari.find((data) => data.il === il).ilSinir;
      mapRef.current.fitBounds(ilSinir);
    }
  };

  const handleIlceClick = (ilce) => {
    setSelectedIlce(ilce === selectedIlce ? null : ilce);

    if (ilce !== selectedIlce && ilce.sinir && ilce.sinir.length > 0) {
      const currentZoom = mapRef.current.getZoom();

      mapRef.current.flyToBounds(ilce.sinir, {
        padding: [10, 10],
        maxZoom: currentZoom + 2,
      });

      selectedIlceLabel.current = ilce ? ilce.isim : '';
    }
  };

  const handleIlHover = (il) => {
    const ilData = ilVeIlceSinirlari.find((data) => data.il === il);

    if (ilData) {
      const ilSinir = ilData.ilSinir;

      if (ilSinir && ilSinir.length > 0 && ilSinir[0].length > 0) {
        const currentZoom = mapRef.current.getZoom();

        mapRef.current.fitBounds(ilSinir, {
          padding: [10, 10],
          maxZoom: currentZoom + 1,
        });

        if (il !== selectedIl) {
          setSelectedIl(il);
          setSelectedIlce(null);

          mapRef.current.fitBounds(ilSinir, { maxZoom: currentZoom + 2 });
        }
      }
    }
  };

  const handleIlceHover = (ilce) => {
    console.log(`İlçe: ${ilce.isim}`);
  };

  // dropdown menü
  const ilOptions = ilVeIlceSinirlari.map((ilData) => ({ value: ilData.il, label: ilData.il }));
  const ilceOptions =
    selectedIl &&
    ilVeIlceSinirlari.find((data) => data.il === selectedIl)?.ilceler.map((ilce) => ({
      value: ilce,
      label: ilce.isim,
    }));

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer
        ref={mapRef}
        center={[39, 35]}
        zoom={7}
        style={{ height: 'calc(100% - 20px)', width: '100%', position: 'absolute' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ilVeIlceSinirlari.map((il) => (
          <LayerGroup key={il.il}>
            {selectedIl !== il.il && (
              <Polygon
                positions={il.ilSinir}
                eventHandlers={{
                  click: () => handleIlClick(il.il),
                  mouseover: () => handleIlHover(il.il),
                }}
                pathOptions={{
                  color:'red',
                  opacity: selectedIl === il.il ? 1 : 0.4,
                }}
              />
            )}
            {selectedIl === il.il && (
              <LayerGroup>
                {il.ilceler.map((ilce) => (
                  <Polygon
                    key={`${il.il}-${ilce.isim}`}
                    positions={ilce.sinir}
                    eventHandlers={{
                      click: () => handleIlceClick(ilce),
                      mouseover: () => handleIlceHover(ilce),
                    }}
                    pathOptions={{
                      color: 'green',
                      opacity: selectedIlce === ilce ? 1 : 0.5,
                      fillOpacity: 0.5,
                    }}
                  />
                ))}
              </LayerGroup>
            )}
          </LayerGroup>
        ))}
      </MapContainer>
      <div
        onClick={toggleModal}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '100%',
          padding: '7px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        &#9668;
      </div>

      <div
        className={`modal ${modalAcik ? 'acik' : ''}`}
        style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          padding: '15px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
        }}
      >
        <div className="modal-icerik">
          <span className="modal-kapat" onClick={toggleModal}>
            &times;
          </span>
          <p style={{ color: 'black' }}>EFES</p>

       
          <Select
            options={ilOptions}
            value={selectedIl ? { value: selectedIl, label: selectedIl } : null}
            onChange={(selected) => handleIlClick(selected.value)}
          />

          {selectedIl && (
            <>
              <p style={{ margin: '10px 0', color: 'white' }}>{selectedIlceLabel.current}</p>
              <Select
                options={ilceOptions}
                value={selectedIlce ? { value: selectedIlce, label: selectedIlce.isim } : null}
                onChange={(selected) => handleIlceClick(selected.value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HaritaUygulamasi;