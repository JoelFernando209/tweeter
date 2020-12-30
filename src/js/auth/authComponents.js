const auth = firebase.auth();

export const updatePhotoURL = ({ photoURL }) => auth.currentUser.updateProfile({
  photoURL
})

export const userVerified = () => {
  const user = auth.currentUser;
  
  if(user && user.emailVerified) {
    return true;
  } else {
    return false;
  }
};

export const getName = () => auth.currentUser.displayName;

export const getUid = () => auth.currentUser.uid;

export const getProfilePhoto = () => {
  if(auth.currentUser.photoURL) {
     return auth.currentUser.photoURL;
  } else {
    return './img/default-profile.jpg';
  }
}