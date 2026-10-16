export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const roverCommands = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const x = { num: 2 };
const y = { num: 2 };
let direction = 0;
let commandsDirection = 0;
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

class CommandQueue<T extends () => void> {
  private queue: T[] = [];
  public enqueue(command: T): void {
    this.queue.push(command);
  }
  public dequeue(): T | undefined {
    return this.queue.shift();
  }
  public runAll(): void {
    while (this.queue.length > 0) {
      const cmd = this.dequeue();
      cmd?.();
    }
  }
  public clear(): void {
    while (this.queue.length > 0) {
      this.dequeue();
    }
  }
  public get size(): number {
    return this.queue.length;
  }
}

const rfc = new forwardCommand();
const rrc = new rightCommand();
const cmdQueue = new CommandQueue<() => void>();

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  cmdQueue.enqueue(() => rfc.execute());
  roverCommands.textContent += "Move " +
    directionRecords[commandsDirection].direction + " | ";
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  cmdQueue.enqueue(() => rrc.execute());
  commandsDirection += 1;
  roverCommands.textContent += "Turn to face " +
    directionRecords[commandsDirection].direction + " | ";
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x.num = 2;
  y.num = 2;
  direction = 0;
  commandsDirection = 0;
  cmdQueue.clear();
  roverCommands.textContent = "";
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  cmdQueue.runAll();
  roverCommands.textContent = "";
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  cmdQueue.clear();
  roverCommands.textContent = "";
};
drawRover();
