import { useState, useEffect, useRef } from 'react';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Map as MapIcon, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [activeGeoJson, setActiveGeoJson] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    api.properties.list().catch(() => []).then((data) => {
      const list = (data && data.length > 0)
        ? data.map((p: any) => ({
            id: p.survey_number || p.property_id || 'SN-DEMO-001',
            location: `${p.village || 'Block A, Survey 123'}, ${p.district || 'Mysuru'}`,
            area: `${p.area || 2500} sq ft`,
            owner: p.owner_wallet ? `${p.owner_wallet.substring(0, 6)}...${p.owner_wallet.slice(-4)}` : '0x7a3f...9b2c',
            status: p.status === 'REGISTERED' || !p.status ? 'Verified' : 'Pending',
            lat: '12.1812',
            lon: '76.6852',
            raw: p,
          }))
        : [
            {
              id: 'SN-2023-4521',
              location: 'Block A, Survey 123, District North',
              area: '2,500 sq ft',
              owner: '0x7a3f...9b2c',
              status: 'Verified',
              lat: '28.7041',
              lon: '77.1025'
            },
            {
              id: 'SN-2023-4522',
              location: 'Block B, Survey 124, District Central',
              area: '3,200 sq ft',
              owner: '0x8b4c...1a3d',
              status: 'Pending',
              lat: '28.7051',
              lon: '77.1035'
            },
            {
              id: 'SN-2023-4523',
              location: 'Block C, Survey 125, District South',
              area: '1,800 sq ft',
              owner: '0x9c5d...2b4e',
              status: 'Verified',
              lat: '28.7061',
              lon: '77.1045'
            },
          ];
      setProperties(list);
      setFilteredProperties(list);
    });

    api.gis.getBySurvey('SN-DEMO-001').then((res) => {
      if (res?.geojson) setActiveGeoJson(res.geojson);
    }).catch(() => {});
  }, []);

  const handleSearch = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : searchQuery).trim().toLowerCase();
    if (!q) {
      setFilteredProperties(properties);
      return;
    }
    const matched = properties.filter((p) =>
      p.id.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q)
    );
    setFilteredProperties(matched);

    api.gis.getBySurvey(q.toUpperCase()).then((res) => {
      if (res?.geojson) {
        setActiveGeoJson(res.geojson);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.1812, 76.6852],
        zoom: 16,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }

    if (activeGeoJson) {
      const geoLayer = L.geoJSON(activeGeoJson, {
        style: {
          color: '#0F766E',
          weight: 3,
          fillColor: '#14B8A6',
          fillOpacity: 0.35,
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          layer.bindPopup(
            `<div class="p-2 font-sans">
              <p class="font-bold text-[#0F766E] text-sm">Survey: ${props.survey_number || ''}</p>
              <p class="text-xs text-gray-600">Area: ${props.area_sqft || 2500} sq ft</p>
              <p class="text-xs text-gray-600">${props.locality || 'Thandavapura'}</p>
            </div>`
          );
        },
      }).addTo(map);
      geojsonLayerRef.current = geoLayer;
      try {
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [activeGeoJson]);

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Property Search</h1>
          <p className="text-[#64748B]">Search and explore registered land parcels using Survey Number or Property ID</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0] mb-6">
              <CardContent className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <Input
                      placeholder="Search by Survey Number or Property ID..."
                      className="pl-10 h-12 border-[#E2E8F0]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="bg-[#0F766E] hover:bg-[#0F766E]/90 h-12 px-8">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">GIS Map View</CardTitle>
                <CardDescription className="text-[#64748B]">
                  Click on parcels to view details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#38BDF8]/20 rounded-xl relative overflow-hidden">
                  <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10 pointer-events-auto">
                    <p className="text-xs font-medium text-[#0F172A] mb-2">Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#0F766E] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#38BDF8] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Search Results</CardTitle>
                <CardDescription className="text-[#64748B]">{filteredProperties.length} properties found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProperties.map((property, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearch(property.id)}
                      className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#0F766E] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-[#0F172A]">{property.id}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                            property.status === 'Verified'
                              ? 'bg-[#16A34A]/10 text-[#16A34A]'
                              : 'bg-[#38BDF8]/10 text-[#38BDF8]'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        <Link to={`/properties/${encodeURIComponent(property.id)}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
                          <p className="text-[#64748B]">{property.location}</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Area:</span>
                          <span className="text-[#0F172A] font-medium">{property.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Owner:</span>
                          <span className="text-[#0F172A] font-mono text-xs">{property.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Coordinates:</span>
                          <span className="text-[#0F172A] text-xs">{property.lat}, {property.lon}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link to={`/properties/${encodeURIComponent(property.id)}`} className="flex-1">
                          <Button variant="outline" className="w-full border-[#E2E8F0]">
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/transfer?survey=${encodeURIComponent(property.id)}`} className="flex-1">
                          <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-xs">
                            Transfer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

