export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const consumption = { num: 6 };
let producers: number = 2;
const production = { num: 2 };
let balance: number;

const dataUiInfo = [
  {
    textContents: "Production",
    rectFillColor: "#27766b",
    value: production,
  },
  {
    textContents: "Consumption",
    rectFillColor: "#a44d23",
    value: consumption,
  },
];

function updateData(): void {
  production.num = producers * 3;
  balance = production.num - consumption.num;
}

function updateUI() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);

  for (let i = 0; i < dataUiInfo.length; i++) {
    ctx.fillStyle = "#233e43";
    ctx.fillText(
      "" + dataUiInfo[i].textContents + ": " + dataUiInfo[i].value.num,
      18,
      102 + i * 52,
    );
    ctx.fillStyle = dataUiInfo[i].rectFillColor;
    ctx.fillRect(
      18,
      110 + i * 52,
      dataUiInfo[i].value.num * 14,
      20,
    );
  }

  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${production.num} · Consumption: ${consumption.num} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateData();
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  updateData();
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateData();
    updateUI();
  };
updateData();
updateUI();
