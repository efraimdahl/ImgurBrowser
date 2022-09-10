const needle = require('needle');


const endpointUrl = "https://api.imgur.com/3/gallery/search/showViral=true&mature=true&album_previews=false/?q=";


export default async (req, res) => {
    const body = JSON.parse(req.body);
    console.log(body)
    const { search } = body.query;

    console.log("API seeing search for ", search)

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    console.log(process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID)
    const nurl = endpointUrl+search
    try {
        const results = await needle('get', nurl, {
            headers: {
                "Authorization": `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`
            }
        })
        results.body
        return res.status(200).json({
            status: 'Ok',
            data: results.body
          });
        } catch(e) {
            return res.status(400).json({
              custom: "this error again",
              status: e.message
            });
          }
}
