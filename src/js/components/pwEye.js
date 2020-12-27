export const addPwEye = (input, eye) => {
  let eventHandlerEye = false;
  
  return () => {
    eye.addEventListener('click', () => {
      if(eventHandlerEye === false) {
        eventHandlerEye = true;
        
        eye.setAttribute('src', 'img/eye-off.svg');
        input.setAttribute('type', 'text');
      } else {
        eventHandlerEye = false;
        
        eye.setAttribute('src', 'img/eye-on.svg');
        input.setAttribute('type', 'password');
      }
    })
    
    input.addEventListener('keyup', () => {
      if(input.value.length > 0) {
        eye.style.display = 'block';
      } else {
        eye.style.display = 'none';
      }
    })
  }
}