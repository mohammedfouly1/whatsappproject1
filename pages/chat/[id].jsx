import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Chat.[id].module.css';
import { useAuth } from '../../Context/Authcontext';
import ChatScreen from '../../components/ChatScreen';
import { projectFirestore } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

export default function ChatWithId(props) {
  // redux state
  const theme = useSelector((state) => state.themeSwitcher);
  const { messages, chat } = props;
  const { currentUser } = useAuth();
  const router = useRouter();
  if (!currentUser) { router.push('/login'); return ''; }

  return (
    <div className={`${styles.Container}  ${theme.themeDark ? 'dark' : ''}`}>
      <Head>
        <title>{`Chat with ${getRecipientEmail(chat.users, currentUser)}`}</title>
      </Head>
      <div className={styles.SidebarContainer}>
        <Sidebar />
      </div>

      <div className={styles.chatContainer}>

        <ChatScreen chat={chat} messages={messages} />
      </div>

    </div>
  );
}

export async function getServerSideProps(context) {
  const ref = projectFirestore.collection('chats').doc(context.params.id);
  const responseMessages = await ref.collection('messages').orderBy('timestamp', 'asc').get();

  // Prepare messages on server.
  const messages = responseMessages.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  // eslint-disable-next-line no-shadow
  })).map((messages) => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  }));

  // Prepare the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}
