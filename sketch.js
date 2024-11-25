// sketch.js

var video;
var videoReady = false; // Flag to check if video is ready

// Adjust these values for color matching sensitivity
var hueTolerance = 10; // Hue ranges from 0 to 360
var saturationTolerance = 30; // Saturation ranges from 0 to 100
var brightnessTolerance = 100; // Brightness ranges from 0 to 255

// Array to hold settings for each control container
var settingsArray = [];

// Unique index for control containers
var controlIndex = 0;

function preload() {
  // No need to preload fonts since we use font-family names
}

function setup() {
  // Set pixel density to 1 to avoid high-DPI displays causing issues
  pixelDensity(1);

  // Set the color mode to HSB with specific ranges
  colorMode(HSB, 360, 100, 255);

  // Get the canvas container dimensions
  var canvasContainer = document.getElementById('canvas-container');
  var canvasWidth = canvasContainer.offsetWidth;
  var canvasHeight = canvasContainer.offsetHeight;

  // Create the canvas and attach it to the canvas container
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container'); // Attach canvas to its container

  // Set video width and height to match canvas dimensions
  var videoWidth = canvasWidth;
  var videoHeight = canvasHeight;

  // Define constraints for video capture to set the desired resolution
  let constraints = {
    video: {
      width: { ideal: videoWidth },
      height: { ideal: videoHeight },
      facingMode: 'user' // Use 'environment' for rear camera on mobile
    },
    audio: false
  };

  // Initialize the webcam capture with constraints
  video = createCapture(constraints, function(stream) {
    // Video is ready
    videoReady = true;
  });
  video.size(videoWidth, videoHeight); // Set the video size to match the calculated dimensions
  video.parent('video-container'); // Attach video to its container

  // Style the video to cover its container without distortion
  video.style('object-fit', 'cover');
  video.style('width', '100%');
  video.style('height', '100%');

  // Initialize text settings
  noStroke(); // No outline for text
  fill(0); // Black text color

  // Add initial control containers
  addControlContainerImg();
  addControlContainer();

  // Add event listener for the Text "Add" button
  var addButton = document.getElementById('addButton');
  addButton.addEventListener('click', function() {
    addControlContainer();
  });

  // Add event listener for the Image "Add" button
  var addButtonImg = document.getElementById('addButtonimg');
  addButtonImg.addEventListener('click', function() {
    addControlContainerImg();
  });

  // Project brief toggle
  var questionMark = document.querySelector('.questionmark');
  var projectBrief = document.querySelector('.projectbrief');
  questionMark.addEventListener('click', function() {
    // Toggle the display property of the project brief
    if (projectBrief.style.display === 'none' || projectBrief.style.display === '') {
      projectBrief.style.display = 'block';
    } else {
      projectBrief.style.display = 'none';
    }
  });

  // Initialize save image functionality
  initializeSaveImage();
}

function initializeSaveImage() {
  // Handle the Save Image button click
  var saveImageButton = document.querySelector('.bottombutton');
  saveImageButton.addEventListener('click', function() {
    saveCanvasImage();
    saveVideoFrame();
  });
}

function saveCanvasImage() {
  // Save the p5.js canvas as an image
  saveCanvas('canvas-image', 'png');
}

