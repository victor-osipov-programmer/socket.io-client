import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Chat.module.css";
import emogi from "../images/emogi.svg";
import EmogiPicker from "emoji-picker-react";
import Messages from "./Messages";

const socket = io("http://localhost:5000");

const Chat = () => {
    let { search } = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState({ room: "", user: "" });
    const [state, setState] = useState([]);
    const [message, setMessage] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        
        const searchParams = Object.fromEntries(new URLSearchParams(search));
        setParams(searchParams);

        setTimeout(() => {
            socket.emit("join", searchParams);
        }, 1000);
    }, [search]);

    useEffect(() => {
        socket.on("message", ({ data }) => {
            setState((_state) => [..._state, data]);
        });
    }, []);

    useEffect(() => {
        socket.on("joinRoom", ({ data: { users } }) => {
            setUsers(users.length);
        });
    }, []);

    useEffect(() => {
        socket.on("leftRoom", ({ data: { users } }) => {
            setUsers(users.length);
        });
    }, []);

    function leftRoom() {
        socket.emit("leftRoom", { params });
        navigate('/')
    }

    function handleChange(event) {
        setMessage(event.target.value);
    }

    function onEmojiClick({ emoji }) {
        setMessage(message + emoji);
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!message) return;

        socket.emit("sendMessage", { message, params });

        setMessage("");
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>{params.room}</div>
                <div className={styles.users}>{users} users in this room</div>
                <button className={styles.left} onClick={leftRoom}>
                    Left the room
                </button>
            </div>

            <Messages messages={state} name={params.name} />
            {/* <div className={styles["messages-wrapper"]}>
            </div> */}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.group}>
                    <input
                        type="text"
                        name="message"
                        value={message}
                        className={styles.input}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="What do you want to write?"
                        required
                    />
                </div>

                <div className={styles.emoji}>
                    <img
                        src={emogi}
                        alt="emogi"
                        onClick={() => setOpen(!isOpen)}
                    />

                    {isOpen && (
                        <div className={styles.emogies}>
                            <EmogiPicker
                                onEmojiClick={onEmojiClick}
                            ></EmogiPicker>
                        </div>
                    )}
                </div>

                <input
                    className={styles.button}
                    type="submit"
                    value="Send message"
                />
            </form>
        </div>
    );
};

export default Chat;
