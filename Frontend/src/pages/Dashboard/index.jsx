import { useState, useEffect } from 'react'; // Add useState
import { Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase'; 
import ManageUsers from '../../components/ManageUsers';
import ManageNews from '../../components/MangeNews'; // Fixed typo in ManageNews import
import SubmitNews from '../../components/SubmitNews';
import styles from "./dashboard.module.css";
import axios from 'axios';
import toast from "react-hot-toast";
import ManagePromoContent from '../../components/ManagePromo';
import NewsPaperGenerator from '../../components/GeneratePdf/index';
import { getDate } from '../../services/functions';
import Loader from '../../components/Loader/Loader';

function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const date = getDate()
  const fetchNews = async () => {
    const toastId = toast.loading("Fetching news...");
  
    try {
      await axios.post(`${import.meta.env.VITE_API}/news/save`); 
      toast.success("News fetched successfully");
      toast.dismiss(toastId);
    } catch (error) {
      toast.update(toastId, { render: "Error fetching news", type: "error", isLoading: false });
    }
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API}/news`, {
          params: {
            date: date,
            category: "all"
          }
        });

        console.log('API Response:', response.data); 

        if (response.data.data && response.data.data.length > 0) {
          setNews(response.data.data);
        } else {
          setNews([]);
          console.error(`No news found for date: ${date}`);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, [date]); 

  if (loading) return <div><Loader /></div>;

  return (
    <div className={styles.admindashboard}>
      <nav className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link to="/admin/manage-users">Manage Users</Link></li>
          <li><Link to="/admin/manage-news">Manage News</Link></li>
          <li><Link to="/admin/manage-promo">Manage Promo</Link></li>
          <li onClick={fetchNews}><a>Generate News</a></li> {/* fetchNews called on click */}
          <li><Link to="/admin/generatenewspaper">Generate Newspaper</Link></li>
          <li><Link to="/admin/submit-news">Submit News</Link></li>
          <li onClick={handleLogout}><a>Logout</a></li>
        </ul>
      </nav>
      <div className={styles.content}>
        <Routes>
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-news" element={<ManageNews />} />
          <Route path="/manage-promo" element={<ManagePromoContent />} />
          <Route path="/generatenewspaper" element={<NewsPaperGenerator news={news} />} />
          <Route path="/submit-news" element={<SubmitNews />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
