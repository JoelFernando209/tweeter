export const bytesToMB = (sizeInBytes) => (sizeInBytes / (1024*1024)).toFixed(2);

export const formatHashtag = text => {
  const newText = text.split(' ').map(word => {
    if(word.charAt(0) === '#') {
      return `<span class='hashtag'>${word}</span>`;
    }
    
    return word;
  })
  
  return newText.join(' ');
}