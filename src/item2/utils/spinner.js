export function spinner(text = "處理中...") {
  let intervalId = null;
  let index = 0;
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  return {
    start() {
      if (intervalId) return this;
      process.stdout.write(`\r${text} ${frames[index]}`);
      intervalId = setInterval(() => {
        index = (index + 1) % frames.length;
        process.stdout.write(`\r${text} ${frames[index]}`);
      }, 80);
      return this;
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      process.stdout.write(`\r${text} 完成\n`);
      return this;
    },
  };
}
