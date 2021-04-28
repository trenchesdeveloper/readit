import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "../types";
import axios from "axios";

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

const PostCard: React.FC<{ post: Post }> = ({
  post: {
    identifier,
    voteScore,
    title,
    commentCount,
    subName,
    body,
    username,
    createdAt,
    slug,
    url
  },
}) => {
  const vote = async (value: number) => {
    try {
      const { data } = await axios.post('/misc/vote', {
        identifier,
        slug,
        value
      })
      console.log(data)
    } catch (error) {}
  };

  return (
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* upvote */}
        <div onClick={()=> vote(1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
          <i className="icon-arrow-up"></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* down vote */}

        <div onClick={()=> vote(-1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
          <i className="icon-arrow-down"></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                alt="default"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              />
              <a className="text-xs font-bold cursor-pointer hover:underline">
                /r/${subName}
              </a>
            </>
          </Link>
          <p className="text-xs text-gray-500">
            {" "}
            <span className="mx-1">•</span> Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 cursor-pointer hover:underline">
                /u/{username}
              </a>
            </Link>
            <Link href={`${url}`}>
              <a href="" className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a href="">
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>

          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>

          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;