const mockAws = require('mock-aws-s3');

const s3 = mockAws.S3({
  params: { Bucket: 'my-photo-bucket' },
});

module.exports = s3;
