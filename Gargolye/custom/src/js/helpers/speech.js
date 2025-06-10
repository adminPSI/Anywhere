const SPEECH = (function () {
  let speechConfig;
  let audioConfig;

  // function addSTTSingleShotEvent(btnElement, textField) {
  //   function eventFunction() {
  //     const recognizer = new SpeechSDK.SpeechRecognizer(
  //       speechConfig,
  //       audioConfig,
  //     );
  //     recognizer.recognizeOnceAsync(result => {
  //       btnElement.classList.remove('disabled');
  //       switch (result.reason) {
  //         case SpeechSDK.ResultReason.RecognizedSpeech:
  //           textField.firstElementChild.value += `${result.text} `;
  //           break;
  //         case SpeechSDK.ResultReason.NoMatch:
  //           console.log('NOMATCH: Speech could not be recognized.');
  //           break;
  //         case SpeechSDK.ResultReason.Canceled:
  //           const cancellation = CancellationDetails.fromResult(result);
  //           console.log(`CANCELED: Reason=${cancellation.reason}`);

  //           if (cancellation.reason == CancellationReason.Error) {
  //             console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
  //             console.log(
  //               `CANCELED: ErrorDetails=${cancellation.errorDetails}`,
  //             );
  //             console.log('CANCELED: Did you update the subscription info?');
  //           }
  //           break;
  //       }
  //       recognizer.close();
  //       recognizer = undefined;
  //     });
  //   }
  //   btnElement.addEventListener('click', event => {
  //     btnElement.classList.add('disabled');
  //     eventFunction();
  //   });
  // }

  function addSTTContinuousRecEvent(btnElement, textField) {
    let listening = false;

    const continuousListening = (function () {
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizing = (s, e) => {};

      recognizer.recognized = (s, e) => {
        if (e.result.reason == SpeechSDK.ResultReason.RecognizedSpeech) {
          textField.firstElementChild.value += `${e.result.text} `;
          textField.firstChild.dispatchEvent(new Event('keyup', { bubbles: true }));
          // input event for autosize
          textField.firstChild.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (e.result.reason == SpeechSDK.ResultReason.NoMatch) {
          console.log('NOMATCH: Speech could not be recognized.');
        }
      };

      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);

        if (e.reason == CancellationReason.Error) {
          console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
          console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          console.log('CANCELED: Did you update the subscription info?');
        }
      };

      function start(callback, errorCB) {
        recognizer.startContinuousRecognitionAsync(callback, errorCB);
      }
      function stop(callback, errorCB) {
        recognizer.stopContinuousRecognitionAsync(callback, errorCB);
      }
      function close() {
        recognizer.close();
      }
      return {
        start,
        stop,
        close,
      };
    })();

    btnElement.addEventListener('click', () => {
      listening = !listening;
      if (listening) {
        continuousListening.start(
          () => {
            btnElement.classList.add('stt_listening');
            btnElement.innerHTML = icons.microphoneFilled;
          },
          error => console.log(error),
        );
      } else {
        continuousListening.stop(
          () => {
            btnElement.classList.remove('stt_listening');
            btnElement.innerHTML = icons.microphone;
          },
          error => console.log(error),
        );
      }
    });

    //--------------
    // Mutation Observer for leaving section to disconnect STT API Call
    const observNode = document.getElementById('actioncenter');
    const config = { attributes: true };
    let observer;
    const callback = function (mutationList, observer) {
      for (let mutation of mutationList) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'data-active-section') {
            observer.disconnect();
            continuousListening.close();
          }
        }
      }
    };
    observer = new MutationObserver(callback);
    observer.observe(observNode, config);
    //-------------------
  }

  function init() {
    try {
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription($.session.azureSTTApi, 'eastus');
      speechConfig.speechRecognitionLanguage = 'en-US';
      speechConfig.enableDictation();
      speechConfig.setServiceProperty('punctuation', 'explicit', SpeechSDK.ServicePropertyChannel.UriQueryParameter);//
      audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      return true;
    } catch (error) {
      switch (error.message) {
        case 'throwIfNullOrWhitespace:subscriptionKey':
          alert(
            'Error initalizing Speech to Text. No API Key found, or API Key has been entered incorrectly. Please contact system administrator to add Azure Speech API Key.',
          );
          break;
        default:
          alert(
            'Error initalizing Speech to Text. Please contact system administrator to make sure you have a valid Speech to Text connection.',
          );
          break;
      }
      console.error(error);
      return false;
    }
  }

  return {
    init,
    //addSTTSingleShotEvent,
    addSTTContinuousRecEvent,
  };
})();
