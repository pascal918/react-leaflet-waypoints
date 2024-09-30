import { useState, useMemo, useCallback, useRef } from "react";

import { MapContainer, TileLayer, Polyline, Marker,Popup } from 'react-leaflet';
import "./App.css";
import "leaflet/dist/leaflet.css";

const center = [51.505, -0.09];
const zoom = 13;
const limeOptions = { color: 'lime' };

function Carte() {
    const [map, setMap] = useState(null)
    const [polyline, setPolyline] = useState([center ]);

    //const [position, setPosition] = useState(() => map.getCenter())
    const [routeList, setRouteList] = useState([{ latitude: center.at(0), longitude: center.at(1) }]);
    const mapRef = useRef(null);

    const handleRouteChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...routeList];
        list[index][name] = value;
        setRouteList(list);
        if (routeList.length > 1) {
            // Update polyline directly
            const updatedPolyline = routeList.filter(item => item.latitude!== "" && item.longitude!== "" && item.longitude!== "-").map(item => [item.latitude, item.longitude]);
            setPolyline(updatedPolyline);
            console.log(updatedPolyline.at(-1), 'edit ways ',updatedPolyline)
            if (map.current) {
                console.log("Edited, fly to last point")
                map.current.flyTo(updatedPolyline.at(-1), zoom);
            }

        }
    }

    const handleRouteRemove = (index) => {
        const list = [...routeList];
        list.splice(index, 1);
        setRouteList(list);
            // Update polyline directly
        const updatedPolyline = list.filter(item => item.latitude!== "" && item.longitude!== "" && item.longitude!== "-").map(item => [item.latitude, item.longitude]);
        setPolyline(updatedPolyline);        
        console.log(updatedPolyline.at(-1), 'remove points ',updatedPolyline)
        if (map.current) {
            console.log("removed, fly to last point")
            map.current.flyTo(updatedPolyline.at(-1), zoom);
        }

        
    };

    const handleRouteAdd = () => {
        setRouteList([...routeList, { latitude: "", longitude: "" }]);
    };

    return (
        
        <div>
            <MapContainer 
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: '600px', width: '800px', display: 'table-cell' }}
            ref={setMap}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker onDragEnd={() => map.current?.getCenter()} />
            <Polyline pathOptions={limeOptions} positions={polyline} key={JSON.stringify(polyline)} />
            </MapContainer>
            <form className="App" autoComplete="off">
                <div className="form-field">
                    <label htmlFor="route">Routes</label>
                    <p />
                    <label>latitude  longitude</label>
                    {routeList.map((singleRoute, index) => (
                        <div key={index} className="routes">
                            <div className="first-division">
                                <input
                                    name="latitude"
                                    type='number'
                                    id="latitude"
                                    value={singleRoute.latitude}
                                    onChange={(e) => handleRouteChange(e, index)}
                                    required
                                />
                                {routeList.length - 1 === index && (
                                    <button
                                        type="button"
                                        onClick={handleRouteAdd}
                                        className="add-btn"
                                    >
                                        <span>+ Add new route</span>
                                    </button>
                                )}
                            </div>
                            <div className="second-division">
                                <input
                                    name="longitude"
                                    type="number"
                                    id="longitude"
                                    value={singleRoute.longitude}
                                    onChange={(e) => handleRouteChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="third-division">
                                {routeList.length!== 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRouteRemove(index)}
                                        className="remove-btn"
                                    >
                                        <span>Del</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}


function DraggableMarker({ onDragEnd }) {
    const [draggable, setDraggable] = useState(true)
    const [position, setPosition] = useState(center)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
            if (onDragEnd) {
                onDragEnd();
            }
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])
    return (
        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}>
          <Popup minWidth={90}>
            <span onClick={toggleDraggable}>
              {draggable
                ? 'Marker is draggable'
                : 'Click here to make marker draggable'}
            </span>
          </Popup>
        </Marker>
      );
}
export default Carte;