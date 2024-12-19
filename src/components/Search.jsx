import React, { useState } from "react";
import _ from "lodash";
import { dealLabel } from "../utils/dealLabel.ts";
import { formatDate } from "../utils/formatDate.ts";
import { t } from "../i18n/utils.ts";

export function Search(props) {
  // React state replaces Solid.js signals
  const [inputVal, setInputVal] = useState('');
  const [resultPosts, setResultPosts] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputVal(value);

    if (value === '') {
      setResultPosts([]);
    } else {
      let filterBlogs = props.posts.filter(
        (post) =>
          _.toString(post.data.title).toLowerCase().includes(value.toLowerCase()) ||
          _.toString(post.data.description).toLowerCase().includes(value.toLowerCase())
      );

      let cloneBlogs = _.cloneDeep(filterBlogs);
      const reg = new RegExp(value, "gi");

      cloneBlogs.forEach((blog) => {
        blog.data.title = blog.data.title.replace(reg, (match) => {
          return `<span class="text-skin-active font-bold">${match}</span>`;
        });
        if (blog.data.description) {
          blog.data.description = blog.data.description.replace(reg, (match) => {
            return `<span class="text-skin-active font-bold">${match}</span>`;
          });
        } else {
          blog.data.description = "";
        }
      });

      setResultPosts(cloneBlogs);
    }
  };

  return (
    <div>
      <label className="relative block">
        <span className="absolute inset-y-0 flex items-center pl-2 opacity-75">
          <i className="ri-search-line text-skin-active ml-1"></i>
        </span>
        <input
          id="search-input"
          className="block w-full rounded border border-opacity-40 bg-skin-fill text-skin-base py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-skin-accent focus:outline-none"
          placeholder={t("search.placeholder")}
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoFocus
        />
      </label>

      {resultPosts.length > 0 && (
        <div className="my-2">
          {t("search.searchLabelOne")}
          <span className="px-2 font-bold text-skin-active">{resultPosts.length}</span>
          {t("search.searchLabelTwo")}
        </div>
      )}

      <div className="my-4">
        {resultPosts.map((post) => (
          <>
            <a
              className="text-xl underline-offset-4 decoration-skin-base decoration-wavy hover:underline hover:decoration-sky-500 font-bold"
              href={"/" + post.collection + "/" + post.slug}
              dangerouslySetInnerHTML={{ __html: post.data.title }}
            ></a>
            <div className="flex items-center">
              {post.data.date ? (
                <div className="flex items-center cursor-pointer">
                  <i className="ri-calendar-2-fill mr-1" />
                  <div className="tag">{formatDate(post.data.date)}</div>
                </div>
              ) : (
                ""
              )}

              {dealLabel(post.data.category)
                .filter((item) => item !== "uncategorized")
                .map((categoryName, categoryNameIndex) => (
                  <div className="flex items-center cursor-pointer" key={categoryNameIndex}>
                    <div className="divider-vertical" />
                    <i className="ri-folder-2-fill mr-1" />
                    <a href={"/category/" + categoryName}>{categoryName}</a>
                  </div>
                ))}

              {dealLabel(post.data.tags).map((tagName, tagIndex) => (
                <div className="flex items-center cursor-pointer" key={tagIndex}>
                  <div className="divider-vertical" />
                  <i className="ri-price-tag-3-fill mr-1" />
                  <a href={"/tags/" + tagName}>{tagName}</a>
                </div>
              ))}
            </div>
            <p className="break-all mb-4" dangerouslySetInnerHTML={{ __html: post.data.description }}></p>
          </>
        ))}
      </div>
    </div>
  );
}
