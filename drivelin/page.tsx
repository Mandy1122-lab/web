import styles from '../page.module.css'
import SpotList from './spotList'
export default function Home() {
  return (<div className={styles.main}>
    <h1 style={{ textAlign: 'center' }}>景點列表</h1>
    <SpotList/>
  </div>)
}