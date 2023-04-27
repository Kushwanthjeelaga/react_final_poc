import React from "react";
import "./dropdown.css";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { bookShelfCollectionName } from "../constants";


function DropdownComponent(props) {
  const navigate = useNavigate();

  const emailID = localStorage.getItem("emailID");

  const setbooks = async (prev, newCategeory) => {
    console.log(emailID);
    let arr = prev;
    //dashboard props
    if (props.previousCategeory) {
      arr[props.previousCategeory].splice(props.index, 1);
    } else {
      arr["all_books"].splice(props.index, 1);
    }

    //bookShelf props
    if (newCategeory !== "none") {
      let a = [...arr[newCategeory]];
      a.push(props.book);
      arr[newCategeory] = a;
    } else {
      if (props.previousCategeory) {
        let a = [...arr["all_books"]];

        a.push(props.book);
        arr["all_books"] = a;
      }
    }

    const bookref = doc(db, bookShelfCollectionName, emailID);
    await setDoc(bookref, arr);
    
    if (props.previousCategeory) {
      props.updateBookhelf();
    } else {
      if (newCategeory !== "none") {
        navigate("/bookshelf");
      } else {
        window.open("/dashboard", "_self");
      }
    }
  };

  const handleClick = (event) => {
    console.log(props.index);
    const newCategeory = event.target.value;
    console.log(event.target.value, props.book);

    console.log(props.previousBookShelf, newCategeory);
    setbooks(props.previousBookShelf, newCategeory);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-success dropdown-toggle btn-circle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      ></button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li>
          <button
            className="dropdown-item"
            value="currently_reading"
            onClick={handleClick}
          >
            Currently Reading
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            value="want_to_read"
            onClick={handleClick}
          >
            Want to Read
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            value="read_done"
            onClick={handleClick}
          >
            Read
          </button>
        </li>
        <li>
          <button className="dropdown-item" value="none" onClick={handleClick}>
            None
          </button>
        </li>
      </ul>
    </div>
  );
}

export default DropdownComponent;
