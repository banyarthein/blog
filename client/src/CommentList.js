import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';

export default (props) => {

    const { postId } = props;
    const [comments, setComments] = useState({});

    const fetchData = async () => {
        const response = await axios.get(`http://localhost:4001/posts/${postId}/comments`)
        setComments(response.data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    console.log(comments);

    const renderedComments = Object.values(comments).map(comment => {
        return (
            <li key={comment.id}> {comment.content} </li>
        );
    })

    return <ul>{renderedComments} </ul>
}