const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const fetchContentcontroller = async (req, res) => {
        console.log('fetchContentcontroller');
        const data = req.body;

        const { accessKeyId, secretAccessKey, region, bucketName, currentPath } = data;
        console.log('currentPath', currentPath);

        if (!accessKeyId || !secretAccessKey || !region || !bucketName || !currentPath) {
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
            Key: key,
            Delimiter: '/',
        };

        const command = new ListObjectsV2Command(params);
        const response = await client.send(command);

        const folders = response.CommonPrefixes
            ? response.CommonPrefixes.map((prefix) => ({
                name: prefix.Prefix.replace(currentPath, ''),
              }))
            : [];
        
        const files = response.Contents
            ? response.Contents.filter((item) => item.Key !== currentPath).map((file) => ({
                name: file.Key.replace(currentPath, ''),
              }))
            : [];
              const content ={
                files:files,
                folders:folders
              }
        console.log('Sending data to client:', content);
        // res.status(200).send(content); 
        res.send(content);
    
};

module.exports = fetchContentcontroller;
