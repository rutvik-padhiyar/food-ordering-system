// LocationPicker.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker({ onLocationSelect }) {
    const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 }); // India center

    const map = useMapEvents({
        move: () => {
            const center = map.getCenter();
            setPosition(center);              // Marker center follow
            onLocationSelect(center);         // Send location to parent
        },
    });

    return <Marker position={position} icon={markerIcon}></Marker>;
}

export default function LocationPicker({ onChange }) {
    return (
        <div style={{ height: "300px", width: "100%" }}>
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onChange} />
            </MapContainer>
        </div>
    );
}
