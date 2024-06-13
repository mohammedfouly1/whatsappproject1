/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Avatar } from '@material-ui/core';
import { useRouter } from 'next/router';
import styles from '../styles/chat.module.css';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuth } from '../Context/Authcontext';

export default function Chat(props) {
  const { users, id } = props;
  const { currentUser } = useAuth();
  const router = useRouter();
  function enterChat() {
    router.push(`/chat/${id}`);
  }
  return (
    <div className={styles.Chat_Container} onClick={enterChat}>
      <div className={styles.UserAvatar}>
        <Avatar>{getRecipientEmail(users, currentUser)[0]}</Avatar>
      </div>
      <p>{getRecipientEmail(users, currentUser)}</p>
    </div>
  );
}
