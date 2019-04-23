import React from "react";
import "./index.scss";
import map from "lodash/map";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialList = [
    {
      href: "https://www.baidu.com",
      name: "WEIBO"
    },
    {
      href: "https://www.baidu.com",
      name: "ZHIHU"
    },
    {
      href: "https://www.baidu.com",
      name: "GITHUB"
    },
  ];
  //样式完全照抄Linpx,thx。
  const themeLogo =
    "https://www.linpx.com/usr/themes/pinghsu/images/logo-hsuping.png";
  const recentPosts = [{ title: "", articleId: "" }];
  const recentComments = [{ title: "", articleId: "" }];
  return (
    <footer className={"immortal-footer"}>
      <div className={"footer-social "}>
        <ul className={"social-list"}>
          {map(socialList, ({ href, name }, index) => (
            <li key={index}>
              <a href={href}>{name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className={"footer-meta "}>
        <div className="meta-item meta-copyright">
          <Link to={"/"}>
            <img src={themeLogo} alt="LiNPX" />
          </Link>
          <p>我见青山多妩媚，望青山见我亦如是</p>
          <p>Powered by Lynss</p>
          <p>© 2019 Lynss</p>
        </div>
        <div className="meta-item meta-posts">
          <div className="meta-title">RECENT POSTS</div>
          <ul className={"recent-posts meta-contents"}>
            {map(recentPosts, ({ articleId, title }, index) => (
              <li key={index}>
                <Link to={articleId}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="meta-item meta-comments">
          <div className="meta-title">RECENT COMMENTS</div>
          <ul className={"recent-comments meta-contents"}>
            {map(recentComments, ({ articleId, title }, index) => (
              <li key={index}>
                <Link to={articleId}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
