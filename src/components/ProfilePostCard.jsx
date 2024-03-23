import { useContext, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap"
import { useDispatch } from "react-redux";
import { AuthContext } from "./AuthProvider";
import { deletePost, likePost, removeLikeFromPost } from "../features/posts/postsSlice";
import UpdatePostModal from "./UpdatePostModal";

export default function ProfilePostCard({ post }) {
    const { content, id: postId, imageUrl } = post;
    const [likes, setLikes] = useState(post.likes || []);
    const dispatch = useDispatch();
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser.uid;

    // User has liked the post if their id is in the likes array
    const isLiked = likes.includes(userId);

    const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleShowUpdateModal = () => setShowUpdateModal(true);
    const handleCloseUpdateModal = () => setShowUpdateModal(false);

    const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

    // Add userId to likes array
    const addToLikes = () => {
        setLikes([...likes, userId]);
        dispatch(likePost({ userId, postId }));
    };

    // Remove userId from likes array and update the backend
    const removeFromLikes = () => {
        // Optimistic like = immediate response to the client
        // You will assume that the like is done, only then you pass the data to the db.
        // If the like operation is not successful in the db, then it will revert back the state variable of likes.
        setLikes(likes.filter((id) => id !== userId));
        dispatch(removeLikeFromPost({ userId, postId }));
    };

    const handleDelete = () => {
        dispatch(deletePost({ userId, postId }))
    };

    return (
        <Row
            className="p-3"
            style={{
                borderTop: "1px solid #D3D3D3",
                borderBottom: "1px solid #D3D3D3"
            }}
        >
            <Col sm={1}>
                <Image src={pic} fluid roundedCircle />
            </Col>

            <Col>
                <strong>Aizat</strong>
                <span> @iceroll • Mar 13</span>
                <p>{content}</p>
                <Image src={imageUrl} style={{ width: 150 }} />
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light" onClick={handleLike}>
                        {isLiked ? (
                            <i className="bi bi-heart-fill text-danger"></i>
                        ) : (
                            <i className="bi bi-heart"> {likes}</i>
                        )}
                        {likes.length}
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                    <Button variant="light">
                        <i
                            className="bi bi-pencil-square"
                            onClick={handleShowUpdateModal}
                        ></i>
                    </Button>
                    <Button variant="light">
                        <i
                            className="bi bi-trash"
                            onClick={handleDelete}
                        ></i>
                    </Button>
                    <UpdatePostModal
                        show={showUpdateModal}
                        handleClose={handleCloseUpdateModal}
                        postId={postId}
                        originalPostContent={content}
                    />
                </div>
            </Col>
        </Row>
    );
}