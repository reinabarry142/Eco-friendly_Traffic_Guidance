export const fetchParkingData = async (latitude, longitude, radius = 1500) => {
    const query = `
      [out:json];
      (
        node["amenity"="parking"](around:${radius},${latitude},${longitude});
        way["amenity"="parking"](around:${radius},${latitude},${longitude});
        relation["amenity"="parking"](around:${radius},${latitude},${longitude});
      );
      out center tags;
    `;
  
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query,
    });
  
    const data = await response.json();
    return data.elements;
  };
  