function saveVideoFrame() {
  // Create an off-screen canvas to capture the video frame
  var offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = video.width;
  offscreenCanvas.height = video.height;
  var offscreenCtx = offscreenCanvas.getContext('2d');

  // Draw the current video frame onto the off-screen canvas
  offscreenCtx.drawImage(video.elt, 0, 0, video.width, video.height);

  // Convert the canvas to a data URL (base64-encoded image)
  var dataURL = offscreenCanvas.toDataURL('image/png');

  // Create a download link and trigger a download
  var downloadLink = document.createElement('a');
  downloadLink.href = dataURL;
  downloadLink.download = 'video-frame.png';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function addControlContainer() {
  controlIndex++;
  var index = controlIndex;

  // Create a new settings object and add it to the array
  var settings = {
    fontSize: 16, // Default font size in pixels (1rem = 16px)
    targetColor: [255, 0, 0],
    targetColorHSB: [0, 100, 255], // Initial HSB color for red
    selectedFont: 'ARIAL',
    textContent: 'Your text here.',
    customFontName: null,
    repeatText: true, // Default to true
    type: 'text',
    lineHeight: 1.0 // Default line height multiplier (100%)
  };
  settingsArray.push({ index: index, settings: settings });

  // Clone the font uploader template and set its id
  var fontUploaderTemplate = document.getElementById('fontUploaderTemplate');
  var fontUploader = fontUploaderTemplate.cloneNode(true);
  fontUploader.id = 'fontUploader' + index;
  document.body.appendChild(fontUploader);

  // Create the control container HTML
  var controlContainerHTML = `
    <div class="controlcontainer" id="controlContainer${index}">
      <div class="colorpicker">
        <input type="color" id="colorPicker${index}" name="colorPicker${index}" value="#ff0000">
      </div>
      <div class="options">
        <div class="fontchoice">
          <div>Font</div>
          <div class="dropdown">
            <button class="dropbtn" id="fontButton${index}">Arial</button>
            <div class="dropdown-content">
              <a href="#" data-font="ARIAL">Arial</a>
              <a href="#" data-font="ABCMaxiRoundEdu">Maxi Round</a>
              <a href="#" data-font="Andale Mono">Andale Mono</a>
              <a href="#" data-font="MO_VIO_DisplayNormal">Mo&Vio</a>
              <a href="#" id="uploadFontLink${index}" style="border-bottom: 1px solid black;">↑ Upload your font</a>
            </div>
          </div>
        </div>
        <div class="sizechoice" style="margin-top:0.8rem;">
          <div>Size</div>
          <div class="slider-container">
            <input type="range" id="sizeSlider${index}" min="0.6" max="12" step="0.1" value="1" style="width:100%;">
          </div>
        </div>
        <!-- Leading Slider -->
        <div class="leadingchoice" style="margin-top:0.8rem;">
          <div>Leading</div>
          <div class="slider-container">
            <input type="range" id="leadingSlider${index}" min="0.8" max="3" step="0.1" value="1" style="width:100%;">
          </div>
        </div>
        <div class="inputtext">
          <textarea id="textInput${index}">Your text here.</textarea>
        </div>
        <div class="repeatandminus">
          <div class="repeatcheckbox">
            <label>
              <input type="checkbox" id="repeatCheckbox${index}" checked>
              <span class="custom-checkbox"></span>
              <span>Repeat text</span>
            </label>
          </div>
          <button type="button" class="remove-button" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M19 13H7" stroke="black" stroke-width="2"/>
              <circle cx="13" cy="13" r="12" stroke="black" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Insert the control container into the DOM
  var controlContainers = document.getElementById('controlContainers');
  controlContainers.insertAdjacentHTML('beforeend', controlContainerHTML);

  // Initialize controls for this container
  initializeControls(settings, index);

  // Add event listener for the remove button
  var removeButton = document.querySelector(`#controlContainer${index} .remove-button`);
  removeButton.addEventListener('click', function() {
    removeControlContainer(index);
  });
}

function addControlContainerImg() {
  controlIndex++;
  var index = controlIndex;

  // Create a settings object for the image control
  var settings = {
    targetColor: [255, 0, 0],
    targetColorHSB: [0, 100, 255], // Initial HSB color for red
    image: null,
    imageLoaded: false,
    imageUrl: null,
    index: index,
    type: 'image',
    keepProportion: true // Default to true
  };
  settingsArray.push({ index: index, settings: settings });

  // Clone the image uploader template and set its id
  var imageUploaderTemplate = document.getElementById('imageUploaderTemplate');
  var imageUploader = imageUploaderTemplate.cloneNode(true);
  imageUploader.id = 'imageUploader' + index;
  document.body.appendChild(imageUploader);

  // Create the control container HTML
  var controlContainerHTML = `
    <div class="controlcontainerimg" id="controlContainer${index}">
      <div class="colorpicker">
        <input type="color" id="colorPicker${index}" name="colorPicker${index}" value="#ff0000">
      </div>
      <div class="options">
        <div class="imagecontainer" id="imageContainer${index}">
          <img id="imageDisplay${index}" src="assets/exampleimage.jpg">
          <div class="hover-text">↑ Upload your image</div>
        </div>
        <div class="repeatandminus">
          <div class="keep-proportion-checkbox">
            <label>
              <input type="checkbox" id="keepProportionCheckbox${index}" checked>
              <span class="custom-checkbox"></span>
              <span>Keep proportion</span>
            </label>
          </div>
          <button type="button" class="remove-button" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M19 13H7" stroke="black" stroke-width="2"/>
              <circle cx="13" cy="13" r="12" stroke="black" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Insert the control container into the DOM
  var controlContainers = document.getElementById('controlContainers');
  controlContainers.insertAdjacentHTML('beforeend', controlContainerHTML);

  // Initialize controls for this container
  initializeControlsImg(settings, index);

  // Add event listener for the remove button
  var removeButton = document.querySelector(`#controlContainer${index} .remove-button`);
  removeButton.addEventListener('click', function() {
    removeControlContainer(index);
  });
}

function removeControlContainer(index) {
  // Remove settings from the array
  settingsArray = settingsArray.filter(item => item.index !== index);

  // Remove the control container from the DOM
  var controlContainer = document.getElementById('controlContainer' + index);
  if (controlContainer) {
    controlContainer.remove();
  }

  // Remove the font uploader input if it exists
  var fontUploader = document.getElementById('fontUploader' + index);
  if (fontUploader) {
    fontUploader.remove();
  }

  // Remove the image uploader input if it exists
  var imageUploader = document.getElementById('imageUploader' + index);
  if (imageUploader) {
    imageUploader.remove();
  }
}

function initializeControls(settings, index) {
  // Get the color picker element
  var colorPicker = document.getElementById('colorPicker' + index);

  // Add event listener to update target color when user selects a new color
  colorPicker.addEventListener('input', function() {
    var hexColor = colorPicker.value; // Get the hex color code
    settings.targetColor = hexToRgb(hexColor); // Convert hex to RGB array
    settings.targetColorHSB = rgbToHsb(settings.targetColor[0], settings.targetColor[1], settings.targetColor[2]); // Convert to HSB
  });

  // Initialize the HSB target color
  var hexColor = colorPicker.value;
  settings.targetColor = hexToRgb(hexColor);
  settings.targetColorHSB = rgbToHsb(settings.targetColor[0], settings.targetColor[1], settings.targetColor[2]);

  // Font dropdown
  var fontButton = document.getElementById('fontButton' + index);
  var fontDropdown = fontButton.nextElementSibling;
  var fontDropdownItems = fontDropdown.querySelectorAll('a');
  fontDropdownItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default action of the link

      if (this.id === 'uploadFontLink' + index) {
        // Trigger the file input click when "Upload your font" is selected
        document.getElementById('fontUploader' + index).click();
      } else {
        var fontName = this.getAttribute('data-font');
        if (fontName) {
          settings.selectedFont = fontName;
          settings.customFontName = null; // Reset custom font name if any
          // Update the button label to show selected font name
          fontButton.textContent = this.textContent;
        }
      }
    });
  });

  // Font uploader
  var fontUploader = document.getElementById('fontUploader' + index);
  fontUploader.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var fontData = e.target.result; // This is an ArrayBuffer
        // Generate a unique font name
        var fontName = 'CustomFont' + index + '_' + Date.now();
        var fontFace = new FontFace(fontName, fontData);
        fontFace.load().then(function(loadedFace) {
          // Add the font to the document
          document.fonts.add(loadedFace);
          // Update selectedFont to use the new font family name
          settings.selectedFont = fontName;
          settings.customFontName = fontName;
          // Update the dropdown button label
          fontButton.textContent = 'Custom Font';
        }).catch(function(error) {
          console.error('Failed to load font:', error);
        });
      };
      // Read the font file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    }
  });

  // Size slider
  var sizeSlider = document.getElementById('sizeSlider' + index);
  sizeSlider.addEventListener('input', function() {
    var remValue = parseFloat(this.value);
    var fontSizeInPixels = remValue * 16; // Assuming 1rem = 16px
    settings.fontSize = fontSizeInPixels;
  });

  // Leading slider
  var leadingSlider = document.getElementById('leadingSlider' + index);
  leadingSlider.addEventListener('input', function() {
    var leadingValue = parseFloat(this.value);
    settings.lineHeight = leadingValue; // Directly use the multiplier
  });

  // Text input
  var textInput = document.getElementById('textInput' + index);
  textInput.addEventListener('input', function() {
    settings.textContent = this.value || '';
  });

  // Repeat text checkbox
  var repeatCheckbox = document.getElementById('repeatCheckbox' + index);
  repeatCheckbox.addEventListener('change', function() {
    settings.repeatText = this.checked;
  });
}

