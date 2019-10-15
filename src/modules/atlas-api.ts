import request, { Response } from 'request';
import {Observable, Observer} from 'rxjs';
import { Box } from '@/dto/box.interfce';
export class AtlasAPI {
  private apiUrl = 'https://app.vagrantup.com/api/v1';

  // tslint:disable-next-line: member-ordering
  private static instance: AtlasAPI;
  // tslint:disable-next-line: member-ordering
  private static bearerToken: string;

  private constructor() {
  }

  // tslint:disable-next-line: member-ordering
  public static setBearerToken(bearerToken: string) {
    AtlasAPI.bearerToken = bearerToken;
  }

  // tslint:disable-next-line: member-ordering
  public static getInstance(bearerToken?: string): AtlasAPI {
    if (!AtlasAPI.instance) {
      if (!AtlasAPI.bearerToken) {
        if (!bearerToken) {
          throw new Error('You must specify a Bearer token.');
        }
        AtlasAPI.bearerToken = bearerToken;
      }
      AtlasAPI.instance = new AtlasAPI();
    }
    return AtlasAPI.instance;
  }

  public search() {
    return new Observable((observer: Observer<Box[] | null>) => {
      request.get(this.apiUrl + '/search', {
        auth: {
          bearer: AtlasAPI.bearerToken
        }
      }, (error: any, response: Response, body: any) => {
        if (!error) {
          const responseBoxes = JSON.parse(body).boxes;
          const boxes: Box[] = [];
          for (const b of responseBoxes) {
            const box: Box = {
              tag: b.tag,
              name: b.name,
              username: b.username,
              description: (b.description_html !== null ? b.description_html : b.short_description),
              version: b.current_version.version,
              providers: []
            } as Box;
            // tslint:disable-next-line: forin
            for (const p of b.current_version.providers) {
              box.providers.push(p.name);
            }
            boxes.push(box);
          }
          observer.next(boxes);
        } else {
          observer.next(null);
        }
      });
    });
  }
}
