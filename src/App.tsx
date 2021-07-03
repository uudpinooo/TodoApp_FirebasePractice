import React, { useEffect, useState, VFC } from 'react';
import styles from './App.module.css';
import { auth, db } from './firebase';

type Task = {
  id: string;
  title: string;
};

export const App: VFC = (props: any) => {
  const { history } = props;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  // edit === trueのとき編集フォームが表示される
  const [edit, setEdit] = useState(false);
  const [editTaskId, setEditTaskId] = useState('');
  const [editValue, setEditValue] = useState('');

  // マウント時FirebaseのcollectionデータをsetTasksにセット
  useEffect(() => {
    const unSub = db.collection('tasks').onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  // 未ログインユーザーはアクセスできず/loginへ遷移
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && history.push('/login');
    });
    return () => unSub();
  }, [history]);

  // タスク入力
  const onChangeInputValue = (event: React.ChangeEvent<HTMLElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setInputValue(value);
  };

  // タスク追加
  const onClickAddTask = () => {
    db.collection('tasks').add({ title: inputValue });
    setInputValue('');
  };

  // タスク編集フォームの表示
  const onClickOpenEditForm = (task: Task) => {
    setEdit(true);
    setEditValue(task.title);
    setEditTaskId(task.id);
  };

  // 編集内容入力
  const onChangeEditValue = (event: React.ChangeEvent<HTMLElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setEditValue(value);
  };

  // タスク編集
  const onClickEditTask = () => {
    db.collection('tasks').doc(editTaskId).set({ title: editValue });
    setEdit(false);
    setEditTaskId('');
  };

  // タスク削除
  const onClickDeleteTask = (id: string) => {
    db.collection('tasks').doc(id).delete();
  };

  // ログアウト
  const onClickLogout = async () => {
    await auth.signOut();
    history.push('/login');
  };

  return (
    // <div className={styles.root}>
    <div className={styles.root}>
      <h1>TodoApp by Firebase + React/TypeScript☺️</h1>
      <div>
        <input
          type='text'
          value={inputValue}
          placeholder='New Task'
          onChange={onChangeInputValue}
        />
        <button onClick={onClickAddTask}>追加</button>
        <br />
        {edit && (
          <div>
            <input type='text' value={editValue} onChange={onChangeEditValue} />
            <button onClick={onClickEditTask}>編集</button>
          </div>
        )}
        <ul>
          {tasks.map((task: Task) => (
            <li key={task.id}>
              {task.title}
              <button onClick={() => onClickOpenEditForm(task)}>編集</button>
              <button onClick={() => onClickDeleteTask(task.id)}>削除</button>
            </li>
          ))}
        </ul>
        <p onClick={onClickLogout}>ログアウト</p>
      </div>
    </div>
  );
};