function initializeControlsImg(settings, index) {
  // Get the color picker element
  var colorPicker = document.getElementById('colorPicker' + index);

  // Add event listener to update target color when user selects a new color
  colorPicker.addEventListener('input', function() {
    var hexColor = colorPicker.value; // Get the hex color code
    settings.targetColor = hexToRgb(hexColor); // Convert hex to RGB array
    settings.targetColorHSB = rgbToHsb(settings.targetColor[0], settings.targetColor[1], settings.targetColor[2]); // Convert to HSB
  });

  // Initialize the HSB target color
  var hexColor = colorPicker.value;
  settings.targetColor = hexToRgb(hexColor);
  settings.targetColorHSB = rgbToHsb(settings.targetColor[0], settings.targetColor[1], settings.targetColor[2]);

  // Image uploader
  var imageUploader = document.getElementById('imageUploader' + index);
  var imageContainer = document.getElementById('imageContainer' + index);
  var imageDisplay = document.getElementById('imageDisplay' + index);

  imageContainer.addEventListener('click', function() {
    // Trigger the file input click when the image container is clicked
    imageUploader.click();
  });

  imageUploader.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var imageDataUrl = e.target.result; // Data URL of the image
        // Set the image in the settings
        settings.imageUrl = imageDataUrl;
        settings.imageLoaded = false; // We need to load the image in p5.js

        // Update the image display in the control container
        imageDisplay.src = imageDataUrl;
      };
      reader.readAsDataURL(file); // Read the image file as Data URL
    }
  });

  // Keep proportion checkbox
  var keepProportionCheckbox = document.getElementById('keepProportionCheckbox' + index);
  settings.keepProportion = true; // Default to true

  keepProportionCheckbox.addEventListener('change', function() {
    settings.keepProportion = this.checked;
  });
}

