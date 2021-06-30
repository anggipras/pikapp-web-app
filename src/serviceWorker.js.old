export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then(function (registration) {
          // eslint-disable-next-line no-console
          console.log('[SW]: SCOPE: ', registration.scope);
        //   registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: 'BGkBTD4sOCLTqphQtyVB6EKnX1BdMABWbZV_0r2zONYzmV9T67dsP2fbPcCo11gAAOqiYD5WhezFTKDJAAsZL-M'}).then(function(sub) {
        //     var endpointSections = sub.endpoint.split('/');
        //     var subscriptionId = endpointSections[endpointSections.length - 1];
        //     console.log('endpoint:', subscriptionId);
        //   });
          return registration.scope;
        })
        .catch(function (err) {
          return err;
        });
    }
};