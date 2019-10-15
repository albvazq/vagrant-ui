// import * as ChildProcess from 'child_process';
import ps_tree from 'ps-tree';
// tslint:disable-next-line: no-var-requires
const ChildProcess = require('child_process');

export enum STATUS {
    'STARTED',
    'RUNNING',
    'PAUSED',
    'STOPPED',
    'CANCELLED',
    'FINISHED'
}

export class CMD {
  private child: any;
  private status: STATUS;

  constructor(cmd: string, args: ReadonlyArray<string>, private callbacks: any) {
    this.child = ChildProcess.spawn(cmd, args);
    this.status = STATUS.RUNNING;

    console.log(this.child);

    this.child.stdout.on('data', (buffer: any) => {
      if (this.callbacks.onData !== undefined) {
        this.callbacks.onData.bind(this, buffer)();
      }
    });

    this.child.stdout.on('end', () => {
      if (this.status !== STATUS.CANCELLED) {
        this.status = STATUS.FINISHED;
      }
      if (this.callbacks.onEnd !== undefined) {
        this.callbacks.onEnd.bind(this)();
      }
    });
  }

  public cancel() {
    this.status = STATUS.CANCELLED;
    this.kill(this.child.pid);
    if (this.callbacks.onCancel !== undefined) {
      this.callbacks.onCancel.bind(this)();
    }
  }

  protected kill(pid: any, signal?: any, callback?: any) {
    signal = signal || 'SIGKILL';
    ps_tree(pid, (err: any, children: any) => {
      [pid].concat(
        children.map((p: any) => {
          return p.PID;
        })
      ).forEach((tpid) => {
        try {
          process.kill(tpid, signal);
        } catch (ex) {
          // Exception
        }
      });
    });
  }
}
