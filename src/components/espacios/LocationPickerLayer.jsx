import L from 'leaflet'
import { Marker, useMapEvents } from 'react-leaflet'

const pickIcon = L.divIcon({
  className: '',
  html: `<span style="display:block;width:20px;height:20px;border-radius:50% 50% 50% 0;background:#3A82CA;border:2px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.4)"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
})

// Must render as a child of <MapContainer> — react-leaflet's map hooks only
// work inside the map's own React tree.
export default function LocationPickerLayer({ active, position, onPick }) {
  useMapEvents({
    click(e) {
      if (active) onPick([e.latlng.lat, e.latlng.lng])
    },
  })

  if (!position) return null
  return (
    <Marker
      position={position}
      icon={pickIcon}
      draggable={active}
      eventHandlers={active ? {
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng()
          onPick([lat, lng])
        },
      } : undefined}
    />
  )
}
