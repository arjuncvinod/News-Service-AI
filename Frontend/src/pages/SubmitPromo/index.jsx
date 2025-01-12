import { useState } from "react";
import { db, storage } from '../../services/firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import styles from './promo.module.css';
import toast from "react-hot-toast";
import { auth } from '../../services/firebase';
import { Navigate } from 'react-router-dom';
import { getDate } from "../../services/functions";

const AddPromoContent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [date, setDate] = useState('');
  const [submittedBy] = useState(auth.currentUser ? auth.currentUser.email : '');
  const [status, setStatus] = useState('Submit');

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `promoImages/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      setImagePreview('');
    }
  };

  const validate = () => {
    const errors = [];
    
    if (!title) errors.push("title");
    if (!content) errors.push("content");
    if (!image) errors.push("image");
    if (!date) errors.push("date");
    
    if (errors.length > 0) {
      const formattedErrors = errors.map((error, index) => 
        index === 0 ? error.charAt(0).toUpperCase() + error.slice(1) : error
      );

      let errorMessage;
      if (formattedErrors.length === 4) {
        errorMessage = "Fill all details";
      } else {
        const lastError = formattedErrors.pop();
        errorMessage = formattedErrors.length > 0
          ? `${formattedErrors.join(", ")} and ${lastError} are required`
          : `${lastError} is required`;
      }
      
      toast.error(errorMessage);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setStatus("Uploading image...");
      const imageUrl = await handleImageUpload(image);

      setStatus("Submitting details...");
      const promosCollectionRef = collection(db, "promos");

      await addDoc(promosCollectionRef, {
        title,
        content,
        submittedDate:getDate(),
        expiryDate: format(new Date(date), 'yyyy-MM-dd'),
        imageUrl,
        submittedBy,
        status: 'pending',
      });

      toast.success("Submitted successfully");
      setTitle('');
      setContent('');
      setImage(null);
      setDate('');
      setImagePreview('');
      setStatus('Submit Another');
      document.getElementById('image').value = '';
    } catch (error) {
      console.error("Error submitting promo content:", error.message);
      toast.error("Something went wrong");
      setStatus("Submit");
    }
  };

  return (
    <div className={styles.container}>
  <div className={styles.formWrapper}>
    <h1 className={styles.heading}>Submit Promotional Content</h1>
    <p className={styles.description}>
      Share your latest promotional content with us. Fill in the details below!
    </p>
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
        />
        {imagePreview && <img src={imagePreview} alt="Image preview" className={styles.imagePreview} />}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="date">Expiry Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.submitBtn}>{status}</button>
    </form>
  </div>
</div>
  );
};

export default AddPromoContent;
