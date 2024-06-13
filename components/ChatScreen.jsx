import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import { AttachFile, InsertEmoticon, MicOutlined } from '@material-ui/icons';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useState, useRef } from 'react';
import TimeAgo from 'timeago-react';
import styles from '../styles/ChatScreen.module.css';
import { useAuth } from '../Context/Authcontext';
import { projectFirestore, timestamp } from '../firebase';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';

export default function ChatScreen(props) {
  const endOfMessageRef = useRef();
  const { chat, messages } = props;
  const [input, setInput] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();
  const routeId = router.query.id;
  const recipientEmail = getRecipientEmail(chat.users, currentUser);
  const [messagesSnapshot] = useCollection(projectFirestore
    .collection('chats')
    .doc(routeId)
    .collection('messages')
    .orderBy('timestamp', 'asc'));

  const [recipientSnapshot] = useCollection(
    projectFirestore.collection('users').where('email', '==', recipientEmail),
  );

  function showMessages() {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }

    return JSON.parse(messages).map((message) => (
      <Message
        key={message.id}
        user={message.user}
        message={message}
      />
    ));
  }

  function scrollToBottom() {
    endOfMessageRef.current.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    });
  }

  function sendMessage(e) {
    e.preventDefault();
    // Update last seen
    projectFirestore.collection('users').doc(currentUser.uid).set({
      lastSeen: timestamp(),
    }, { merge: true });

    // Adding message to db.
    projectFirestore.collection('chats').doc(routeId).collection('messages').add({
      timestamp: timestamp(),
      message: input,
      user: currentUser.email,
      photoURL: currentUser?.photoURL,

    });

    setInput('');
    scrollToBottom();
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <div className={styles.ChatScreenContainer}>
      <div className={styles.ChatHeader}>
        {recipient ? <Avatar src={recipient?.photoURL} />
          : <Avatar>{recipientEmail?.charAt(0)}</Avatar>}
        <div className={styles.HeaderInfo}>

          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last Seen
              {' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : 'Unavailable'}
            </p>
          ) : <p>Last Seen...</p>}

        </div>

        <div className={styles.HeaderIcons}>
          <IconButton>
            <MoreVert style={{ color: 'var(--icon-Color)' }} />
          </IconButton>
          <IconButton><AttachFile style={{ color: 'var(--icon-Color)' }} /></IconButton>

        </div>

      </div>
      <div className={styles.ChatMessageContainer}>
        {/* showMessages */}

        {showMessages()}

        {/* End of Messages */}
        <div ref={endOfMessageRef} className={styles.EndOfMessage} />
      </div>
      <form className={styles.ChatInputContainer} onSubmit={sendMessage}>
        <InsertEmoticon style={{ color: 'var(--icon-Color)' }} />
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); }}
          className={styles.Input}
        />

        <IconButton type="submit" disabled={!input} style={{ backgroundColor: 'var(--theme-Color-Primary)' }} color="inherit"><SendIcon style={{ color: 'var(--text-Color)' }} /></IconButton>

        <IconButton>

          <MicOutlined style={{ color: 'var(--icon-Color)' }} />
        </IconButton>

      </form>
    </div>
  );
}
