import Head from "next/head";
import styles from "../styles/Home.module.css";
import List from "../Components/List/List.jsx";

export default function Home() {
  return (
    <div className={styles.container}>
      <List></List>
    </div>
  );
}
