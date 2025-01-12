let currentUtterance = null;

function textToSpeech(text, onEndCallback) {
  if ('speechSynthesis' in window) {

    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(text);
    
   
    currentUtterance.onend = () => {
      onEndCallback();
      currentUtterance = null;
    };

    window.speechSynthesis.speak(currentUtterance);
  } else {
    console.error('Text-to-Speech is not supported in this browser.');
  }
}

export default textToSpeech;
