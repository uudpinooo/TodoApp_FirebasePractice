import { useEffect, useState } from 'react';
import { VFC } from 'react';
import { auth } from './firebase';
import styles from './Login.module.css';

export const Login: VFC = (props: any) => {
  const { history } = props;

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      user && history.push('/');
    });
    return () => unSub();
  }, [history]);

  const onChangeEmail = (event: React.ChangeEvent<HTMLElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setEmail(value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setPassword(value);
  };

  // ログイン
  const onClickLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  // アカウント登録
  const onClickCreateUser = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert('アカウントを登録しました');
      history.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickToggle = () => setIsLogin(!isLogin);

  return (
    <div className={styles.root}>
      <h1>{isLogin ? 'Create new account' : 'Login'}</h1>
      <input
        type='text'
        value={email}
        onChange={onChangeEmail}
        placeholder='E-mail'
      />
      <br />
      <input
        type='password'
        value={password}
        onChange={onChangePassword}
        placeholder='Password'
      />
      <br />
      <button onClick={isLogin ? onClickCreateUser : onClickLogin}>
        {isLogin ? 'Create' : 'Go'}
      </button>
      <button onClick={onClickToggle}>
        {isLogin ? '戻る' : 'アカウント登録する'}
      </button>
    </div>
  );
};
