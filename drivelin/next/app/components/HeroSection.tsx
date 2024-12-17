"use client";
import { useState } from "react";
import styles from "../styles/HeroSection.module.css";

type CarouselItem = {
  carousel_link: string;
  carousel_pic: string;
};

const sampleData: CarouselItem[] = [
  { carousel_link: "#", carousel_pic: "/img/carousel-poster1.jpg" },
  { carousel_link: "#", carousel_pic: "/img/carousel-poster2.jpg" },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sampleData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sampleData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className={styles.hero}>
      <div className={styles.carousel}>
        <button className={styles.arrow} onClick={prevSlide}>
          ❮
        </button>
        <a
          href={sampleData[currentIndex].carousel_link}
          className={styles.carouselItem}
          style={{
            backgroundImage: `url(${sampleData[currentIndex].carousel_pic})`,
          }}
        >
        </a>
        <button className={styles.arrow} onClick={nextSlide}>
          ❯
        </button>
      </div>
    </section>
  );
}
