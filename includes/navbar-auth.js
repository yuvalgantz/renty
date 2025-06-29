window.addEventListener("load", () => {
  function logoutUser() {
    localStorage.setItem("didLogout", "true");
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = "logout.html";
      })
      .catch((error) => {
        console.error("שגיאה בהתנתקות:", error);
        alert("אירעה שגיאה בעת ההתנתקות.");
      });
  }

  const firebaseConfig = {
    apiKey: "AIzaSyAKphZ1LcyjY3fyMYtMUNTL_u5MHIQACbo",
    authDomain: "renty-final.firebaseapp.com",
    projectId: "renty-final",
    storageBucket: "renty-final.firebasestorage.app",
    messagingSenderId: "897210047726",
    appId: "1:897210047726:web:39d8a0361054091db7e7ff",
  };

  console.log("firebase config!");

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    const navbar = document.querySelector(".navbar-nav");
    navbar.innerHTML = ""; // רוקן את התפריט

    if (user) {
      // משוך שם פרטי מה-Firestore
      const doc = await db.collection("users").doc(user.uid).get();
      const firstName = doc.exists ? doc.data().firstName : "משתמש";

      // הוסף ברכה
      const greeting = document.createElement("li");
      greeting.className = "nav-item";
      greeting.innerHTML = `<span class="nav-link text-white">שלום ${firstName}</span>`;
      navbar.appendChild(greeting);

      // תפריט למשתמש מחובר
      navbar.innerHTML += `
        <li class="nav-item"><a class="nav-link text-white" href="index.html">דף הבית</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="Categories.html">קטגוריות</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="AboutUs.html">אודות</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="userArea.html">אזור אישי</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="addNewItemRent.html">העלאת מוצר</a></li>
        <li class="nav-item"><a id="logout-link" class="nav-link text-white" href="#"">התנתקות</a></li>
      `;

      const logoutLink = document.getElementById("logout-link");
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          logoutUser();
        });
      }
    } else {
      // תפריט רגיל למי שלא מחובר
      navbar.innerHTML += `
        <li class="nav-item"><a class="nav-link text-white" href="index.html">דף הבית</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="Categories.html">קטגוריות</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="AboutUs.html">אודות</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="login.html">הרשמה</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="EntryExisting.html">התחברות</a></li>
      `;
    }
  });
});
