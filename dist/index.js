"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// @ts-ignore
// import { Decoder, Stream } from "@garmin-fit/sdk";
const app = (0, express_1.default)();
const PORT = 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.get("/heartbeat", (req, res) => {
    res.json({
        date: new Date().toUTCString(),
        server: "Adani Marathon Garmin Server",
    });
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
            mesgListener: (messageNumber, message) => {
                if (messageNumber === 7) {
                    return message;
                }
            },
        });
        const jsonV = JSON.stringify(messages);
        // Send back the jsonV
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error processing the buffer", error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map