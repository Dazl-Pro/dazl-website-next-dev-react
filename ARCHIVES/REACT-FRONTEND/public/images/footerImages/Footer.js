import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import footerlogo from "./footer.png";
import facebook from "./01-Facebook-Icon.png";
import linkedin from "./01-LinkedIn-Icon.png";
import Instagram from "./01-Instagram-Icon.png";
import twitter from "./01-Twitter-Icon.png";
import Pinterest from "./01-Pinterest-Icon.png";
import YouTube from "./01-YouTube-Icon.png";

const Footer = () => {
  return (
      <div className={styles.FooterContainer}>
        <footer className={styles.footerDistributed}>
          <div className={styles.footerLeft}>
            <p className={styles.footerlinks}>
              <div className={styles.navLogo}>
            <Link passHref href="/">
              <Image src={footerlogo} className={styles.Footerlogo} alt="/" width= '90px'
              height= '90px'/>
            </Link>
              </div>
            </p>
            <ul className={styles.footerCenter}>
              <li>Company Dazl &copy; {new Date().getFullYear()}</li>
              <li>All Rights Reserved</li>
              <li>info@dazlpro.com</li>
            </ul>
          </div>

          <div className={styles.footerRight}>
            <p className={styles.followUs}> FOLLOW US ON</p>
            <div style={{float:"right"}}>

          <Link passHref className={styles.socailLink} href="/">
            <img src={facebook.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px'/>
          </Link>
          <Link passHref className={styles.socailLink} href="/">
            <img src={linkedin.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px'/>
          </Link>
          <Link passHref className={styles.socailLink} href="/">
            <img src={twitter.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px'/>
          </Link>
          <Link passHref className={styles.socailLink} href="/">
            <img src={Instagram.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px'/>
          </Link>
          <Link passHref className={styles.socailLink} href="/">
            <img src={Pinterest.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px' />
          </Link>
          <Link passHref className={styles.socailLink} href="/">
            <img src={YouTube.src} className={styles.socialMedia} alt="/" width= '30px' height= '30px' />
          </Link>
            </div>
          </div>
          <p className={styles.responseText}>
            {new Date().getFullYear()} All Rights Reserved &copy; Dazl   <br /> info@dazlpro.com
          </p>
        </footer>
      </div>
  );
};

export default Footer;

