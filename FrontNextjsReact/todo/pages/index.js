import Head from "next/head";
import styles from "../styles/Home.module.css";
import List from "../Components/List/List.tsx";

export default function Home() {
  return (
    <>
      {/* <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head> */}
      <div className={styles.container}>
        <List></List>
      </div>
    </>
  );
}
