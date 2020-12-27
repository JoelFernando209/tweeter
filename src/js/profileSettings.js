import { formatName, hideOnClickOutside, putErrorInForm } from './general/generalFunc.js';
import { addPwEye } from './components/pwEye.js';
import { setInputLimit } from './components/setInputLimit.js';
import { actualUrl } from './actualUrl.js';

const headerParentProfile = document.querySelector('.header__profile');

const infoProfile = document.querySelector('.infoProfile');
const changeProfile = document.querySelector('.changeProfile');

const profileMenu = document.querySelector('.profile__menu')

const headerProfile = document.querySelector('.header__img-profile');
const headerName = document.querySelector('.header__name');
const headerArrow = document.querySelector('.header__arrow');

const infoProfileEdit = document.querySelector('.infoProfile__edit');
const infoProfilePhoto = document.querySelector('.infoProfile__photo');
const infoProfileName = document.querySelector('.infoProfile__value--name');
const infoProfileEmail = document.querySelector('.infoProfile__value--email');
const infoProfileBio = document.querySelector('.infoProfile__value--bio');
const infoProfilePhone = document.querySelector('.infoProfile__value--phone');

const changeProfileGoBack = document.querySelector('.changeProfile__go-back');

const changeProfilePhoto = document.querySelector('.changeProfile__photo-img');
const changeProfilePhotoBtn = document.querySelector('.changeProfile__photo-btn');
const changeProfilePhotoLoading = document.querySelector('.changeProfile__photo-loading');

const changeProfileBanner = document.querySelector('.changeProfile__banner-img');
const changeProfileBannerBtn = document.querySelector('.changeProfile__banner-btn');
const changeProfileBannerLoading = document.querySelector('.changeProfile__banner-loading');

const changeProfileInputName = document.querySelector('.changeProfile__input--name');
const changeProfileTextArea = document.querySelector('.changeProfile__textarea');
const changeProfileInputPhone = document.querySelector('.changeProfile__input--phone');
const changeProfileDeleteAccountBtn = document.querySelector('.changeProfile__deleteAccount');

const changeProfileForm = document.querySelector('.changeProfile__form');
const changeProfileErr = document.querySelector('.changeProfile__err');

const windowPopup = document.querySelector('.windowPopup');
const windowPopupSubmit = document.querySelector('.windowPopup__submit');
const windowPopupName = document.querySelector('.windowPopup__input--name')

const signOutMenu = document.querySelector('.menu__item--sign-out');

let wasSignedIn = false; // To show other message when signed out and dont to require that needs to be authneticated.
let didDeleteAccount = false;

firebase.auth().onAuthStateChanged(user => {
  if(user && user.emailVerified) {
    headerName.innerHTML = formatName(user.displayName);

    if(user.photoURL) {
      headerProfile.setAttribute('src', user.photoURL);
      infoProfilePhoto.setAttribute('src', user.photoURL);
    } else {
      headerProfile.setAttribute('src', 'img/default-profile.jpg')
    }
    
    document.querySelector('.windowPopup__warning').innerHTML = `Think carefully before doing this (very bad things happen if you dont read this). All your data without exception is going to be deleted forever with no recuperation and we cannot help you to get your data back! Please enter your name <b>(${user.displayName})</b> to confirm you want to delete your account.`
    
    infoProfileName.innerHTML = user.displayName;
    infoProfileEmail.innerHTML = user.email;
    
    firebase.firestore().collection('userData').doc(user.uid).get().then(doc => {
      if(doc.exists) {
        infoProfileBio.innerHTML = doc.data().bio;
        infoProfilePhone.innerHTML = doc.data().phone;
      } else {
        infoProfileBio.innerHTML = 'Not defined';
        infoProfilePhone.innerHTML = 'Not defined';
      }
    })
    
  } else {
    if(wasSignedIn === true) {
      document.querySelector('.body').innerHTML = `
        <div class='popup'>
          <span class='heading-2'>You have signed out correctly.</span>
          <span class='heading-4'>
            Do you want to <a href='http://localhost:8080'>sign in</a> again?
          </span>
        </div>
      `
    } else if(didDeleteAccount === true) {
      document.querySelector('.body').innerHTML = `
        <div class='popup'>
          <span class='heading-2'>Your account has been deleted.</span>
          <span class='heading-4'>
            Hope we see you again :(
          </span>
        </div>
      `
    } else {
      document.querySelector('.body').innerHTML = `
        <div class='popup'>
          <span class='heading-2'>You need to be authenticated to perform this action.</span>
          <span class='heading-4'>
            Maybe you can <a href='http://localhost:8080'>sign in</a> or check the verification email to start knowing the news of all the world!
          </span>
        </div>
      `
    }
  }
})

const profileMenuHandler = () => {
  let eventHandler = false
  
  return () => {
    if(eventHandler === false) {
      eventHandler = true;
      
      profileMenu.style.display = 'flex';
      headerArrow.style.transform = 'rotate(-90deg) translateY(-.5rem)';
    } else {
      eventHandler = false;
      
      profileMenu.style.display = 'none';
      headerArrow.style.transform = 'rotate(90deg)';
    }
  }
}

const headerParentProfileEvent = profileMenuHandler();

headerParentProfile.addEventListener('click', headerParentProfileEvent);

signOutMenu.addEventListener('click', () => {
  firebase.auth().signOut()
  .then(() => wasSignedIn = true)
  .catch(err => console.log(err.message));
})

// Change views.

