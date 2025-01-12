import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

export default function AdsCard() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchApprovedAds = async () => {
      try {
        const q = query(
          collection(db, "promos"),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(q);
        const approvedAds = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const validAds = approvedAds.filter(ad => {
          const expiryDate = new Date(ad.expiryDate); 
          return expiryDate > new Date(); 
        });
        if (validAds.length > 0) {
          const randomAd = validAds[Math.floor(Math.random() * validAds.length)];
          setAds([randomAd]);
        } else {
          setAds([]); 
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchApprovedAds();
  }, [db]);

  const openModal = (ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedAd(null);
      setIsClosing(false); 
    }, 200); 
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains(styles.modal)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className={styles.adsContainer}>
      {ads.length > 0 ? (
        ads.map((ad) => (
          <div
            key={ad.id}
            className={styles.adsCard}
            onClick={() => openModal(ad)}
          >
            <img src={ad.imageUrl} alt={ad.title} />
            <h3>{ad.title}</h3>
            <p>{ad.content.split(" ").slice(0, 10).join(" ")}...</p>
          </div>
        ))
      ) : (
        <div className={styles.adsCard}>
          <img
            src="https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2150787976.jpg?t=st=1725189424~exp=1725193024~hmac=45e80a77801e48a16e66ddcf345d80c67c484f6b338d83ab2e9ac81eb82b360e&w=1380"
            alt=""
          />
          <h3>Your ads</h3>
          <h1>
            Do you want to advertise?{" "}
            <Link to={"/submit-promo"}>click here</Link>
          </h1>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal} onClick={handleBackdropClick}>
          <div
            className={`${styles.modalContent} ${
              isClosing ? styles.closing : ""
            }`}
          >
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <div className={styles.modalBody}>
              <img src={selectedAd.imageUrl} alt={selectedAd.title} />
              <h2>{selectedAd.title}</h2>
              <p>{selectedAd.content}</p>
              <p>
                Do you want to advertise? click <a href="/submit-promo">here</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
