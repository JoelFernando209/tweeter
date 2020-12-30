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

export const formatDateTweet = ({ date }) => {
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
  const hour = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(date).split(' ')[0];
  const minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(date);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  
  return `${day} ${month} at ${hour}:${minute} ${year}`;
};

export const hideOnClickOutside = elemesnt => {
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