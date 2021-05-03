const hexInput = document.getElementById('hexInput');
const inputColor = document.getElementById('inputColor');
const alteredColor = document.getElementById('alteredColor');
const alteredColorText = document.getElementById('alteredColorText');
const sliderText = document.getElementById('sliderText');
const slider = document.getElementById('slider');
const lightenText = document.getElementById('lightenText');
const darkenText = document.getElementById('darkenText');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  toggleBtn.classList.toggle('toggled');
  darkenText.classList.toggle('unselected');
  lightenText.classList.toggle('unselected');
  resetValues();
})

hexInput.addEventListener('keyup', () => {
  hex = hexInput.value.replace('#', '');
  if(!isValidHexInput(hex)) return;
  inputColor.style.backgroundColor = '#' + hex;
  resetValues();
})

const isValidHexInput = (hex) => {
  if (!hex) return false;
  const strippedHex = hex.replace('#', '');
  return strippedHex.length === 3 || strippedHex.length === 6;
}
// Could also validate hex more. Hex must be characters a-f and 0-9.

const convertHexToRgb = (hex) => {
  if(!isValidHexInput(hex)) return null;

  let strippedHex = hex.replace('#', '');

  if (strippedHex.length === 3) { // if 000 double to 000000
    strippedHex = 
    strippedHex[0] + strippedHex[0]
    + strippedHex[1] + strippedHex[1]
    + strippedHex[2] + strippedHex[2]
  }
  const r  = parseInt(strippedHex.substring(0,2), 16); // convert a hex value to a decimal value
  const g  = parseInt(strippedHex.substring(2,4), 16);
  const b  = parseInt(strippedHex.substring(4,6), 16);
  return {r, g, b};
}

//For each (r,g,b) - create a hex pair that is two characters long.
// About the base 16 / radix thing in toString. Regarding hexadecimal see: https://en.wikipedia.org/wiki/Hexadecimal And regarding radix, see: https://www.oreilly.com/library/view/actionscript-the-definitive/1565928520/re180.html
const convertRGBToHex = (r,g,b) => {
  const pair1 = ('0' + r.toString(16)).slice(-2); // add 0, slice the last two from the end.
  const pair2 = ('0' + g.toString(16)).slice(-2); 
  const pair3 = ('0' + b.toString(16)).slice(-2);
  const hex = '#' + pair1 + pair2 + pair3;
  return hex
}

const ensureColorInRange = (hex, amount) => {
  return Math.min(255, Math.max(0, hex + amount));
}

//Convert hex to rgb. Increase each r,g,b value by appropriate amount (percentage of 255). Use the new r, g, b values to convert to a hex value & return hex
const alterColor = (hex, percentage) => {
 const {r, g, b} = convertHexToRgb(hex);
 const amount = Math.floor((percentage/100) * 255); // gets an integer between 0 and 255
 const newR = ensureColorInRange(r ,amount);
 const newG = ensureColorInRange(g ,amount);
 const newB = ensureColorInRange(b ,amount);
 return convertRGBToHex(newR, newG, newB);
}

//Istead of passing in slider.value, determine whether slider.value should be positive or negative, depending on if toggleBtn has class of toggled.
slider.addEventListener('input', () => {
  if(!isValidHexInput(hexInput.value)) return;
  sliderText.innerHTML = `${slider.value}%`;
  const adjustedSliderValue = toggleBtn.classList.contains('toggled') ? -slider.value : slider.value;
  const alteredHex = alterColor(hexInput.value, adjustedSliderValue);
  alteredColor.style.backgroundColor = alteredHex;
  alteredColorText.innerHTML = `Altered color ${alteredHex}`;
})

const resetValues = () => {
  slider.value = 0;
  sliderText.innerHTML = '0%';
  alteredColorText.innerHTML = `Altered Color ${hexInput.value}`;
  alteredColor.style.backgroundColor = hexInput.value;
}