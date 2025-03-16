const sampleLocations = [
  "Ajanta Caves, Maharashtra",
  "Ellora Caves, Maharashtra",
  "Hampi, Karnataka",
  "Khajuraho Temples, Madhya Pradesh",
  "Konark Sun Temple, Odisha",
  "Mahabalipuram, Tamil Nadu",
  "Nalanda University Ruins, Bihar",
  "Qutub Minar, Delhi",
  "Sanchi Stupa, Madhya Pradesh",
  "Taj Mahal, Agra",
  "Fatehpur Sikri, Uttar Pradesh",
  "Mohenjo-daro Site, Sindh",
  "Taxila, Punjab",
  "Lothal, Gujarat",
  "Dholavira, Gujarat",
  "Rakhigarhi, Haryana",
  "Kalibangan, Rajasthan",
  "Nagarjunakonda, Andhra Pradesh",
  "Amaravati Stupa, Andhra Pradesh",
  "Bhimbetka Rock Shelters, Madhya Pradesh"
];

// Function to add these locations
const addLocations = async () => {
  try {
    const { data, error } = await supabase
      .from('artifacts')
      .upsert(sampleLocations.map(location => ({
        location: location,
        title: `Artifacts from ${location}`,
        description: `Historical artifacts discovered at ${location}`,
        date: new Date().toISOString()
      })));

    if (error) throw error;
    console.log('Added locations:', data);
  } catch (error) {
    console.error('Error adding locations:', error);
  }
}; 