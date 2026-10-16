export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const x = { num: 2 };
const y = { num: 2 };
let direction = 0;
const directionRecords = [
  { direction: "North", offset: -1, axis: y },
  { direction: "East", offset: 1, axis: x },
  { direction: "South", offset: 1, axis: y },
  { direction: "West", offset: -1, axis: x },
];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x.num * 56, 38 + y.num * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x.num}, ${y.num}) · Facing: ${
    directionRecords[direction].direction
  }`;
}

interface Command {
  execute(): void;
}

class forwardCommand implements Command {
  execute(): void {
    directionRecords[direction].axis.num = Math.max(
      0,
      Math.min(
        4,
        directionRecords[direction].axis.num +
          directionRecords[direction].offset,
      ),
    );
    drawRover();
  }
}

class rightCommand implements Command {
  execute(): void {
    direction = (direction + 1) % 4;
    drawRover();
  }
}

const rfc = new forwardCommand();
const rrc = new rightCommand();

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  rfc.execute();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  rrc.execute();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x.num = 2;
  y.num = 2;
  direction = 0;
  drawRover();
};
drawRover();
