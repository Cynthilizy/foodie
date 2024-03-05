const liveHost = "https://us-central1-projectvic-88bda.cloudfunctions.net";
const localHost =
  "https://bb4c-87-100-134-107.ngrok-free.app/projectvic-88bda/us-central1";

export const IsDevelopment = process.env.NODE_ENV === "development";

export const Host = IsDevelopment ? localHost : liveHost;
