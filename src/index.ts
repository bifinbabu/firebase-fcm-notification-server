import express from "express";
import cors from "cors";
// @ts-ignore
// import { Decoder, Stream } from "@garmin-fit/sdk";
import admin from "firebase-admin";
import fcm from "fcm-notification";
// import x from '../src'

// const serviceAccount: typeof import("./firebaseConfig.json") = require("./firebaseConfig.json");
// import * as serviceAccount from "../src/firebaseConfig.json";
const serviceAccount = {
  type: "service_account",
  project_id: "fcmtest-3283a",
  private_key_id: "f795ad6a399038c987a2977fb45e4a041d8a97cd",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkdbOI73JRB/5r\nddh2xZ5Bvt9SUFkkuiZzk60isVjsGlEfFNyT9Ns37N5D+6Dv/wYiLdrF/25eyhgc\ng1DzTYhi+hZ1hyy3ct65PBzv16BIq9eeNnuF591BXmIx1dHfEIlkzHxU7wpUpQME\nSnO6kyoK2fIr4W3/pEvPIP/PmBdtFalPPoQvD6chMADKFxzPEOHQVG4Nv8DbGEg+\napEz3ZVg034CofSpjnMkwLVcXx6oD7UUz65LUt2DX2oXfzXRlZVMPPeZuu0P1rpC\nMfhLTlNU0B3ITsGHaKBsNxMSn/ieZGlLkaTrGULHD7wrfKZPpCchZfKYc23dt5B4\nhUgPtxAzAgMBAAECggEAV9dTsRaUB0kCD3JvyPch6tiHiGBBbkguyaih3OGAtcNG\npqNATplKgr3OFiiVkEGnq5Oi9xdH6iVdUPVCtlH820WaRhUz4dNGhMVywNtREzAT\nhw8evnVQ0rYGHnA+sjxq/3lKYuPIPpR1zPwNdFLqSuLS5QFX6H/U8C6ZfUnW1AdS\npd4m0B1RrUlSwCpFRGi5Y9pnwunV15S26DtjREsRp1oInBRrFaIJIAOnSSuXOh4i\nKFiEMK0rKU3YFXgdZtHxu5iHMIqmRaeoUj5uyLmxYA2RFmyAL8Q1XMQnL6K4PdXN\nYlyECRCjic7+I5R2Ru7CvLH6Vz5y0DHI9QLJIjB3oQKBgQD03BG+wUETyVsxiz3t\nrEF5nyhc/Samx/7zp75L3tbyv8mRccF/UY7LrRcaTi8ylm9M3YaCJ/q5Kienap+S\n8uZZU0bOB08HXrAq4BJrLGqlOswt5tmqK4hUnXs4bmUzJkEs4rlfx18e9XQSlL56\n9/jx734Bjrs9wWTgi8avObenIQKBgQDu2p6Imi/IPd59s6POw0Bmsqep+Y5CXgyC\nbEZohGPxuGSnBOAz5ZPyhirPHmSAuSPkOJRSFhfHd5GbDPqXGda7tJYrRJJ2xjyu\nqjYYM0ogNCVRtcld7ERLC72OZdoq4RP6wNDEuYjuoAKGuKS98AnBAMndTmis4Yzc\n8/m6W15Q0wKBgGMO2Lr0EbDAh/0OGLqbMk3SnpCn9UgJptHJrcmh2BGSlygY/i/U\nvdEWMD97G8r6YwKUqALly5+3Nx2am/3l+FxwvTdCa61OmDRwO+NRr78yf0Gen7Yh\nMGES6LOWrag4tKtE+buOu6OZpyCRPlIfGX4+5hoZNRSxtW7F/VYMIokhAoGBAKHk\nQ/fKqgBLDvacP7bw2EHDbajjoOyS2l+8C6zjruozVOVvhJcoUDLdhT6FFxG4av9Q\n6hcJKmzkOiihj2fC96yaJf6Fp9AhZRft/mRAv0k8jt7nG+kxLsi+2Ggf2NOfYu9e\nqSHtr0Yt5ghyNhcXD0Vlx2zcrE4hQlywcN9C9pZJAoGAfrcAV6D42mRm+cbFAYDd\nWViBaiGz2hmtzCCfz5l8tVIkqFhkCV+R2oK+mcgi1AxHqtdP30bhi+RyBNI/kWlp\nJdaEiUfOsyLtrj5YdvtPoUmpwgQ2Km9XYgCzLqFjQUfsiTJRHeWCQSvKXKJ6ZbfC\nQe03lLwszbwpgzLugwxexnE=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fi0dr@fcmtest-3283a.iam.gserviceaccount.com",
  client_id: "110565526813510710789",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fi0dr%40fcmtest-3283a.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const certpath = admin.credential.cert(serviceAccount as admin.ServiceAccount);

const FCM = new fcm(certpath);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/heartbeat", (req, res) => {
  res.json({
    date: new Date().toUTCString(),
    server: "Adani Marathon Garmin Server",
  });
});

app.post("/fcm", (req, res) => {
  try {
    let message = {
      notification: {
        title: "Test notification",
        body: "Notification body",
      },
      data: {
        orderId: "123456",
        orderDate: "2/5/23",
      },
      token:
        "dA3ljfglTyKBDar0cxqTct:APA91bEMrmbY7VodCtpQp6bbrlDwa0Jimv0kwAkK3DtrzNVyWOtiti7MZ7YElDPRC8l0DA_5oayDqK22hHaQYpmFMl6WjS8uM07AyCyU2rxFvF8rtSzR5ECppIL1v7J6JEq5R0otvWcZ",
    };
    FCM.send(message, function (err: any, resp: any) {
      if (err) {
        res.status(500).json({ message: "Error" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/process-buffer", async (req, res) => {
  //   res.send("Hello, World!");
  console.log("api called");
  try {
    const base64data = req.body.data;
    const buffer = Buffer.from(base64data, "base64"); // Convert the base64 string back to a buffer

    const garminSdk = await import("@garmin-fit/sdk");
    const { Decoder, Stream } = garminSdk;
    const stream = Stream.fromBuffer(buffer);
    const decoder = new Decoder(stream);

    console.log("isFIT (instance method): " + decoder.isFIT());
    console.log("checkIntegrity: " + decoder.checkIntegrity());

    const { messages, errors } = decoder.read({
      mesgListener: (messageNumber: any, message: any) => {
        if (messageNumber === 7) {
          return message;
        }
      },
    });

    const jsonV = JSON.stringify(messages);

    // Send back the jsonV
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error processing the buffer", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
