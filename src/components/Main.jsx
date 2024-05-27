import React, { useState } from "react";
import styles from "../styles/Main.module.css";
import { Link } from "react-router-dom";

const FIELDS = {
    NAME: "name",
    ROOM: "room",
};

const Main = () => {
    const { NAME, ROOM } = FIELDS;
    const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });

    function handleChange({ target: { value, name } }) {
        console.log(name, value);
        setValues({
            ...values,
            [name]: value,
        });
    }

    function handleClick(e) {
        const isDisabled = Object.values(values).some((value) => !value);

        console.log(isDisabled)
        if (isDisabled) e.preventDefault()
    }

    // console.log(values);

    return (
        <div className={styles.wrap}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Join</h1>

                <form>
                    <div className={styles.form}>
                        <div className={styles.group}>
                            <input
                                type="text"
                                name="name"
                                value={values[NAME]}
                                className={styles.input}
                                onChange={handleChange}
                                autoComplete="off"
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div className={styles.group}>
                            <input
                                type="text"
                                name="room"
                                value={values[ROOM]}
                                className={styles.input}
                                onChange={handleChange}
                                autoComplete="off"
                                placeholder="Room"
                                required
                            />
                        </div>

                        <Link
                            onClick={handleClick}
                            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
                            className={styles.link + " " + styles["mt-1"]}
                        >
                            <button type="submit" className={styles.button}>
                                Sign In
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Main;
