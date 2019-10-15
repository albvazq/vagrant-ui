import { AtlasAPI } from '../../build/electron/modules/atlas-api';

const token = '';

AtlasAPI.getInstance(token).search().subscribe((boxes: any) => {
  console.log(boxes);
});
