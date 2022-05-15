import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Home(props) {
  const [hashtag,setHashtag] = useState("coding")
  const [searchNum,setSearchNum]=useState(1)
  const [nextToken, setNextToken]=useState(props.meta)
  const router = useRouter()

  const searchTweet = async (mode)=>{
    console.log("searching tweet ", hashtag, "number of tweets: ", searchNum)
    if(mode==0){
      setNextToken("")
      setSearchNum(0)}
    
    router.replace({
          pathname: window.location.pathname,
          query: { search: hashtag,page:searchNum,nextToken:nextToken }
      })}
  console.log(props)
  
  return (
    <div className="container">
      <Head>
        <title>Twitter API Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Twitter API Test
        </h1>

        <p className="description">
          A simple twitter search app
        </p>
        <label htmlFor="hashtag">Hashtag search</label>
        <input id="hashtag" name="hashtag" placeholder={hashtag} onChange={ (event) => setHashtag(event.target.value) }/>
        <button onClick={(event=>{searchTweet(0)})}>Search</button>
        <div className="grid">
          <button onClick={(event=>{if(searchNum>1){setSearchNum(searchNum-1);searchTweet(1)}})}>Previous Page</button>
          <button onClick={(event=>{setSearchNum(searchNum+1);searchTweet(1)})}>Next Page</button>
          <p>Current Page: {searchNum}</p>
        </div>
        <div className="grid">
          {props.finaldata.map((element,index)=>{
            console.log(index)
            return(
              
          <a key={index} href={element.url} className="card">
            <h3>{element.username} &rarr;</h3>
            <p>{element.text}</p>
            <p>{element.created_at}</p>
          </a>)
          })}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

//Prerendering of the page, this guarantees that the calls to the twitter API are made from the server side, which is important
//because the twitter api does not support CORS
export async function getServerSideProps(context) {
  // Fetch data from external API
  console.log(context.query.search==undefined)

  let query = {"search":"coding","page":0}
  if(context.query.search!=undefined && context.query.page!=undefined){
    query = context.query
  }
  const url_template = "https://twitter.com/twitter/status/"
  console.log(query)
  const res = await fetch('http://localhost:3000/api/twitter/search2', {
    method: 'POST',
    body: JSON.stringify({
      query
    })
  })
  const data = await res.json()
  console.log(data)
  //const datadata = data.data
  const finaldata = data.data.data
  const includes = data.data.includes
  //inefficient matching algorithm, better would be to create transformation from list into dictionary and have direct call be possible
  finaldata.forEach(element => {
    includes.users.forEach(user => {
      if(user.id==element.author_id){
        element["username"]=user.name
      }
    });
    element["url"] = url_template+element.id
  });
  const meta = data.data.meta.next_token
  //console.log(finaldata)
  // Pass data to the page via props
  return { props: { finaldata, includes, meta} }
}


