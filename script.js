let colorDivs = document.querySelectorAll(".maindiv>div");
let generateBtn = document.querySelectorAll("generatebtn");
let sliders = document.querySelectorAll('input[type="range"]');
let currentHex = document.querySelectorAll(".colorHex");
let multcontrols = document.querySelectorAll(".controlbtns>button>i");
let copySpace = document.querySelector('#copiedHex');
let popup = document.querySelector(".copy-container");
let openSlider = document.querySelectorAll(".controlbtns button:nth-child(1)");
let lockColor = document.querySelectorAll(".controlbtns button:nth-child(2)");
let sliderContainer = document.querySelectorAll(".sliders");
let sliderCloseBtn = document.querySelectorAll(".closebtn");
let initialColors;
let savedPalette = [];

//AddEventListener
sliders.forEach(slide => {
    slide.addEventListener('input', hslControls);
})
colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateTextUI(index);
    })
})
currentHex.forEach((hex) => {
  hex.addEventListener("click", () => {
    copySpace.value = hex.innerText;
    copySpace.select();
    navigator.clipboard.writeText(copySpace.value)
    popup.classList.remove('hidden')
    setTimeout(function () {
      popup.classList.add("hidden");
    }, 1000)
  });
});
openSlider.forEach((slide, index)=> {
  slide.addEventListener('click', () => {
    openSliderPanel(index);
  })
})
sliderCloseBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeSliderPanel(index);
  });
})
lockColor.forEach((lockbtn, index) => {
  lockbtn.addEventListener('click', () => {
    // lockbtn.querySelector('i').classList.toggle('fa-lock-open')
    if (lockbtn.querySelector('i').classList.contains('fa-lock-open') == true) {
      lockbtn.querySelector('i').classList.remove('fa-lock-open')
      lockbtn.querySelector('i').classList.add('fa-lock')
      colorDivs[index].classList.add('locked')
    } else {
      lockbtn.querySelector('i').classList.remove('fa-lock')
      lockbtn.querySelector('i').classList.add('fa-lock-open')
      colorDivs[index].classList.remove('locked')
    }
  })
})

// Functions
function generateHex(){
    // const letters = '#123456789ABCDEF';
    // let hash = '#';
    // for (let i = 0; i < 6; i++){
    //     hash += letters[Math.floor(Math.random() * 16)];
    // }
    const hash = chroma.random();
    return hash;

}

function randomColors() {
    initialColors = [];
    colorDivs.forEach((div, index) => {
      const hexCode = div.children[0];
      const controls = div.childNodes[3];
      const randomColor = generateHex();

      if (div.classList.contains('locked') == true) {
        initialColors.push(hexCode.innerText);
        return;
      } else {
        initialColors.push(chroma(randomColor).hex());
      }

      
      div.style.backgroundColor = randomColor;
      hexCode.innerText = chroma(randomColor).hex();

      
      // if (div.classList.contains('locked')) {
      //   initialColors.push(hexCode.innerText);
      //   return;
      // } else {
        // }
        

      checkTextContrast(randomColor, hexCode, controls);

      let sliders = div.querySelectorAll(".sliders>div>input");
      let color = chroma(randomColor);
      let hue = sliders[0];
      let brightness = sliders[1];
      let saturation = sliders[2];

      sliderColorPallete(color, hue, brightness, saturation);
    })
  resetSlider();
}

function sliderColorPallete(color, hue, brightness, saturation) {
    let noSaturation = color.set('hsl.s', 0);
    let fullSaturation = color.set('hsl.s', 1);
    let midBright = color.set('hsl.l', 0.5);
    const scaleSat = chroma.scale([noSaturation, color, fullSaturation])
    const scaleBright = chroma.scale(["black", midBright, "white"]);

    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
    // console.log(hex.innerText);
}

function checkTextContrast(color, text, controls) {
    const luminence = chroma(color).luminance();
    if (luminence > 0.6) {
        text.style.color = "black"
        if (typeof controls == "object") return (controls.style.color = "black");
    } else {
        text.style.color = "white"
        if (typeof controls == "object") return (controls.style.color = "white");
    }
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");

  let slide = e.target.parentElement.parentElement.querySelectorAll('input[type="range"]');
  const hue = slide[0];
  const brightness = slide[1];
  const saturation = slide[2];

  // const bgColor = colorDivs[index].querySelector('h2').innerText;
  const bgColor = initialColors[index];
  // console.log(initialColors);
  // console.log(index);

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  // console.log(saturation);

  colorDivs[index].style.backgroundColor = color;

  sliderColorPallete(color, hue, brightness, saturation)
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector('h2');
  const icons = activeDiv.querySelectorAll('.controlbtns>button');
  hexText.innerText = color.hex();
    console.log(hexText);
    checkTextContrast(color, hexText, 0);
    for (icon of icons) {
      checkTextContrast(color, icons)
  }
}

