import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("/api/image")
      .then((response) => setImages(response.data))
      .catch((error) => console.log("deu erro no front"));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {images.map((image: any) => {
        return <img src={`data:image.jpg;base64,${image.data}`} />;
      })}
    </div>
  );
}

export const config = {
  api: {
    responseLimit: false,
  },
};
