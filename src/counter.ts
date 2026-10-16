export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

class shieldDataManager {
  public currentShield: number;
  public maxShield: number;
  private missingShield: number;

  constructor() {
    this.currentShield = 0;
    this.maxShield = 10;
    this.missingShield = 10;
  }

  public getMissingShield(): number {
    this.missingShield = this.maxShield - this.currentShield;
    return this.missingShield;
  }

  public setCurrentShield(newShieldValue: number) {
    const boundedShieldValue = Math.max(
      0,
      Math.min(shieldData.maxShield, newShieldValue),
    );
    if (boundedShieldValue === shieldData.currentShield) return;
    shieldData.currentShield = boundedShieldValue;
  }
}

const shieldData = new shieldDataManager();

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < shieldData.currentShield ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shieldData.currentShield} / 10 shield`, 12, 100);
  readout.textContent = `Shield charge: ${shieldData.currentShield} / 10`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats();
}

function renderStats() {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shieldData.currentShield} · Missing charge: ${shieldData.getMissingShield()}`;
}

function updateVisuals() {
  drawMeter();
  if (panel) updateStats();
}

function updatePanel(button: HTMLButtonElement) {
  if (!panel && button.id == "counter-open") {
    panel = document.createElement("p");
    host.append(panel);
    renderStats();
  } else if (panel && button.id == "counter-close") {
    panel.remove();
    panel = null;
  }
}

//UI listener
document.addEventListener("click", (event) => {
  const uiEventTarget = event.target as HTMLButtonElement | null;
  // if it IS a button
  if (uiEventTarget != null) {
    // counter update
    if (
      uiEventTarget.id == "counter-less" ||
      uiEventTarget.id == "counter-more" ||
      uiEventTarget.id == "counter-reset"
    ) updateVisuals();
    // panel update
    if (
      uiEventTarget.id == "counter-open" ||
      uiEventTarget.id == "counter-close"
    ) updatePanel(uiEventTarget);
  }
});

// numerical updates
document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  shieldData.setCurrentShield(shieldData.currentShield - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  shieldData.setCurrentShield(shieldData.currentShield + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  shieldData.setCurrentShield(0);
};

drawMeter();
