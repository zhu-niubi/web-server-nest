import * as OSS from 'ali-oss';

export default function aliOSS(): OSS {
  const accessKeyId: any = process.env.accessKeyId;
  const accessKeySecret: any = process.env.accessKeySecret;
  const store = new OSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'isf-ppf',
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
    secure: true,
  });
  // store.putBucketReferer('isf-ppf', false, [
  //   'https://servicewechat.com',
  //   'http://127.0.0.1/*',
  //   'http://localhost/*',
  //   'http://localhost:8080/*',
  //   'http://localhost:8081/*',
  //   'http://localhost:3000/*',
  //   'https://test.nkdfilm.api.nkodapu.com',
  //   'https://wxapp.ngj.nkdppf.com',
  //   'https://admin.ngj.nkdppf.com',
  // ])
  return store;
}
