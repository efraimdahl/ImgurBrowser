import Masonry from 'react-masonry-css';
import styles from './gallery.module.css'

function Gallery ({ images }) {
  return (
    <Masonry
      breakpointCols={{ default: 4, 1400: 3, 1000: 2, 500:1 }}
      className={styles['my-masonry-grid']}
      columnClassName={styles["my-masonry-grid_column"]}
    >
      {images.map((element,index)=>{
            console.log(index)
            return(
            <div className={styles["card"]} key={index}>
            <a href={element.link}>
              {element.mainImage && element.title &&
              <>
              <img className={styles["pimage"]} src={element.mainImage}/>
              <p>{element.title}</p>
              <p>Score: {element.score}</p>
              </>
              }
            </a>
            </div>)
    })}
    </Masonry>
  );
}

export default Gallery;
