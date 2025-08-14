

// this part is for sign-up (signup.html)

const signUp = document.getElementById("sign-up")
// checks if the form really exists
if(signUp){
    signUp.addEventListener("submit", async(e) => {
        e.preventDefault(); 

        const name = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const result = await auth.signup(name,email,password);

        if(result.ok){
            alert("Account Successfully Created"); 

            //redirect

            setTimeout(() => (window.location.href = "../index.html"), 800);
        }else{
            alert("Account Not Created !!!");
        }
    });
}

// this part is for the sign-in (index.html)

const signIn = document.getElementById("sign-in");

if(signIn){
    signIn.addEventListener("submit",async(e) => {
        e.preventDefault();

        const name = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const result = await auth.login(name,password);

        if(result.ok){
            window.location.href="profile.html";
        }else{
            alert("Login Failed !!!!")
        }
    });
}

//  Profile.html logic

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){
    logoutBtn.addEventListener("click" , async () => {
        await auth.logout();

        window.location.href = "index.html"
    });

    (async () => {
        const result = await auth.getProfile();
        if(!result || result.ok)
            return ;

        const user = result.user;

        document.getElementById("username").textContent= user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("time").textContent = user.time;
        document.getElementById("isLogged").textContent = user.isLogged ? "true" : "false";

    })();
}

//Author Class 
class UserAuth {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  async signup(username, email, password) {
    const res = await fetch(`${this.baseUrl}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  }

  async login(username, password) {
    const res = await fetch(`${this.baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  }

  async logout() {
    const res = await fetch(`${this.baseUrl}/api/logout`, { method: "POST" });
    return res.json();
  }

  async getProfile() {
    const res = await fetch(`${this.baseUrl}/api/profile`);
    if (res.status === 401) {
      window.location.href = "index.html";
      return;
    }
    return res.json();
  }
}

const auth = new UserAuth();
