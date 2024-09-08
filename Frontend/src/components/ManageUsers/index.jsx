import { useEffect, useState } from 'react';
import { db} from '../../services/firebase'; // Ensure you import auth from firebase
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { deleteUser, getAuth } from 'firebase/auth';
import styles from "./index.module.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched users:', usersList); // Log the fetched users
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, 'users', userId));

      // Delete user from Firebase Authentication
      const auth = getAuth(); // Ensure you use the appropriate auth instance
      const user = auth.currentUser; // This assumes the user to be deleted is the currently logged-in user
      if (user && user.uid === userId) {
        await deleteUser(user); // Delete the current user's auth account
      } else {
        // Handle deletion for other users if necessary
        console.error('User is not currently logged in or ID mismatch');
      }

      // Update the UI
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className={styles.manageUsers}>
      <h1>Manage Users</h1>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Role</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default ManageUsers;
