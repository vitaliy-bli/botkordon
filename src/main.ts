import "./style.css";
import { renderNav } from "./sections/nav";
import { renderHero } from "./sections/hero";
import { renderProblem } from "./sections/problem";
import { renderShowcase } from "./sections/showcase";
import { renderMarket } from "./sections/market";
import { renderBenefits } from "./sections/benefits";
import { renderDealPack } from "./sections/dealpack";
import { renderNextSteps } from "./sections/nextsteps";
import { renderFooter } from "./sections/footer";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = [
  renderNav(),
  renderHero(),
  renderProblem(),
  renderShowcase(),
  renderMarket(),
  renderBenefits(),
  renderDealPack(),
  renderNextSteps(),
  renderFooter(),
].join("");
