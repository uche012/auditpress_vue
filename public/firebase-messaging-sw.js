importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');
let firebaseConfig = {
  apiKey: "AIzaSyAFmH_mAcOrGUrhThivylIl_SHXUezsVqM",
  authDomain: "auditpress-d212b.firebaseapp.com",
  projectId: "auditpress-d212b",
  storageBucket: "auditpress-d212b.appspot.com",
  messagingSenderId: "284830685493",
  appId: "1:284830685493:web:a31bf80a37256ed723547c",
  measurementId: "G-1TF765J3KB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ACTIVATION
self.addEventListener('activate', () => {
  console.log('Service worker activated');
});

// CLICK HANDLER
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const redirectionUrl = event.notification.data['click_action'];
  if (redirectionUrl !== undefined) {
    event.waitUntil(
      clients.openWindow(redirectionUrl)
    );
  }
});

// NOTIFICATION HANDLER
self.addEventListener('push', event => {
  const data = event.data.json();
  const notificationData = data?.data ? data.data : data.notification
  const title = notificationData?.title || 'Notification';
  const options = {
    body: notificationData.body || 'New notification received',
    icon: notificationData.icon || './logo.png',
    data: notificationData,
    image: notificationData.image || 'image',
    sound: "default"
  };
  event.waitUntil(self.registration.showNotification(title, options));
})