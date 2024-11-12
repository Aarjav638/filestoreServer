const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');

const fetchContentcontroller = async (req, res) => {
  console.log('fetchContentcontroller');
  const data = req.body;

  const { accessKeyId, secretAccessKey, region, bucketName, currentPath } = data;
  console.log('currentPath', currentPath);

  if (!accessKeyId || !secretAccessKey || !region || !bucketName ) {
      return res.status(400).send({ error: 'Invalid input' });
  }

  const key = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  console.log('key', key);

  const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      // endpoint: 'https://s3.wasabisys.com',
  });

  const params = {
      Bucket: bucketName,
      Prefix: key,
      Delimiter: '/',
  };

  try {
      const command = new ListObjectsV2Command(params);
      const response = await client.send(command);

      const folders = response.CommonPrefixes
          ? response.CommonPrefixes
              .filter((prefix) => prefix.Prefix.replace(currentPath, '').trim() !== '') 
              .map((prefix) => ({
                  name: prefix.Prefix.replace(currentPath, ''),
                  isFolder: true
              }))
          : [];

      console.log('folders:', folders);

      const files = response.Contents
          ? response.Contents
              .filter((item) => item.Key !== currentPath && item.Key.replace(currentPath, '').trim() !== '') // Filter out empty file names
              .map((file) => ({
                  name: file.Key.replace(currentPath, ''),
                  isFolder: false
              }))
          : [];

      console.log('files:', files);

      // Only send a response if there are folders or files
      if (folders.length === 0 && files.length === 0) {
          return res.status(200).send({ folders: [], files: [] });
      }

      const content = {
          folders: folders || [],
          files: files || []
      };

      console.log('Sending data to client:', content);
      res.status(200).send(content);
  } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).send({ error: 'Failed to fetch content' });
  }
};



const createFolder=async(req,res)=>{
  try{
    const data = req.body;
    const { accessKeyId, secretAccessKey, region, bucketName, currentPath,folderName } = data;

    if (!accessKeyId || !secretAccessKey || !region || !bucketName ||!folderName) {
        return res.status(400).send({ error: 'Invalid input' });
    }
    const client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
    });
    const folderPath = `${currentPath}${folderName}/`;
            const params = {
                Bucket: bucketName,
                Key: folderPath,
                Body: '', 
            };
    const command = new PutObjectCommand(params);
    await client.send(command);
    res.status(200).send({message:'Folder created successfully'});

  }
  catch(err){
    console.log('error',err);
    res.status(500).send({error:'Internal server error'});
  }


}

// const uploadFiles=async(req,res)=>{
//   try {
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res.status(400).send({ error: 'No files uploaded' });
//     }

//     const uploadResults = await Promise.all(
//       files.map(async (file) => {
//         const params = {
//           Bucket: BUCKET_NAME,
//           Key: `uploads/${Date.now()}_${file.originalname}`, // Unique file name
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };

//         const command = new PutObjectCommand(params);
//         await s3Client.send(command);

//         return {
//           fileName: file.originalname,
//           message: 'Uploaded successfully!',
//         };
//       })
//     );

//     res.status(200).send(uploadResults);
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     res.status(500).send({ error: 'Failed to upload files' });
//   }

// }

module.exports = {
    fetchContentcontroller,
    createFolder,
    // uploadFiles
};
