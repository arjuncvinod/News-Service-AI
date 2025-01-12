import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./index.module.css"; // Ensure this CSS module is correctly imported
import { getDate, estimateReadingTime } from "../../services/functions"; // Ensure this function is correctly defined
import Loader, { Loader3, Loader5 } from "../../components/Loader/Loader";
import NavBar from "../../components/NavBar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TranslateIcon from "@mui/icons-material/Translate";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { NewsCard3 } from "../../components/NewsCards";
import SummariseText from "../../services/summarise";
import { translateText } from "../../services/translate";
import TranslationLanguages from "../../services/Data";
import textToSpeech from "../../services/textToSpeech";
import AOS from 'aos'
import "aos/dist/aos.css";

function NewsViewPage() {
  const { newsTitle, date } = useParams(); // Destructure both title and date from params
  const navigate = useNavigate(); // Hook for navigation
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarNews, setSidebarNews] = useState([]);
  const [category, setCategory] = useState("");
  const [newsContent, setNewsContent] = useState();
  const [newsHeading, setNewsHeading] = useState();
  const [translateLoader, setTranslateLoader] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false); // State to manage speaking status

  useEffect(() => {
    const fetchNews = async () => {
      AOS.init({ duration: 750 })
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/news/by-title`,
          {
            params: {
              title: newsTitle,
              date: date || getDate(),
            },
          }
        );
        setNews(response.data.data);
        setNewsContent(response.data.data.content);
        setNewsHeading(response.data.data.title);
        if (response.data.data) {
          setCategory(response.data.data.category); 
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        //   } finally {
        //     setLoading(false);
      }
    };

    const fetchSidebarNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/news`, {
          params: {
            date: date || getDate(),
            category: category || "all",
          },
        });
        setSidebarNews(response.data.data.slice(0, 10) || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sidebar news:", err);
      }
    };

    fetchNews();
    if (category) {
      fetchSidebarNews();
    }
  }, [newsTitle, date, category]);

  const handleBackClick = () => {
    navigate("/"); 
  };
  if (loading) {
    return <Loader />;
  }

  const handleSummarize = async () => {
    const summary = await SummariseText(newsContent);
    setNewsContent(summary);
  };
  const handleTranslate = async (language) => {
    setTranslateLoader(true);
    const contentTranslation = await translateText(newsContent, language);
    const headingTranslation = await translateText(newsTitle, language);
    setNewsHeading(headingTranslation);
    setNewsContent(contentTranslation);
    await setTranslateLoader(false);
    console.log(language);
  };
  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    await handleTranslate(selectedLanguage);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      textToSpeech(newsContent);
      setIsSpeaking(true);
    }
  };

  window.onbeforeunload = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <>
      <NavBar />
      <div className={styles.newsViewContainer}>
        <button onClick={handleBackClick} className={styles.backButton}>
          &larr;
        </button>
        <div className={styles.mainContent}>
          <div className={styles.imageContainer}>
            <img src={news.urlToImage} alt="" />
          </div>
          <div className={styles.titleContainer}>
            {translateLoader ? (
              <>
                <Loader3 />
              </>
            ) : (
              <h1 data-aos="fade-up">{newsHeading}</h1>
            )}
            <div className={styles.newsInfo} data-aos="fade-up">
              <p className={styles.date}>
                <CalendarMonthIcon className={styles.calendarMonthIcon} />
                {` ${news.publishedAt}`}
              </p>
              <p>
                <AccessTimeIcon className={styles.accessTimeIcon} />
                {estimateReadingTime(newsContent)} Min Read
              </p>
              <p>
                <button onClick={handleSummarize}>
                  <AutoAwesomeIcon className={styles.autoAwesomeIcon} />
                  Summarise
                </button>
              </p>
              <p>
                <button>
                  <TranslateIcon className={styles.translateIcon} />
                  Translation to
                  <select
                    className={styles.select}
                    name=""
                    id=""
                    onChange={handleLanguageChange}
                  >
                    {TranslationLanguages.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </button>
              </p>
              <p className={styles.readButton}>
                <button onClick={handleSpeak} >
                  {isSpeaking ? (
                    <>
                      Read article <StopCircleIcon className={styles.readIcon} style={{color:"red"}} />
                    </>
                  ) : (
                    <>
                      Read article <VolumeUpIcon className={styles.readIcon}  />
                    </>
                  )}
                </button>
              </p>
            </div>
          </div>
          <div className={styles.newsContent} data-aos="fade-up">
            {translateLoader ? <Loader5 /> : <p>{newsContent}</p>}
          </div>
        </div>
        <div className={styles.sideBar}>
          {sidebarNews.map((item, index) => (
            <NewsCard3
              key={index}
              title={item.title}
              imageUrl={item.urlToImage}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default NewsViewPage;
