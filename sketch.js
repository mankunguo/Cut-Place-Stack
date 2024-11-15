var video;
var videoReady = false; // Flag to check if video is ready
var colorTolerance = 100; // Adjust this value for color matching sensitivity

// Mapping of rem units to pixel values
var sizeMapping = {
  "0.6rem": 8.5,
  "1rem": 12,
  "2rem": 32,
  "3rem": 48,
  "3.5rem": 56
};

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

  // Get the canvas container dimensions
  var canvasContainer = document.getElementById('canvas-container');
  var canvasWidth = canvasContainer.offsetWidth;
  var canvasHeight = canvasContainer.offsetHeight;

  // Create the canvas and attach it to the canvas container
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container'); // Attach canvas to its container

  // Calculate aspect ratio of the canvas
  var canvasAspectRatio = canvasWidth / canvasHeight;

  // Set video width and calculate height to match canvas aspect ratio
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
  // video.hide(); // Commented out to display the video in its container

  // Initialize text settings
  noStroke(); // No outline for text
  fill(0); // Black text color

  // Add initial control containers
  addControlContainer();
  addControlContainer();

  // Add event listener to the "Add" button
  var addButton = document.getElementById('addButton');
  addButton.addEventListener('click', function() {
    addControlContainer();
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
    fontSize: 12,
    targetColor: [255, 0, 0],
    selectedFont: 'ARIAL',
    textContent: 'Your text here.',
    customFontName: null,
    repeatText: true // Default to true
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
              <a href="#" id="uploadFontLink${index}" style="border-bottom: 1px solid black;">Upload your font</a>
            </div>
          </div>
        </div>
        <div class="sizechoice" style="margin-top:0.8rem;">
          <div>Size</div>
          <div class="dropdown2">
            <button class="dropbtn2" id="sizeButton${index}">Paragraph</button>
            <div class="dropdown-content2">
              <a href="#" data-size="3.5rem">Headline 1</a>
              <a href="#" data-size="3rem">Headline 2</a>
              <a href="#" data-size="2rem">Headline 3</a>
              <a href="#" data-size="1rem">Paragraph</a>
              <a href="#" data-size="0.6rem" style="border-bottom: 1px solid black;">Small</a>
            </div>
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

function removeControlContainer(index) {
  // Remove settings from the array
  settingsArray = settingsArray.filter(item => item.index !== index);

  // Remove the control container from the DOM
  var controlContainer = document.getElementById('controlContainer' + index);
  if (controlContainer) {
    controlContainer.remove();
  }

  // Remove the font uploader input
  var fontUploader = document.getElementById('fontUploader' + index);
  if (fontUploader) {
    fontUploader.remove();
  }
}

function initializeControls(settings, index) {
  // Get the color picker element
  var colorPicker = document.getElementById('colorPicker' + index);

  // Add event listener to update target color when user selects a new color
  colorPicker.addEventListener('input', function() {
    var hexColor = colorPicker.value; // Get the hex color code
    settings.targetColor = hexToRgb(hexColor); // Convert hex to RGB array
  });

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

  // Size dropdown
  var sizeButton = document.getElementById('sizeButton' + index);
  var sizeDropdown = sizeButton.nextElementSibling;
  var sizeDropdownItems = sizeDropdown.querySelectorAll('a');
  sizeDropdownItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default action of the link
      var selectedSize = this.getAttribute('data-size');
      settings.fontSize = sizeMapping[selectedSize];
      // Update the button label to show selected size name
      sizeButton.textContent = this.textContent;
    });
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

  // Render text for each settings object
  settingsArray.forEach(function(item) {
    renderText(item.settings);
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
      y += settings.fontSize; // Move to the next line
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

      // Detect pixels matching the selected color within a tolerance
      var pixelColor = [r, g, b];
      var dist = colorDistance(pixelColor, settings.targetColor);
      if (dist < colorTolerance) {
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
          y += settings.fontSize;
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

// Function to calculate color distance
function colorDistance(c1, c2) {
  // c1 and c2 are arrays [r, g, b]
  var dr = c1[0] - c2[0];
  var dg = c1[1] - c2[1];
  var db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
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
