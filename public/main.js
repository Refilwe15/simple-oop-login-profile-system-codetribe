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
