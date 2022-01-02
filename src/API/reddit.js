import React, { Component } from "react";
import { idAppReddit as idApp, uriAppReddit as uriApp } from "../../app.json";
import { authorize, refresh } from "react-native-app-auth";
import { Buffer } from "buffer";

const config = {
  redirectUrl: uriApp,
  clientId: idApp,
  clientSecret: "", // empty string - needed for iOS
  scopes: ["identity", "subscribe", "read", "vote", "account"],
  serviceConfiguration: {
    authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
    tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
  },
  customHeaders: {
    token: {
      Authorization: `Basic ${Buffer.from(idApp).toString("base64")}`,
    },
  },
};

const API_BASE_URL = "https://oauth.reddit.com";

export class apiReddit {
  constructor() {
    this.connected = false;
  }

  async requestApi(type, url) {
    const rawResponse = await fetch(API_BASE_URL + url, {
      method: type,
      headers: {
        "user-agent":
          "cross-platform:com.awesomeproject:v1.0.0 (by /u/syamieee)",
        Authorization: `bearer ${this.authState.accessToken}`,
      },
    });
    return rawResponse;
  }

  async requestPatchApi(url, toPatch) {
    await fetch(API_BASE_URL + url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "user-agent":
          "cross-platform:com.awesomeproject:v1.0.0 (by /u/syamieee)",
        Authorization: `bearer ${this.authState.accessToken}`,
      },
      body: toPatch,
    });
  }

  checkConnected() {
    return this.connected;
  }

  async connectUser() {
    try {
      this.authState = await authorize(config);
      this.connected = true;
    } catch (e) {
      console.log(e);
    }
  }
}
