import React, { useState, useEffect } from 'react';
import './MainUser.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ClipboardList, UserPlus } from 'lucide-react';
import { FaUser, FaIdBadge, FaPhoneAlt, FaEnvelope, FaUsers, FaTimes } from 'react-icons/fa';

const MainUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    referenceId: '',
    phone: '',
    email: '',
    subscribers: ''
  });

  const [userList, setUserList] = useState([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [userToDelete, setUserToDelete] = useState(null); // stores user selected for deletion
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // toggles confirm modal


  const [newSubData, setNewSubData] = useState({
    referenceId: '',
    email: '',
    subscriber: ''
  });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('userList')) || [];
    setUserList(storedUsers);

    const nextId = `ATS${(storedUsers.length + 1).toString().padStart(4, '0')}`;
    setFormData(prev => ({
      ...prev,
      referenceId: nextId
    }));
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exists = userList.some(user =>
      user.referenceId === formData.referenceId ||
      user.email === formData.email ||
      user.phone === formData.phone
    );

    if (exists) {
      showNotification('Reference ID, Email or Phone already exists.');
      return;
    }

    const updatedList = [...userList, formData];
    setUserList(updatedList);
    localStorage.setItem('userList', JSON.stringify(updatedList));

    const nextId = `ATS${(updatedList.length + 1).toString().padStart(4, '0')}`;
    setFormData({
      name: '',
      referenceId: nextId,
      phone: '',
      email: '',
      subscribers: ''
    });
    setShowTable(true);
  };

  const handleReferenceClick = (subscriberString) => {
    const subscribers = subscriberString?.split(',').map(s => s.trim()).filter(Boolean) || [];
    setSelectedSubscribers(subscribers);
  };

  const closeSubscribers = () => setSelectedSubscribers([]);

  const handleDelete = (referenceId) => {
    const updatedList = userList.filter(user => user.referenceId !== referenceId);
    setUserList(updatedList);
    localStorage.setItem('userList', JSON.stringify(updatedList));
  };

  const handleNewSubChange = (e) => {
    const { name, value } = e.target;
    setNewSubData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubscriber = () => {
    const updatedUsers = userList.map(user => {
      if (
        user.referenceId === newSubData.referenceId &&
        user.email === newSubData.email
      ) {
        const currentUserSubs = user.subscribers ? user.subscribers.split(',') : [];
        if (!currentUserSubs.includes(newSubData.subscriber)) {
          currentUserSubs.push(newSubData.subscriber);
        }
        return {
          ...user,
          subscribers: currentUserSubs.join(',')
        };
      }
      return user;
    });

    setUserList(updatedUsers);
    localStorage.setItem('userList', JSON.stringify(updatedUsers));
    setNewSubData({ referenceId: '', email: '', subscriber: '' });
    showNotification('Subscriber added successfully!');
  };

  // Filter logic
  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current user's subscribers for modal preview
  const currentUserSubs = userList.find(
    u => u.referenceId === newSubData.referenceId && u.email === newSubData.email
  );
  const confirmDelete = () => {
  const updatedList = userList.filter(user => user.referenceId !== userToDelete);
  setUserList(updatedList);
  localStorage.setItem('userList', JSON.stringify(updatedList));
  setUserToDelete(null);
  setShowDeleteConfirm(false);
  showNotification('User deleted successfully.');
};


  return (
    <div className="container-fluid py-4 min-vh-100 bg-light position-relative">
  {notification && (
  <div className="custom-notification alert alert-danger">
    {notification}
  </div>
)}




      <motion.header className="animated-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <div className="diagonal-line"></div>
        <h2 className="header-title"><FaUsers style={{ marginRight: '10px', color: '#fff' }} /> Main User Directory</h2>
      </motion.header>

      <div className="d-flex justify-content-between mb-3 mt-4">
        <button className="toggle-button" style={{marginLeft:'400px'}} onClick={() => setShowTable(!showTable)}>
          {showTable ? (
            <span className="icon-label"><FileText className="icon m-2" /> View Form</span>
          ) : (
            <span className="icon-label"><ClipboardList className="icon m-2" /> Registered Users</span>
          )}
        </button>

        <button className="toggle-button inline-flex items-center gap-2 text-white font-semibold" style={{marginRight:'400px'}}  onClick={() => setShowSubModal(true)}>
          <UserPlus className="w-5 h-5 m-2 stroke-white" /> Add Subscriber
        </button>
      </div>

      <AnimatePresence>
        {showSubModal && (
          <motion.div className="subscriber-modal shadow-lg p-4 rounded bg-white position-fixed top-50 start-50 translate-middle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5><UserPlus className="w-5 h-5 m-2 stroke-white" /> Add Subscriber</h5>
              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setShowSubModal(false)} />
            </div>
            <div className="mb-2">
              <input type="text" name="referenceId" placeholder="Reference ID" className="form-control mb-2" value={newSubData.referenceId} onChange={handleNewSubChange} />
              <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={newSubData.email} onChange={handleNewSubChange} />
              <input type="text" name="subscriber" placeholder="New Subscriber" className="form-control mb-2" value={newSubData.subscriber} onChange={handleNewSubChange} />
              <button className="btn btn-primary w-100" onClick={handleAddSubscriber}>Add</button>
            </div>
            {currentUserSubs && currentUserSubs.subscribers && (
              <div className="mt-3">
                <h6>Current Subscribers:</h6>
                <ul>
                  {currentUserSubs.subscribers.split(',').map((s, i) => (
                    <li key={i}>{s.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSubscribers.length > 0 && (
          <div className="subscriber-overlay">
            <motion.div className="subscriber-modal"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <button className="close-btn" onClick={closeSubscribers}><FaTimes /></button>
              <h5>👥 Subscribers</h5>
              {selectedSubscribers.map((s, index) => (
                <div key={index} className="subscriber-card m-2">{s}</div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!showTable ? (
        <div className="form-container">
          <h4 className="text-center mb-4 form-title inline-flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 m-2 stroke-white" /> Register New User
          </h4>

          <form onSubmit={handleSubmit} className="styled-form">
            <div className="form-group mt-4">
              <label><FaIdBadge className="me-2" />Reference ID</label>
              <input type="text" minLength={7} maxLength={7} className="form-control mt-3" name="referenceId" value={formData.referenceId} disabled />
            </div>
            <div className="form-group mt-4">
              <label><FaUser className="me-2" />Name</label>
              <input type="text" minLength={4} maxLength={30} className="form-control mt-3" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group mt-4">
              <label><FaPhoneAlt className="me-2" />Phone</label>
              <input type="text" minLength={10} maxLength={10} className="form-control mt-3" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group mt-4">
              <label><FaEnvelope className="me-2" />Email</label>
              <input type="email" className="form-control mt-3" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group mt-4">
              <label><FaUsers className="me-2" />Subscribers (comma-separated)</label>
              <input type="text" className="form-control mt-3" name="subscribers" value={formData.subscribers} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success w-100 mt-3">Submit</button>
          </form>
        </div>
      ) : (
        <div className="table-responsive">
          <input type="text" placeholder="Search users..." className="form-control mb-3" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <table className="table table-striped table-hover styled-table">
            <thead className="">
              <tr>
                <th>Reference ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx}>
                  <td className="clickable text-primary" onClick={() => handleReferenceClick(user.subscribers)}>{user.referenceId}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => {
  setUserToDelete(user.referenceId);
  setShowDeleteConfirm(true);
}}
>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showDeleteConfirm && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <h5>Are you sure you want to delete this user?</h5>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-secondary me-2" onClick={() => setShowDeleteConfirm(false)}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={() => confirmDelete()}>
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MainUser;
