const liveHost = "https://us-central1-projectvic-88bda.cloudfunctions.net";
const localHost =
  "https://80d6-2001-14ba-606f-e00-c3c-33f3-2b17-89c8.ngrok-free.app/projectvic-88bda/us-central1";

export const IsDevelopment = process.env.NODE_ENV === "development";

export const Host = IsDevelopment ? localHost : liveHost;
