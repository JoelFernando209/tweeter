import { actualUrl } from '../actualUrl.js';

export const sendEmailVerification = () => {
  firebase.auth().currentUser.sendEmailVerification({
    url: `${actualUrl}/dashboard.html`
  })
  .then(() => {
    document.body.innerHTML = `
      <div class='popup'>
        <span class='heading-2'>We send your verification email.</span>
        <span class='heading-4'>
          Please check it in the email that you signed in.
        </span>
      </div>
    `
  })
  .catch(err => {
    console.log(err.message);
  })
};