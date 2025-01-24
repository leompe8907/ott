import { hex_md5 } from "./md5";
import GetUdid from "./Udid";

export let CV = {
  baseUrl: "https://pmdw-1.in.tv.br/",
  mode: "json",
  jsonpTimeout: 5000,
  sessionId: null,

  async init(options) {
    this.baseUrl = options.baseUrl || this.baseUrl;
    this.mode = ["json", "jsonp"].includes(options.mode) ? options.mode : "json";
    this.jsonpTimeout = options.jsonpTimeout || this.jsonpTimeout;

    this.username = options.username;
    this.password = options.password;
    this.apiToken = options.apiToken;

    // Hash password if not already hashed
    const salt = "_panaccess";
    if (!/^[0-9a-f]{32}$/.test(this.password)) {
      this.password = hex_md5(this.password + salt);
    }

    // Perform login
    try {
      await this.login(this.apiToken, this.username, this.password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async call(funcName, parameters = {}) {
    const url = `${this.baseUrl}?f=${funcName}&requestMode=function`;

    if (this.sessionId && funcName !== "login") {
      parameters.sessionId = this.sessionId;
    }

    if (this.mode === "jsonp") {
      return this.callJsonp(url, parameters);
    } else {
      return this.callJson(url, parameters);
    }
  },

  async callJson(url, parameters) {
    const paramString = this.serialize(parameters);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paramString,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errorMessage || "Unknown error");
    }

    return result.answer;
  },

  callJsonp(url, parameters) {
    return new Promise((resolve, reject) => {
      const callbackName = `CVJSONP${Date.now()}`;
      const timeout = setTimeout(() => {
        delete window[callbackName];
        reject(new Error("Request timed out"));
      }, this.jsonpTimeout);

      window[callbackName] = (result) => {
        clearTimeout(timeout);
        delete window[callbackName];

        if (result.success) {
          resolve(result.answer);
        } else {
          reject(new Error(result.errorMessage || "Unknown error"));
        }
      };

      parameters.jsonp = `window.${callbackName}`;
      const paramString = this.serialize(parameters);
      const script = document.createElement("script");
      script.src = `${url}&${paramString}`;
      document.head.appendChild(script);
      document.head.removeChild(script);
    });
  },

  serialize(obj) {
    return Object.entries(obj)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join("&");
  },

  async login(apiToken, username, password) {
    try {
      const result = await this.call("clientLogin", {
        apiToken,
        username,
        password,
        udid: GetUdid(),
      });
      this.sessionId = result;
      localStorage.setItem("cvSessionId", this.sessionId);
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  logout() {
    localStorage.removeItem("cvSessionId");
    this.sessionId = null;
  },
};
