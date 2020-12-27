export const setInputLimit = (input, limit) => {
  const inputLimit = input.previousElementSibling;
  
  input.addEventListener('keyup', () => {

    if(input.value.length >= limit) {
      input.value = input.value.split('').slice(0, limit).join('');
    }
    
    if(input.value.length > 0) {
      inputLimit.style.display = 'block'
      inputLimit.innerHTML = `${input.value.length}/${limit}`
    } else {
      inputLimit.style.display = 'none';
    }
  })
}