const axios = require('axios');
const API_KEY = '';
const API_URL = 'https://api-v2.pandavideo.com.br';
const API_DOWNLOAD = 'https://download-us01.pandavideo.com:7443';
const DIR_FILE = '/tmp/videos';
const LIMIT = 5000;
const fs = require('fs');

(async() => {

    const downloadFile = ({
        video_id
    }) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`Download video_id: ${video_id}`)

                const content = await axios({
                    method: 'post',
                    url: `${API_DOWNLOAD}/videos/${video_id}/download`,
                    data: {
                        Authorization: API_KEY
                    },
                    responseType: 'stream'
                })
                content.data
                    .pipe(fs.createWriteStream(`${DIR_FILE}/${video_id}.mp4`))
                    .on('finish', () => {
                        resolve(true);
                    })
    
            } catch(e) {
                console.log(e, 'err')
                reject();
            }
        });
    }
    
    try {
        const videos = await axios.get(`${API_URL}/videos?limit=${LIMIT}`, {
            headers: {
                Authorization: API_KEY
            }
        });
        const data = videos.data;
        if (!data || (data && !data.videos.length))  {
            console.log('videos not found');
            process.exit(1)
        }

        for await(let video of data.videos) {

            await downloadFile({
                video_id: video.id
            })

        }

        console.log(`Download completed!!!`);

    } catch(e){ 
        console.log(e, 'err')
    }
})();