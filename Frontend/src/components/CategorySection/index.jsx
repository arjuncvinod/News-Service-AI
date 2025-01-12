/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './index.module.css';
import { NewsCard2 } from "../NewsCards";
import { getDate,shuffleArray} from '../../services/functions'; 
  import AOS from 'aos'
  import "aos/dist/aos.css";
export default function CategorySection({cat}) {
  const [newsData2, setNewsData2] = useState([]);
 
  // const getDate = () => {
  //   const today = new Date();
  //   console.log(today);
    
  //   return today.toISOString().split('T')[0]; 
  // };

  useEffect(() => {
      AOS.init({ duration: 750 });
    const fetchNews = async () => {
    
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/news`, {
          params: {
            date: getDate(),
            category: cat || "all",
          },
        });
        setNewsData2(response.data.data || []); 
      } catch (err) {
        console.log(err);
      }
    };

    fetchNews();
  }, [cat]);

  return (
    <div className={styles.categorySection}>
      <div className={styles.heading}>
        <h1>{cat || "Recent News"}</h1> 
        <span></span>
      </div>
      <div className={styles.newsContainer}>
        {newsData2.length > 0 ? (
          shuffleArray(newsData2).map((item, index) => (
            <NewsCard2
              key={index}
              imageUrl={item.urlToImage}
              title={item.title}
              date={new Date(item.publishedAt).toDateString()}
              description={item.description}
            />
          ))
        ) : (
          <p>No news available.</p>
        )}
      </div>
    </div>
  );
}
