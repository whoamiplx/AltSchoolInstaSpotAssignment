import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Styling sheet for React

const cardData = [
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1.png",
    alt: "Val Thoren",
    caption: "Val Thoren",
  },
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1 (1).png",
    alt: "Restaurant terrace",
    caption: "Restaurant terrace",
  },
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1 (2).png",
    alt: "An outdoor cafe",
    caption: "An outdoor cafe",
  },
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1 (3).png",
    alt: "A very long bridge",
    caption: "A very long bridge, over the forest",
  },
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1 (4).png",
    alt: "Tunnel with morning light",
    caption: "Tunnel with morning light",
  },
  {
    src: "/assets/pexels-kassandre-pedro-8639743 1 (5).png",
    alt: "Mountain house",
    caption: "Mountain house",
  },
];

export default function App() {
  const [profile, setProfile] = useState({
    name: "Bessie Coleman",
    title: "Civil Aviator",
    avatar: "/assets/avatar.png",
  });
  const [cards, setCards] = useState(cardData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [preview, setPreview] = useState({ src: "", caption: "" });
  const [newCard, setNewCard] = useState({ title: "", image: null });

  const nameRef = useRef();
  const titleRef = useRef();
  const avatarRef = useRef();
  const postTitleRef = useRef();
  const postImageRef = useRef();

  const handleLikeToggle = (index) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, liked: !card.liked } : card
      )
    );
  };

  const handleImageClick = (src, caption) => {
    setPreview({ src, caption });
    setIsImageOpen(true);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const title = titleRef.current.value.trim();
    const avatarFile = avatarRef.current.files[0];

    if (name.length < 2 || title.length < 2) return;

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ name, title, avatar: reader.result });
        setIsEditOpen(false);
      };
      reader.readAsDataURL(avatarFile);
    } else {
      setProfile((prev) => ({ ...prev, name, title }));
      setIsEditOpen(false);
    }
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    const title = postTitleRef.current.value.trim();
    const file = postImageRef.current.files[0];

    if (!title || !file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCards((prev) => [
        ...prev,
        {
          src: reader.result,
          alt: title,
          caption: title,
          liked: false,
        },
      ]);
      setIsPostOpen(false);
      postTitleRef.current.value = "";
      postImageRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div
        className={`app ${isEditOpen || isImageOpen || isPostOpen ? "" : ""}`}
      >
        <header>
          <div className="logo">
            <img src="/assets/logo.svg" alt="Logo" />
          </div>
        </header>
        <section id="profile">
          <div className="profile-img">
            <img src={profile.avatar} alt="Avatar" />
            <div className="profile-info">
              <div className="details">
                <h1>{profile.name}</h1>
                <p>{profile.title}</p>
              </div>
            </div>
            {!isEditOpen && !isPostOpen && (
              <button className="edit" onClick={() => setIsEditOpen(true)}>
                <img src="/assets/edit.svg" alt="Edit" className="edit-icon" />
                Edit Profile
              </button>
            )}
          </div>
          {!isEditOpen && (
            <div className="post">
              <button onClick={() => setIsPostOpen(true)}>+ New Post</button>
            </div>
          )}
        </section>

        <section id="outdoor-img">
          <div className="img-container">
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => handleImageClick(card.src, card.caption)}
              >
                <img src={card.src} alt={card.alt} className="image" />
                <p className="img-text">
                  {card.caption}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(i);
                    }}
                  >
                    <svg
                      className={`like-icon${card.liked ? " liked" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={card.liked ? "red" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
                    </svg>
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Edit Modal */}
        {isEditOpen && (
          <div id="editModal" className="modal">
            <form
              id="editForm"
              className="modal-form"
              onSubmit={handleProfileUpdate}
            >
              <input
                type="text"
                id="name"
                placeholder="Name"
                defaultValue={profile.name}
                ref={nameRef}
              />
              <input
                type="text"
                id="title"
                defaultValue={profile.title}
                ref={titleRef}
              />
              <input type="file" id="avatar" ref={avatarRef} />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Image Preview Modal */}
        {isImageOpen && (
          <div
            id="imageModal"
            className="modal"
            onClick={() => setIsImageOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <img id="previewImage" src={preview.src} alt="Preview" />
              <h2 id="previewTitle">{preview.caption}</h2>
              <button
                id="closeImageModal"
                onClick={() => setIsImageOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <section id="footer">
        <p>2023 © Spots</p>
      </section>
    </div>
  );
}