function draw() {
  if (!videoReady) {
    return; // Wait until the video is ready
  }

  // Resize the canvas if the window size changes
  var canvasContainer = document.getElementById('canvas-container');
  var canvasWidth = canvasContainer.offsetWidth;
  var canvasHeight = canvasContainer.offsetHeight;
  resizeCanvas(canvasWidth, canvasHeight);

  background(255); // Set background to white

  // Load pixel data from the webcam feed
  video.loadPixels();

  // Render text or images for each settings object
  settingsArray.forEach(function(item) {
    if (item.settings.type === 'text') {
      renderText(item.settings);
    } else if (item.settings.type === 'image') {
      renderImage(item.settings);
    }
  });
}

function renderText(settings) {
  if (settings.textContent.length === 0) {
    return; // If there's no text, don't draw anything
  }

  // Split the text into individual characters, including line breaks
  var letters = settings.textContent.split(''); // Split into characters

  var letterCounter = 0; // Tracks which letter is being drawn

  var x = 0;
  var y = settings.fontSize; // Start y at the font size to account for text height

  // Set the font and size before drawing
  textFont(settings.selectedFont);
  textSize(settings.fontSize); // Update text size in case fontSize has changed

  // Loop until we've filled the canvas
  while (y < height) {
    // Check if x exceeds the canvas width
    if (x >= width) {
      x = 0;
      y += settings.fontSize * settings.lineHeight; // Move to the next line with adjusted leading
    }

    // Map canvas coordinates to video coordinates
    var xPos = floor(map(x, 0, width, 0, video.width));
    var yPos = floor(map(y - settings.fontSize / 2, 0, height, 0, video.height));

    // Ensure we don't go out of the video bounds
    if (xPos < video.width && yPos < video.height && xPos >= 0 && yPos >= 0) {
      var index = (xPos + yPos * video.width) * 4; // Get pixel index
      var r = video.pixels[index];     // Red value
      var g = video.pixels[index + 1]; // Green value
      var b = video.pixels[index + 2]; // Blue value

      // Convert pixel color to HSB
      var pixelColorHSB = rgbToHsb(r, g, b);

      // Detect pixels matching the selected color within the tolerances
      if (colorMatchesHSB(pixelColorHSB, settings.targetColorHSB)) {
        if (letterCounter >= letters.length) {
          if (settings.repeatText) {
            letterCounter = 0; // Reset letterCounter to repeat text
          } else {
            break; // Exit the loop if not repeating
          }
        }

        var c = letters[letterCounter];
        var cWidth = textWidth(c); // Get the width of the character

        if (c === '\n') {
          // Handle line breaks
          x = 0;
          y += settings.fontSize * settings.lineHeight;
        } else {
          // Draw the character at (x, y)
          text(c, x, y);
          x += cWidth; // Increment x by the width of the character
        }

        letterCounter++; // Move to the next letter

        continue; // Continue to the next iteration
      }
    }

    x += 1; // Increment x by 1 pixel if no matching pixel is detected
  }
}