function resetSlider() {
    sliders.forEach(slide => {
      if (slide.name === 'hue') {
        const hueColor = initialColors[slide.getAttribute("data-hue")];
        const hueValue = chroma(hueColor).hsl()[0];
        slide.value = Math.floor(hueValue)
      }
      if (slide.name === "saturation") {
        const satColor = initialColors[slide.getAttribute("data-sat")];
        const satValue = chroma(satColor).hsl()[1];
        slide.value = satValue.toFixed(2);
      }
      if (slide.name === 'brightness') {
        const brightColor = initialColors[slide.getAttribute("data-bright")];
        const brightValue = chroma(brightColor).hsl()[2];
        slide.value = Math.floor(brightValue * 100) / 100;
      }
    })
}

function openSliderPanel(index) {
  sliderContainer[index].classList.toggle('hidden');
  sliderContainer[index].classList.toggle("sliderupTransition");
}

function closeSliderPanel(index) {
  sliderContainer[index].classList.add("hidden");
  sliderContainer[index].classList.toggle("sliderupTransition");
}

document.querySelector("#generatebtn").addEventListener('click', () => {
    randomColors();
})

//Save to LocalStorage Palette
let saveBtn = document.querySelector(".save");
let submitSave = document.querySelector(".submit-save");
let closeSave = document.querySelector(".close-save");
let saveContainer = document.querySelector(".save-container");
let saveInput = document.querySelector('[name="save-name"]');

let libraryBtn = document.querySelector(".libraryBtn");
let libraryContainer = document.querySelector(".library-container");
let Closelibrary = document.querySelector(".close-library");


saveBtn.addEventListener('click', openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openCloseLibrary);
Closelibrary.addEventListener("click", openCloseLibrary);

function openPalette(e) {
  let popup = saveContainer.children[0];
  saveContainer.classList.remove("hidden");
  popup.classList.remove("hidden")
}

function closePalette(e) {
  let popup = saveContainer.children[0];
  saveContainer.classList.add("hidden");
}

function openCloseLibrary(e) {
  libraryContainer.classList.toggle("hidden")
}

function savePalette(e) {
  saveContainer.classList.add("hidden");
  const name = saveInput.value;
  const colors = [];
  currentHex.forEach(hex => {
    colors.push(hex.innerText)
  });
  let PaletteNr = savedPalette.length;
  const PaletteObj = { name, colors, nr: PaletteNr };
  savedPalette.push(PaletteObj);
  saveToLocal(savedPalette)
  saveInput.value = '';

  //Generate palette
  const palette = document.createElement("div");
  palette.classList.add('custom-palette');
  const title = document.createElement("h4");
  title.innerText = PaletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  PaletteObj.colors.forEach(smallColor => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv)
  })

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("library-btn-group")

  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(PaletteObj.nr);
  paletteBtn.innerText = "Select";

  const paletteimg = document.createElement("img");
  paletteimg.src = "https://cdn-icons-png.flaticon.com/512/2413/2413446.png";

  paletteBtn.addEventListener('click', e => {
    openCloseLibrary();
    const PaletteIndex = e.target.classList[1];
    initialColors = [];
    savedPalette[PaletteIndex].colors.forEach((color, index) => {
      initialColors.push(color)
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkTextContrast(color, text)
    })
    libraryInputUpdate();
    resetSlider();
  })
  
  palette.appendChild(title);
  palette.appendChild(preview);
  buttonDiv.appendChild(paletteimg);
  buttonDiv.appendChild(paletteBtn);
  palette.appendChild(buttonDiv);
  libraryContainer.children[0].appendChild(palette);
  

}

function saveToLocal(PaletteObj) {
  let localPalette;
  if (localStorage.getItem("palettes") == null) {
    localPalette = [];
  } else {
    localPalette = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalette.push(PaletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalette))
}

function getLocalStorage() {
  if (localStorage.getItem("palettes") == null) {
    localStorage = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    paletteObjects.forEach(PaletteObj => {
      // console.log(PaletteObj[0])
      //Generate palette
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = PaletteObj[0].name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      let pal = PaletteObj[0];
      console.log(PaletteObj);
      // pal.forEach(smallColor => {
        // });
      pal.colors.forEach((smallColor) => {
          // console.log(smallColor);
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });

      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("library-btn-group");

      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(PaletteObj[0].nr);
      paletteBtn.innerText = "Select";

      const paletteimg = document.createElement("img");
      paletteimg.src = "https://cdn-icons-png.flaticon.com/512/2413/2413446.png";

      paletteBtn.addEventListener("click", (e) => {
        openCloseLibrary();
        const PaletteIndex = e.target.classList[1];
        initialColors = [];
        PaletteObj[0].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextContrast(color, text);
        });
        // console.log(PaletteObj[0].colors);
        // libraryInputUpdate();
        resetSlider();
      });

      palette.appendChild(title);
      palette.appendChild(preview);
      buttonDiv.appendChild(paletteimg);
      buttonDiv.appendChild(paletteBtn);
      palette.appendChild(buttonDiv);
      libraryContainer.children[0].appendChild(palette);
      // console.log(PaletteObj)
    })
  }
}

getLocalStorage();
randomColors();