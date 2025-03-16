export const generateCsvTemplate = () => {
  const headers = [
    'Title',
    'Description',
    'Date',
    'Location',
    'Resource Type',
    'Material',
    'Period/Era',
    'Language',
    'Current Location',
    'Excavator',
    'Reference Document'
  ];

  const csvContent = headers.join(',');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'artifact_template.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}; 