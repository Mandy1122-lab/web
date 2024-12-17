"use client";
import styles from "../styles/DisplayItemsSection.module.css";

const displayItems = [
  {
    id: "1",
    item_name: "比悲傷更悲傷的故事",
    item_poster: "/img/movie1.jpg",
  },
  {
    id: "2",
    item_name: "關於我和鬼變成家人的那件事",
    item_poster: "/img/movie2.jpg",
  },
  {
    id: "3",
    item_name: "刻在你心底的名字",
    item_poster: "/img/movie3.jpg",
  },
  {
    id: "4",
    item_name: "當男人戀愛時",
    item_poster: "/img/movie4.jpg",
  },
  {
    id: "5",
    item_name: "我的婆婆怎麼把OO搞丟了",
    item_poster: "/img/movie5.jpg",
  },
];

export default function DisplayItemsSection() {
  return (
    <section className={styles.displayItemsSection}>
      <h2 className={styles.displayItemsTitle}>最新作品</h2>

      <div className={styles.displayItemsContainer}>
        {displayItems.map((item) => (
          <div key={item.id} className={styles.displayItem}>
            <div
              className={styles.displayItemImage}
              style={{
                backgroundImage: `url(${item.item_poster})`,
              }}
            />
            <p className={styles.displayItemName}>{item.item_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
