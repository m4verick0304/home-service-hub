import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

interface LeafletMapProps {
  className?: string;
  userLat?: number;
  userLng?: number;
  helperLat?: number;
  helperLng?: number;
  showHelper?: boolean;
  helperLabel?: string;
  userLabel?: string;
}

export function LeafletMap({
  className,
  userLat: propUserLat,
  userLng: propUserLng,
  helperLat,
  helperLng,
  showHelper = false,
  helperLabel = "Helper",
  userLabel = "You",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const helperMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [userLat, setUserLat] = useState(propUserLat ?? 28.4595);
  const [userLng, setUserLng] = useState(propUserLng ?? 77.0266);
  const [simHelperPos, setSimHelperPos] = useState({ lat: helperLat ?? userLat + 0.012, lng: helperLng ?? userLng - 0.015 });

  // Get real GPS location for user
  useEffect(() => {
    if (propUserLat !== undefined && propUserLng !== undefined) {
      setUserLat(propUserLat);
      setUserLng(propUserLng);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [propUserLat, propUserLng]);

  // Update helper starting position when user position changes
  useEffect(() => {
    if (helperLat !== undefined && helperLng !== undefined) {
      setSimHelperPos({ lat: helperLat, lng: helperLng });
    } else {
      setSimHelperPos({ lat: userLat + 0.012, lng: userLng - 0.015 });
    }
  }, [userLat, userLng, helperLat, helperLng]);

  // Simulate helper movement
  useEffect(() => {
    if (!showHelper) return;
    const interval = setInterval(() => {
      setSimHelperPos(prev => ({
        lat: prev.lat + (userLat - prev.lat) * 0.03 + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (userLng - prev.lng) * 0.03 + (Math.random() - 0.5) * 0.0005,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [showHelper, userLat, userLng]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [userLat, userLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // User marker
    const userIcon = L.divIcon({
      className: "leaflet-user-marker",
      html: `<div style="
        width:40px;height:40px;border-radius:50%;
        background:hsl(220,90%,56%);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:800;font-size:11px;
        box-shadow:0 4px 12px rgba(59,130,246,0.4);
        border:3px solid white;
      ">${userLabel.charAt(0)}</div>
      <div style="text-align:center;font-size:10px;font-weight:700;margin-top:2px;
        background:white;border-radius:99px;padding:1px 6px;box-shadow:0 1px 4px rgba(0,0,0,0.1);
      ">${userLabel}</div>`,
      iconSize: [50, 56],
      iconAnchor: [25, 56],
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map);

    // Pulsing ring for user
    L.circle([userLat, userLng], {
      radius: 200,
      color: "hsl(220,90%,56%)",
      fillColor: "hsl(220,90%,56%)",
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.3,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [userLat, userLng, userLabel]);

  // Update helper marker position
  useEffect(() => {
    if (!mapInstance.current || !showHelper) return;

    const helperIcon = L.divIcon({
      className: "leaflet-helper-marker",
      html: `<div style="
        width:40px;height:40px;border-radius:50%;
        background:hsl(152,60%,45%);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:800;font-size:11px;
        box-shadow:0 4px 12px rgba(34,197,94,0.4);
        border:3px solid white;
      ">🚗</div>
      <div style="text-align:center;font-size:10px;font-weight:700;margin-top:2px;
        background:white;border-radius:99px;padding:1px 6px;box-shadow:0 1px 4px rgba(0,0,0,0.1);
      ">${helperLabel}</div>`,
      iconSize: [50, 56],
      iconAnchor: [25, 56],
    });

    if (helperMarkerRef.current) {
      helperMarkerRef.current.setLatLng([simHelperPos.lat, simHelperPos.lng]);
    } else {
      helperMarkerRef.current = L.marker([simHelperPos.lat, simHelperPos.lng], { icon: helperIcon }).addTo(mapInstance.current);
    }

    // Route line
    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs([[simHelperPos.lat, simHelperPos.lng], [userLat, userLng]]);
    } else {
      routeLineRef.current = L.polyline(
        [[simHelperPos.lat, simHelperPos.lng], [userLat, userLng]],
        { color: "hsl(220,90%,56%)", weight: 3, dashArray: "8 6", opacity: 0.7 }
      ).addTo(mapInstance.current);
    }

    // Fit bounds
    mapInstance.current.fitBounds([
      [simHelperPos.lat, simHelperPos.lng],
      [userLat, userLng],
    ], { padding: [60, 60] });
  }, [simHelperPos, showHelper, helperLabel, userLat, userLng]);

  return (
    <div className={cn("relative w-full rounded-2xl overflow-hidden border", className)} style={{ minHeight: 200 }}>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 sh-shadow text-[10px] font-semibold text-foreground">
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--sh-green))] animate-pulse" />
        Live tracking
      </div>
    </div>
  );
}
