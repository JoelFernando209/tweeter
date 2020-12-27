const compose = (fn1, fn2) => (...args) => fn1(fn2(...args));

const multipleCompose = (...functions) => functions.reduce(compose);

export const createProcess = (functions, params) => () => multipleCompose(
    ...functions
  )(params);

export const validatePw = str => {
  if(str.trim().length >= 5 && str.split('').some(el => Number.isNaN(Number(el)) === false)) {
    return true;
  } else {
    return false;
  }
}

export const setLoadingPage = () => {
  document.querySelectorAll('.loading').forEach(el => el.style.display = 'block');
}

export const removeLoadingPage = () => {
  document.querySelectorAll('.loading').forEach(el => el.style.display = 'none');
}

export const putErrorInForm = (nameClass, errorVal) => {
  document.querySelector(nameClass).innerHTML = errorVal;
}

export const formatName = name => {
  if(name.split(' ').length > 2) {
    return name.split(' ').slice(0, 2).join(' ');
  } else {
    return name;
  }
}

export const hideOnClickOutside = element => {
  const outsideClickListener = event => {
    if (!element.contains(event.target)) {
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      
      removeClickListener()
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}