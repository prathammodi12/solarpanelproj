// frontend - React/Next.js
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SolarPanelOptimization() {
  const [location, setLocation] = useState("");
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/placements")
      .then((res) => res.json())
      .then((data) => setPlacements(data));
  }, []);

  const handleOptimization = async () => {
    const res = await fetch("http://localhost:5000/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, tiltAngle: 30, azimuth: 180, efficiency: 90 }),
    });
    const data = await res.json();
    setPlacements([...placements, data.panel]);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Solar Panel Placement Optimizer</h1>
      <Card className="w-full max-w-lg p-4">
        <CardContent>
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={handleOptimization}>
            Optimize Placement
          </Button>
        </CardContent>
      </Card>
      <div className="mt-6 w-full h-80">
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {placements.map((panel, index) => (
            <Marker key={index} position={[37.7749, -122.4194]}>
              <Popup>Optimal Solar Panel Placement</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
