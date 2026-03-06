import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Route } from "@/types";

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const stopIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RideMapProps {
  routes: Route[];
  selectedRoute: Route | null;
  onRouteSelect?: (route: Route | null) => void;
  height?: string;
}

export function RideMap({
  routes,
  selectedRoute,
  onRouteSelect,
  height = "400px",
}: RideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeLinesRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Islamabad center coordinates
    const islamabadCenter: [number, number] = [33.6844, 73.0479];

    mapInstanceRef.current = L.map(mapRef.current).setView(islamabadCenter, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);

    markersRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    routeLinesRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when routes or selection changes
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !markersRef.current ||
      !routeLinesRef.current
    )
      return;

    // Clear existing markers and lines
    markersRef.current.clearLayers();
    routeLinesRef.current.clearLayers();

    if (selectedRoute) {
      // Show detailed view of selected route
      const bounds: [number, number][] = [];

      // Pickup marker
      const pickupMarker = L.marker(
        [selectedRoute.pickup.lat, selectedRoute.pickup.lng],
        { icon: pickupIcon },
      )
        .bindPopup(
          `<strong>Pickup:</strong><br>${selectedRoute.pickup.address}`,
        )
        .addTo(markersRef.current);
      bounds.push([selectedRoute.pickup.lat, selectedRoute.pickup.lng]);

      // Stop markers
      (selectedRoute.stops || []).forEach((stop, i) => {
        L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .bindPopup(`<strong>Stop ${i + 1}:</strong><br>${stop.address}`)
          .addTo(markersRef.current!);
        bounds.push([stop.lat, stop.lng]);
      });

      // Dropoff marker
      L.marker([selectedRoute.dropoff.lat, selectedRoute.dropoff.lng], {
        icon: dropoffIcon,
      })
        .bindPopup(
          `<strong>Drop-off:</strong><br>${selectedRoute.dropoff.address}`,
        )
        .addTo(markersRef.current);
      bounds.push([selectedRoute.dropoff.lat, selectedRoute.dropoff.lng]);

      // Draw route line
      const lineCoords = [
        [selectedRoute.pickup.lat, selectedRoute.pickup.lng] as [
          number,
          number,
        ],
        ...(selectedRoute.stops || []).map(
          (s) => [s.lat, s.lng] as [number, number],
        ),
        [selectedRoute.dropoff.lat, selectedRoute.dropoff.lng] as [
          number,
          number,
        ],
      ];

      L.polyline(lineCoords, {
        color: "#7c3aed",
        weight: 4,
        opacity: 0.8,
      }).addTo(routeLinesRef.current);

      // Fit map to bounds
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds as L.LatLngBoundsExpression, {
          padding: [50, 50],
        });
      }
    } else {
      // Show all routes overview
      routes.forEach((route) => {
        // Add pickup markers
        const marker = L.marker([route.pickup.lat, route.pickup.lng])
          .bindPopup(
            `
            <div style="min-width: 150px">
              <strong>${route.pickup.address.split(",")[0]}</strong>
              <br>→ ${route.dropoff.address.split(",")[0]}
              <br><small>${route.availableSeats} seats available</small>
            </div>
          `,
          )
          .addTo(markersRef.current!);

        marker.on("click", () => {
          onRouteSelect?.(route);
        });

        // Draw simple line to destination
        L.polyline(
          [
            [route.pickup.lat, route.pickup.lng],
            [route.dropoff.lat, route.dropoff.lng],
          ],
          {
            color: "#7c3aed",
            weight: 2,
            opacity: 0.5,
            dashArray: "5, 10",
          },
        ).addTo(routeLinesRef.current!);
      });

      // Fit to all routes
      if (routes.length > 0) {
        const allCoords = routes.flatMap((r) => [
          [r.pickup.lat, r.pickup.lng] as [number, number],
          [r.dropoff.lat, r.dropoff.lng] as [number, number],
        ]);
        mapInstanceRef.current.fitBounds(
          allCoords as L.LatLngBoundsExpression,
          { padding: [50, 50] },
        );
      }
    }
  }, [routes, selectedRoute, onRouteSelect]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="rounded-lg z-0"
    />
  );
}
