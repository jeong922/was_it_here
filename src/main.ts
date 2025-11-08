import App from "./app.ts";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")! as HTMLElement;

new App(app);
