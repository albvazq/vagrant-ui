import { CMD } from '../cmd';
import { Observable } from 'rxjs';

// tslint:disable-next-line: no-var-requires
const sscanf = require('sscanf');

export class VagrantBox {
  public list() {
    return new Observable((observer) => {
      const boxes: any = [];
      try {
        const cmd = new CMD('vagrant', ['box', 'list'], {
          onData: (buffer: any) => {
            if (buffer !== undefined) {
              const strbuff = buffer.toString();
              if (strbuff.indexOf('(') !== -1) {
                const cmdBox = sscanf(strbuff, '%s (%s, %s)', 'name', 'provider', 'version');
                const box = {
                  name: cmdBox.name,
                  provider: cmdBox.provider,
                  version: cmdBox.version
                };
                boxes.push(box);
              }
            }
          },
          onEnd: () => {
            observer.next(boxes);
          }
        });
      } catch (e) {
        console.log(e);
        observer.next(null);
      }
    });
  }

  public download(box: any, events: any) {
    const params = ['box', 'add', box.name];
    if (box.provider !== undefined && box.provider != null) {
        params.push('--provider');
        params.push(box.provider);
    }
    let zeros: any = [];
    const cmd = new CMD('vagrant', params, {
      onData: (buffer: any) => {
        const result: any = {};
        if (buffer !== undefined) {
          const strbuff = buffer.toString();
          const prgIndex = strbuff.search('Progress: ');
          const progressIndex = strbuff.search('% ');
          const rateIndex = strbuff.search('Rate: ');
          const estimatedIndex = strbuff.search('Estimated ');
          let progress = null;
          let rate: string = '';
          if (prgIndex > -1) {
            let size = progressIndex - (prgIndex + 9);
            progress = strbuff.substr(prgIndex + 9, size);
            size = estimatedIndex - (rateIndex + 5);
            rate = strbuff.substr(rateIndex + 5, size);
            rate = rate.replace('/s, ', '');
            rate = rate.replace('k', '');
            rate = rate.trim();
          }
          if (progress !== null) {
            result.progress = progress;
          }
          if (rate !== null) {
            if (rate === '0') {
              zeros.push(Date.now());
              if (zeros[zeros.length - 1] - zeros[0] > (10 * 1000)) {
                result.rate_error = true;
                cmd.cancel();
              }
            } else {
              zeros = [];
              result.rate = rate;
            }
          }
        }
        events.onProgress(result);
      },
      onEnd: () => {
        events.onEnd();
      }
    });
    return cmd;
  }

  public remove(box: any, events: any) {
    // vagrant box remove ubuntu/trusty64
    const params = ['box', 'remove', box.name, '--box-version', box.version, '--provider', box.provider];
    console.log(params);
    const cmd = new CMD('vagrant', params, {
      onData: (buffer: any) => {
        // OnData
      },
      onEnd: () => {
        events.onEnd();
      }
    });
  }
}
