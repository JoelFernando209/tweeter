const storage = firebase.storage();

export const createRef = ({ pathRef, errElement, fileToUpload }) => ({
  ref: storage.ref(pathRef),
  errElement,
  fileToUpload
});

export const createTask = ({ ref, file }) => ref.put(file);

export const imgGetDownloadURL = ({ task }) => {
  if(task.ref_) {
    return task.ref_.getDownloadURL()
  } else {
    return task.ref.getDownloadURL()
  }
};

export const getDownloadPercentage = ({ snapshot }) => (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

export const deleteAllFilesFromFolder = ({ ref, errElement, fileToUpload }) => {
  ref
    .listAll()
    .then(res => {
      if(res.items.length > 0) {
        res.items.forEach(imageRef => {
          imageRef.delete();
        });
      }
    })
    .catch(err => {
      errElement.innerHTML = err.message;
    });
    
  return {
    ref,
    errElement,
    fileToUpload
  }
};

export const uploadNormalImg = ({ endFunc, parentClass }) => ({ ref, errElement, fileToUpload }) => {
  const childRef = ref.child(fileToUpload.name);
  
  const taskImg = createTask({
    ref: childRef,
    file: fileToUpload
  })
  .then(snapshot => {
    endFunc({ url: imgGetDownloadURL({ task: snapshot }), parentClass, errElement, name: fileToUpload.name })
  })
  .catch(err => {
    errElement.innerHTML = err.message;
    console.log(err)
  })
  
  return taskImg;
};

export const uploadProfileImg = ({ loadingElement, endFunc }) => ({ ref, errElement, fileToUpload }) => {
  const photoNameRef = ref.child(fileToUpload.name);
  const taskImg = createTask({
    ref: photoNameRef,
    file: fileToUpload
  });
  
  taskImg.on('state_changed', snapshot => {
      const downloadPercentage = getDownloadPercentage({ snapshot });
      loadingElement.style.height = downloadPercentage+'%';
    },
    err => {
      errElement.innerHTML = err.message;
    },
    endFunc(taskImg)
  )
}