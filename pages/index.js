import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Masonry from 'react-masonry-css'
import Gallery from '../components/gallery'

export default function Home(props) {
  const [search, setSearch] = useState("cats")
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  //Make sure page state resets on search query
  useEffect(() => {
    setSearch(router.query.search)
  }, [router.query.search])

  function searchImgur() {
    console.log("searching images ", search)
    router.push({
      pathname: window.location.pathname,
      query: { search: search }
    })
    //window.location.reload(false);
  }

  return (
    <div className="container">
      <Head>
        <title>IMGUR API Test {search}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="nav">
          <h1 className="title">
            Imgur Browser
          </h1>
          <div className="search">
          <input id="search" name="search" placeholder={search} onChange={(event) => setSearch(event.target.value)} />
          <button className="btn" onClick={(event => { searchImgur() })}>Search</button>
          </div>
        </div>
        <Gallery images={props.finaldata} />
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
      <style jsx>
        {`
        #search{
          margin:20px;
          text-decoration: none;
        text-decoration-color: black;
        color:black;
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .search{
          display: block;
          height:100%;
          padding:40px; 
        }
        .nav{
          display: flex;
          justify-content: space-between;
          top: 0;
          width:100%;
          position: fixed;
          background-color: #f5f5f5aa;
          padding:20px;

        }
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



.title {
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
}

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

.btn {
  text-decoration: none;
  text-decoration-color: black;
  color:black;
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.5;
  padding: 6px 12px;
  margin-bottom: 0;

  display: inline-block;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
}

.btn:focus,
.btn:active:focus {
  outline: thin dotted;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}

.btn:hover,
.btn:focus {
  color: #333;
  text-decoration: none;
}

.btn:active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
}

/* default
---------------------------- */
.btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
}

.btn-default:focus {
  color: #333;
  background-color: #e6e6e6;
  border-color: #8c8c8c;
}

.btn-default:hover {
  color: #333;
  background-color: #e6e6e6;
  border-color: #adadad;
}

.btn-default:active {
  color: #333;
  background-color: #e6e6e6;
  border-color: #adadad;
}
        `}
      </style>

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

//Prerendering of the page to bypass CORS
export async function getServerSideProps(context) {
  // Fetch data from external API
  console.log(context.query.search)
  let query = { "search": "cat", "page": 0 }
  if (context.query.search != undefined) {
    query = context.query
  }
  const res = await fetch('http://localhost:3000/api/imgur/search2', {
    method: 'POST',
    body: JSON.stringify({
      query
    })
  })
  console.log('building page')
  const data = await res.json()
  console.log(data)
  const finaldata = data.data.data
  finaldata.forEach(element => {
    if (element.images_count > 0) {

      element.mainImage = element.images[0].link
    }
  })

  return { props: { finaldata } }
}


