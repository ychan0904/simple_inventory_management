import fs from "fs";
import path from "path";

function listFiles(dir: string, acc: string[] = []) {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, acc);
    } else if (/\.(tsx?|css|js|cjs)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

export class PollSrcPlugin {
  private timer?: ReturnType<typeof setInterval>;

  apply(compiler: { options: { name?: string }; watching?: { invalidate: () => void }; hooks: { watchRun: { tap: (name: string, fn: () => void) => void } } }) {
    if (compiler.options.name !== "server") {
      return;
    }

    const roots = [
      path.join(process.cwd(), "src"),
      path.join(process.cwd(), "next.config.ts"),
    ];
    const mtimes = new Map<string, number>();

    const tick = () => {
      let changed = false;
      const files: string[] = [];
      for (const root of roots) {
        const stat = fs.existsSync(root) ? fs.statSync(root) : null;
        if (stat?.isDirectory()) {
          listFiles(root, files);
        } else if (stat) {
          files.push(root);
        }
      }
      for (const file of files) {
        const mtime = fs.statSync(file).mtimeMs;
        const prev = mtimes.get(file);
        if (prev !== undefined && prev !== mtime) {
          changed = true;
        }
        mtimes.set(file, mtime);
      }
      if (changed && compiler.watching) {
        compiler.watching.invalidate();
      }
    };

    compiler.hooks.watchRun.tap("PollSrcPlugin", () => {
      if (this.timer) {
        return;
      }
      this.timer = setInterval(tick, 1000);
      this.timer.unref();
    });
  }
}