function renderImage(settings) {
  // Load the image if not already loaded
  if (!settings.imageLoaded) {
    if (settings.imageUrl) {
      // Load the image from the data URL
      loadImage(settings.imageUrl, function(img) {
        settings.image = img;
        settings.imageLoaded = true;

        // Create mask graphics buffer
        settings.maskGraphics = createGraphics(width, height);

        // Create image graphics buffer
        settings.imageGraphics = createGraphics(width, height);
      });
    } else {
      // No image URL set
      return;
    }
  }

  if (!settings.image || !settings.imageLoaded) {
    return; // Wait until image is loaded
  }

  // Create or resize the mask graphics buffer if necessary
  if (!settings.maskGraphics) {
    settings.maskGraphics = createGraphics(width, height);
  } else if (settings.maskGraphics.width !== width || settings.maskGraphics.height !== height) {
    settings.maskGraphics.resizeCanvas(width, height);
  }

  // Create or resize the image graphics buffer if necessary
  if (!settings.imageGraphics) {
    settings.imageGraphics = createGraphics(width, height);
  } else if (settings.imageGraphics.width !== width || settings.imageGraphics.height !== height) {
    settings.imageGraphics.resizeCanvas(width, height);
  }

  // Load pixels from webcam
  video.loadPixels();

  // Load pixels into mask graphics
  settings.maskGraphics.loadPixels();

  // Initialize bounding box variables
  var minX = width - 1;
  var minY = height - 1;
  var maxX = 0;
  var maxY = 0;
  var foundMatchingPixel = false;

  // Loop over the pixels
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var index = (x + y * width) * 4;

      var vr = video.pixels[index];
      var vg = video.pixels[index + 1];
      var vb = video.pixels[index + 2];

      // Convert pixel color to HSB
      var pixelColorHSB = rgbToHsb(vr, vg, vb);

      // Detect pixels matching the selected color within the tolerances
      if (colorMatchesHSB(pixelColorHSB, settings.targetColorHSB)) {
        // Matching color, set mask pixel to white
        settings.maskGraphics.pixels[index] = 255;
        settings.maskGraphics.pixels[index + 1] = 255;
        settings.maskGraphics.pixels[index + 2] = 255;
        settings.maskGraphics.pixels[index + 3] = 255;

        // Update bounding box
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        foundMatchingPixel = true;
      } else {
        // Non-matching color, set mask pixel to transparent
        settings.maskGraphics.pixels[index] = 0;
        settings.maskGraphics.pixels[index + 1] = 0;
        settings.maskGraphics.pixels[index + 2] = 0;
        settings.maskGraphics.pixels[index + 3] = 0;
      }
    }
  }

  settings.maskGraphics.updatePixels();

  if (foundMatchingPixel) {
    // Ensure minX <= maxX and minY <= maxY
    if (minX > maxX || minY > maxY) {
      // No valid bounding box
      return;
    }

    var boxWidth = maxX - minX + 1;
    var boxHeight = maxY - minY + 1;

    // Clear the image graphics
    settings.imageGraphics.clear();

    if (settings.keepProportion) {
      // Preserve aspect ratio
      var imageAspectRatio = settings.image.width / settings.image.height;
      var boxAspectRatio = boxWidth / boxHeight;

      var drawWidth, drawHeight;

      if (imageAspectRatio > boxAspectRatio) {
        // Image is wider than bounding box
        drawHeight = boxHeight;
        drawWidth = boxHeight * imageAspectRatio;
      } else {
        // Image is taller than bounding box
        drawWidth = boxWidth;
        drawHeight = boxWidth / imageAspectRatio;
      }

      // Center the image within the bounding box
      var offsetX = minX + (boxWidth - drawWidth) / 2;
      var offsetY = minY + (boxHeight - drawHeight) / 2;

      // Draw the image into the image graphics
      settings.imageGraphics.image(settings.image, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // Stretch the image to fill the bounding box
      settings.imageGraphics.image(settings.image, minX, minY, boxWidth, boxHeight);
    }

    // Get the masked image
    var maskedImage = settings.imageGraphics.get();
    maskedImage.mask(settings.maskGraphics);

    // Draw the masked image onto the canvas
    image(maskedImage, 0, 0, width, height);
  }
}

