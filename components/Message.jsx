import moment from 'moment';
import styles from '../styles/Message.module.css';
import { useAuth } from '../Context/Authcontext';

export default function Message(props) {
  const { currentUser } = useAuth();
  const { user, message } = props;

  const typeOfMessage = user === currentUser.email ? 'Sender' : 'Receiver';

  return (
    <div className={styles.MessageContainer}>
      <p className={`${styles.MessageElement} ${typeOfMessage === 'Sender' ? styles.Sender : styles.Receiver}`}>
        {message.message}
        <span className={styles.timestampSpan}>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...' }
        </span>
      </p>
    </div>
  );
}
