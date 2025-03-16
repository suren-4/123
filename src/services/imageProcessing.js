export const processSRCNN = async (file) => {
  try {
    // First analyze the image type
    const imageType = await analyzeImageType(file);
    // Apply specific enhancements based on artifact type
    const enhancedFile = await enhanceImage(file, imageType);
    return enhancedFile;
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

// Analyze image to determine artifact type
const analyzeImageType = async (file) => {
  const image = await createImageFromFile(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Analyze image characteristics
  const characteristics = {
    textDensity: detectTextDensity(data),
    textureDensity: detectTextureDensity(data),
    colorVariance: calculateColorVariance(data),
    edgeComplexity: calculateEdgeComplexity(data, canvas.width)
  };

  // Determine artifact type based on characteristics
  return determineArtifactType(characteristics);
};

const enhanceImage = async (file, artifactType) => {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "kalanjiyam");
    data.append("cloud_name", "dyggpacf1");

    // Get enhancement parameters based on artifact type
    const enhancementParams = getEnhancementParams(artifactType);
    
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dyggpacf1/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    const result = await response.json();
    
    // Apply type-specific enhancements
    const baseUrl = result.secure_url.split('/upload/')[0] + '/upload/';
    const transformations = enhancementParams.join(',') + '/';
    const filename = result.secure_url.split('/upload/')[1];
    
    const enhancedUrl = baseUrl + transformations + filename;
    const enhancedResponse = await fetch(enhancedUrl);
    const enhancedBlob = await enhancedResponse.blob();
    
    return new File([enhancedBlob], file.name, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Enhancement error:', error);
    throw error;
  }
};

// Detect text density in image
const detectTextDensity = (data) => {
  let edgeCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (i > 0 && Math.abs(brightness - ((data[i - 4] + data[i - 3] + data[i - 2]) / 3)) > 30) {
      edgeCount++;
    }
  }
  return edgeCount / (data.length / 4);
};

// Detect texture patterns
const detectTextureDensity = (data) => {
  let textureScore = 0;
  for (let i = 0; i < data.length; i += 4) {
    const localVariance = calculateLocalVariance(data, i);
    textureScore += localVariance;
  }
  return textureScore / (data.length / 4);
};

// Calculate color variance
const calculateColorVariance = (data) => {
  let colorSum = [0, 0, 0];
  let colorSqSum = [0, 0, 0];
  const n = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      colorSum[j] += data[i + j];
      colorSqSum[j] += data[i + j] * data[i + j];
    }
  }

  return colorSum.map((sum, i) => 
    Math.sqrt(colorSqSum[i] / n - (sum / n) * (sum / n))
  ).reduce((a, b) => a + b) / 3;
};

// Determine artifact type based on analysis
const determineArtifactType = (characteristics) => {
  const {textDensity, textureDensity, colorVariance, edgeComplexity} = characteristics;
  
  if (textDensity > 0.4) return 'inscription';
  if (textureDensity > 0.6) return 'pottery';
  if (colorVariance > 50) return 'painting';
  if (edgeComplexity > 0.5) return 'sculpture';
  return 'general';
};

// Get enhancement parameters based on artifact type
const getEnhancementParams = (artifactType) => {
  const baseParams = [
    'w_1500,h_1500,c_limit',
    'q_auto:best',
    'f_auto'
  ];

  const typeSpecificParams = {
    inscription: [
      'e_sharpen:150',
      'e_gamma:-30',
      'e_contrast:40',
      'e_brightness:15',
      'dpr_2.0'
    ],
    pottery: [
      'e_sharpen:100',
      'e_vibrance:20',
      'e_shadow:30',
      'e_contrast:20',
      'e_improve'
    ],
    painting: [
      'e_vibrance:40',
      'e_auto_color',
      'e_art:athena',
      'e_saturation:10',
      'e_improve'
    ],
    sculpture: [
      'e_shadow:40',
      'e_contrast:30',
      'e_sharpen:80',
      'e_unsharp_mask:100',
      'e_art:zorro'
    ],
    general: [
      'e_improve',
      'e_sharpen:50',
      'e_auto_color',
      'e_contrast:20'
    ]
  };

  return [...baseParams, ...typeSpecificParams[artifactType]];
};

const createImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const applyEnhancements = (imageData) => {
  const data = imageData.data;
  
  // Enhance contrast and brightness
  for (let i = 0; i < data.length; i += 4) {
    // Increase contrast
    data[i] = constrain(data[i] * 1.2); // Red
    data[i + 1] = constrain(data[i + 1] * 1.2); // Green
    data[i + 2] = constrain(data[i + 2] * 1.2); // Blue
    
    // Increase brightness
    data[i] = constrain(data[i] + 10);
    data[i + 1] = constrain(data[i + 1] + 10);
    data[i + 2] = constrain(data[i + 2] + 10);
    
    // Increase sharpness (simple method)
    if (i > 0 && i < data.length - 4) {
      data[i] = (data[i] * 2 - data[i - 4] / 2);
      data[i + 1] = (data[i + 1] * 2 - data[i - 3] / 2);
      data[i + 2] = (data[i + 2] * 2 - data[i - 2] / 2);
    }
  }
  
  return imageData;
};

const constrain = (value) => {
  return Math.min(255, Math.max(0, value));
};