const setDefaultValueToInput = () => {
  const user = firebase.auth().currentUser;
  
  const docRef = firebase.firestore().collection('userData').doc(user.uid);
  
  changeProfileInputName.value = user.displayName;
  
  if(user.photoURL) {
    changeProfilePhoto.setAttribute('src', user.photoURL);
  }
  
  docRef
    .get()
    .then(doc => {
      if(doc.exists) {
        changeProfileTextArea.value = doc.data().bio;
        changeProfileInputPhone.value = doc.data().phone;
        
        if('bannerUrl' in doc.data()) {
          changeProfileBanner.setAttribute('src', doc.data().bannerUrl)
        }
        
      } else {
        return;
      }
    })
}

infoProfileEdit.addEventListener('click', () => {
  infoProfile.style.display = 'none';
  changeProfile.style.display = 'flex';
  setDefaultValueToInput();
})


changeProfileGoBack.addEventListener('click', () => {
  infoProfile.style.display = 'flex';
  changeProfile.style.display = 'none';
})

// Set input limit text on input bio and name

setInputLimit(changeProfileTextArea, 200);
setInputLimit(changeProfileInputName, 50);

// Set events

const uploadProfilePhoto = (file, nameParent, uid, loading, endFunc) => {
  const photoRef = firebase.storage().ref(`${nameParent}/${uid}`);
  
  // Ensure that the folder is empty and remove all the files in it.
  
  photoRef
    .listAll()
    .then(res => {
      if(res.items.length > 0) {
        res.items.forEach(imageRef => {
          imageRef.delete();
        })
      }
    })
    .catch(err => {
      changeProfileErr.innerHTML = err.message;
    })
    
  const photoNameRef = photoRef.child(file.name);
  const taskImg = photoNameRef.put(file);
  
  taskImg.on('state_changed', snapshot => {
    const downloadPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    loading.style.height = downloadPercentage+'%';
  },
  err => {
    changeProfileErr.innerHTML = err.message;
  },
  endFunc(taskImg)
  )
}

changeProfilePhotoBtn.addEventListener('change', e => {
  const user = firebase.auth().currentUser;
  
  const fileToUpload = e.target.files[0];
  
  uploadProfilePhoto(fileToUpload, 'profilePhoto', user.uid, changeProfilePhotoLoading, taskImg => () => {
    taskImg.snapshot.ref.getDownloadURL()
      .then(url => {
        firebase.auth().currentUser.updateProfile({
          photoURL: url
        })
        .catch(err => {
          changeProfileErr.innerHTML = err.message;
        })
        
        changeProfilePhoto.setAttribute('src', url);
        headerProfile.setAttribute('src', url)
        
        changeProfilePhotoLoading.style.height = '0';
      })
      .catch(err => {
        changeProfileErr.innerHTML = err.message;
      })
  });
})

changeProfileBannerBtn.addEventListener('change', e => {
  const user = firebase.auth().currentUser;
  
  const fileToUpload = e.target.files[0];
  
  uploadProfilePhoto(fileToUpload, 'profileBanner', user.uid, changeProfileBannerLoading, taskImg => () => {
    taskImg.snapshot.ref.getDownloadURL()
      .then(url => {
        firebase.firestore().collection('userData').doc(user.uid).set({
          bannerUrl: url
        },
        { merge: true })
        
        changeProfileBanner.setAttribute('src', url);
        
        changeProfileBannerLoading.style.height = '0';
      })
      .catch(err => {
        changeProfileErr.innerHTML = err.message;
      })
  })
})

changeProfileForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const user = firebase.auth().currentUser;
  
  const nameValue = changeProfileInputName.value.trim();
  const bioValue = changeProfileTextArea.value;
  const phoneValue = changeProfileInputPhone.value.replace(/ /g, '');

  if(nameValue.length > 0 && nameValue.length <= 50) {
    changeProfileErr.innerHTML = '';
    
    user.updateProfile({
      displayName: nameValue
    })
    .then(() => {
      headerName.innerHTML = user.displayName;
    })
    .catch(err => {
      changeProfileErr.style.color = 'red';
      changeProfileErr.innerHTML = err.message;
    })
  } else {
    changeProfileErr.innerHTML = 'Please put a valid name.';
    return;
  }
  
  firebase.firestore().collection('userData').doc(user.uid).set({
    bio: bioValue,
    phone: phoneValue,
    uid: user.uid
  }, { merge: true })
  .then(() => {
    changeProfileErr.style.color = 'green';
    changeProfileErr.innerHTML = 'Your account has been updated succesfully.';
  })
  .catch(err => {
    changeProfileErr.style.color = 'red';
    changeProfileErr.innerHTML = err.message;
  })
})

// Make when popup is clicked outside it disappears the popup

changeProfileDeleteAccountBtn.addEventListener('click', () => {
  windowPopup.style.opacity = '1';
  windowPopup.style.visibility = 'visible';

  setTimeout(() => hideOnClickOutside(windowPopup), 0)
})

windowPopupSubmit.addEventListener('click', event => {
  event.preventDefault();
  
  const user = firebase.auth().currentUser;
  const nameVal = windowPopupName.value;
  
  if(nameVal === user.displayName) {
    didDeleteAccount = true;
    
    firebase.firestore().collection('userData').doc(user.uid).delete();
    
    firebase.storage().ref(`profilePhoto/${user.uid}`).delete();
    firebase.storage().ref(`profileBanner/${user.uid}`).delete();
    
    user.delete()
    .then(() => {
      firebase.auth().signOut();
    })
    .catch(err => {
      putErrorInForm('.windowPopup__err', err.message);
    })
    
  } else {
    putErrorInForm('.windowPopup__err', "The name doesn't match");
  }
})