// Function to calculate if two colors match based on HSB tolerances
function colorMatchesHSB(c1, c2) {
  // c1 and c2 are arrays [h, s, b]
  var hDiff = abs(c1[0] - c2[0]);
  if (hDiff > 180) {
    hDiff = 360 - hDiff; // Handle circular hue difference
  }
  var sDiff = abs(c1[1] - c2[1]);
  var bDiff = abs(c1[2] - c2[2]);

  if (hDiff <= hueTolerance && sDiff <= saturationTolerance && bDiff <= brightnessTolerance) {
    return true;
  } else {
    return false;
  }
}

// Function to convert RGB to HSB
function rgbToHsb(r, g, b) {
  // Convert RGB to HSB
  var rPrime = r / 255;
  var gPrime = g / 255;
  var bPrime = b / 255;

  var Cmax = max(rPrime, gPrime, bPrime);
  var Cmin = min(rPrime, gPrime, bPrime);
  var delta = Cmax - Cmin;

  var h = 0;
  if (delta == 0) {
    h = 0;
  } else if (Cmax == rPrime) {
    h = 60 * (((gPrime - bPrime) / delta) % 6);
  } else if (Cmax == gPrime) {
    h = 60 * (((bPrime - rPrime) / delta) + 2);
  } else if (Cmax == bPrime) {
    h = 60 * (((rPrime - gPrime) / delta) + 4);
  }

  if (h < 0) {
    h += 360;
  }

  var s = 0;
  if (Cmax == 0) {
    s = 0;
  } else {
    s = (delta / Cmax) * 100; // s ranges from 0 to 100
  }

  var v = Cmax * 255; // v ranges from 0 to 255

  return [h, s, v];
}

// Function to convert hex color code to RGB array
function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace('#', '');
  // Parse the hex color code
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return [r, g, b];
}

// Handle window resize
function windowResized() {
  // This will trigger resize in the draw loop
}
