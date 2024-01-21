import PostList from "../components/PostList";
import NavBar from "../components/NavBar";
import { fetchUserData } from "../components/fetchUserID";
import { fetchThreadCount } from "../components/fetchThreadCount";
import "./styles.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "@mui/material";

const MyComments: React.FC = () => {
    const navBarWidth = 200;
    const { name } = useParams();
    const [postListKey, setPostListKey] = useState(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const userID = fetchUserData(name).userID;
    const { numOfThreads, updateThreadCount } = fetchThreadCount(false, userID);
    const postURL = `http://localhost:3000/posts?page=${pageNumber}&userID=${userID}`;

    const handleDeleteClick = async (ID: number) => {
        try {
            if (userID) {
                const response = await fetch(`http://localhost:3000/posts/${ID}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                console.log("Response from server:", data);
                updateThreadCount();
                setPostListKey((prevKey) => prevKey + 1);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="background">
            <div className="main-container">
                <NavBar setWidth={navBarWidth} />

                {userID !== null && (
                    <PostList
                        key={postListKey}
                        url={postURL}
                        name={name}
                        boxWidth="50%"
                        linkToThread={true}
                        isThread={false}
                        deletePress={handleDeleteClick}
                    />
                )}
            </div>
            <div>
                <Pagination
                    count={Math.ceil(numOfThreads / 5)}
                    className="pagination"
                    onChange={(e, page) => setPageNumber(page)}
                />
            </div>
        </div>
    );
};

export default MyComments;
