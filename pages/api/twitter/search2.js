// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

let next_token = null
let last_query = ""

export default async (req, res) => {
    const body = JSON.parse(req.body);
    console.log(body)
    const { search } = body.query;
    const { page } = body.query;

    console.log(search)

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query': search,
        'tweet.fields': 'created_at,source',
        'expansions':'author_id',
        'user.fields':'username,url',
        'media.fields':'url',
    }
    if(next_token){
        params['next_token']=next_token
    }
    console.log(params)

    try {
        const results = await needle('get', endpointUrl, params, {
            headers: {
                "User-Agent": "v2RecentSearchJS",
                "authorization": `Bearer ${token}`
            }
        })
        console.log(results.body)
        next_token = results.body.meta.next_token;
        results.body
        return res.status(200).json({
            status: 'Ok',
            data: results.body
          });
        } catch(e) {
            return res.status(400).json({
              custom: "this eeror again",
              status: e.message
            });
          }
}

const getTweetByID = async (id)=>{
    const endpointUrl2 = "https://api.twitter.com/2/tweets/:id"


}