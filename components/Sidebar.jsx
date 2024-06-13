/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { SearchOutlined } from '@material-ui/icons';
import ChatIcon from '@material-ui/icons/Chat';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import { Button, Avatar, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useRef, useState } from 'react';
import EmailValidator from 'email-validator';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';

import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/features/themeSlice';
import styles from '../styles/Sidebar.module.css';
import { logout, useAuth } from '../Context/Authcontext';
import { projectFirestore } from '../firebase';
import Chat from './Chat';

export default function Sidebar() {
  const dispatch = useDispatch();

  const { currentUser } = useAuth();
  const [createChat, setCreateChat] = useState(false);
  const chatInputRef = useRef();
  const [chatInputState, setChatInputState] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [avatarPanel, setAvatarPanel] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const userChatRef = projectFirestore.collection('chats').where('users', 'array-contains', currentUser.email);
  const [chatSnapshot] = useCollection(userChatRef);

  function chatAlreadyExist(recipentEmail) {
    // optional chaining
    return !!chatSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipentEmail)?.length > 0);
  }

  async function getUidforExistingChat(recipentEmail) {
    // const userChatRef2 = projectFirestore.collection('chats').where('users', 'array-contains', currentUser.email);
    const result = await userChatRef.get();
    let resArry = [];
    let docid;
    result.forEach((doc) => {
      resArry = [...resArry, ...doc.data().users];
      docid = doc.id;
    });

    if (resArry.includes(recipentEmail)) {
      return docid;
    }
  }

  async function handleStartChatSubmit() {
    // const u = await getUidforExistingChat(chatInputState);

    if (EmailValidator.validate(chatInputState) && chatInputState !== currentUser.email && !chatAlreadyExist(chatInputState)) {
      // db call into chats collection
      projectFirestore.collection('chats').add({
        users: [currentUser.email, chatInputState],
      });
    } else {
      setError('Enter Valid Email Address');
    }
  }

  // chatAlreadyExist2('abcd2@abcd.com');

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  function handleStartChat(e) {
    setError('');
    setChatInputState(e.target.value);
    if (chatInputState.length === 0) {
      setDisabled(false);
    }
  }

  // Event handler function to close chat input on ESC
  function handleChatClose(event) {
    if (event.key === 'Escape') {
      setCreateChat(false);
    }
  }

  // Event handler function to close logout panel
  function avatarToggle() {
    setAvatarPanel(false);
  }

  // To disbale logout panel on any click on window if it is active
  useEffect(() => {
    if (avatarPanel) { document.addEventListener('click', avatarToggle); }
    return () => { document.removeEventListener('click', avatarToggle); };
  }, [avatarPanel]);

  useEffect(() => {
    // adding event only when createChat is true .ie Start New chat is clicked.
    // And focus on input after click
    if (createChat) { document.addEventListener('keydown', handleChatClose); chatInputRef.current.focus(); }
    // removing event on unmount
    return () => { document.removeEventListener('keydown', handleChatClose); };
  }, [createChat]);

  return (
    <div className={styles.container}>

      <div className={styles.Header}>

        <div className={styles.UserAvatar} onClick={() => { setAvatarPanel((v) => !v); }}>
          <Avatar>{currentUser.email[0]}</Avatar>
        </div>
        {avatarPanel && (
        <div className={styles.AvatarPanel} onClick={handleLogout}>
          Logout
        </div>
        )}
        <div className={styles.IconContainer}>
          <IconButton>
            <ChatIcon style={{ color: 'var(--icon-Color)' }} />
          </IconButton>

          <IconButton onClick={() => { dispatch(toggleTheme()); }}>
            <Brightness6Icon style={{ color: 'var(--icon-Color)' }} />
          </IconButton>
        </div>

      </div>
      <div className={styles.SearchContainer}>
        <SearchOutlined style={{ color: 'var(--icon-Color)' }} />
        <input type="text" className={styles.SeachInput} placeholder="Search your chats" />
      </div>
      <div className={styles.StartChatContainer}>
        {createChat ? (
          <div className={styles.newChatInput}>
            <input
              ref={chatInputRef}
              value={chatInputState}
              onChange={handleStartChat}
              className={styles.ChatInput}
              placeholder="Name of contact. Press ESC to leave"
            />

            <Button type="button" onClick={handleStartChatSubmit} className={styles.ChatButton} disabled={disabled}>Start Chat</Button>
          </div>
        ) : <Button type="button" onClick={() => { setCreateChat((val) => !val); }} className={styles.SidebarButton}>START A NEW CHAT</Button> }
        {error && <Alert severity="error">{error}</Alert>}
      </div>

      {/* List of chats */}
      {chatSnapshot?.docs.map((chat) => <Chat key={chat.id} id={chat.id} users={chat.data().users} />)}

    </div>

  );
}
