import React from "react";
import icon from "../../assets/icons/icon.svg";
import "./index.scss";

const ArticleBox = () => {
  const image = "https://www.linpx.com/usr/uploads/2019/01/2367901329.jpg";
  const title =
    "热马上大山里的拉开打算离开的啊‘；离大佬饭卡里疯热马上大山里的拉开打算离开的啊‘；离大佬饭卡里疯";
  const category = "Notes";
  return (
    <div className={"article-box"}>
      <img src={image} alt={"picture"} />
      <div className={"title"}>{title}</div>
      <div className={"footer"}>
        <span className={"category"}>{category}</span>
        <img src={icon} alt={"icon"} />
      </div>
    </div>
  );
};

export default ArticleBox;
