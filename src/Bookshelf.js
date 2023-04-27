import React, { useEffect, useState } from "react";
import { db, logout } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { bookShelfCollectionName } from "./constants";
import DropdownComponent from "./dropdown/dropdown";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-headless-accordion";

function BookShelf() {
  const [userBookShelf, setUserBookShelf] = useState({});
  const [bookshelfChanaged, setBookshelfChanged] = useState(true);
  const navigate = useNavigate();

  const headings = ["currently_reading", "want_to_read", "read_done"];

  const emailID = localStorage.getItem("emailID");

  const updateBookhelf = () => {
    setBookshelfChanged(!bookshelfChanaged);
  };

  const getMyBooks = async () => {
    const doc_refs = await getDoc(doc(db, bookShelfCollectionName, emailID));
    const res = doc_refs.data();

    console.log(res);
    if (res) {
      setUserBookShelf(res);
    } else {
      setUserBookShelf({});
    }

    // return res
  };
  useEffect(() => {
    if (!emailID) {
      logout();
      navigate("/");
    }
    getMyBooks();
  }, [bookshelfChanaged]);

  return (
    <div className=" ">
      <div className="text-center bg-secondary text-white p-2 fs-2  mb-4 ">
        <strong>Book Shelf</strong>
        <button
          className="btn btn-danger mt-1"
          onClick={logout}
          style={{ float: "right" }}
        >
          Logout
        </button>
      </div>

      <div className="mx-5">
        {Object.keys(userBookShelf).length > 0 && (
          <div className="books-in-accordion">
            {headings.map((title) => {
              const parts = title.split("_");

              // Join the parts with spaces
              const spacedString = parts.join(" ");

              // Convert the string to title case
              const titleString = spacedString
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

              return (
                <Accordion  >
                  <AccordionItem style={{ width: '100%' }}>
                    <AccordionHeader className="w-100 btn btn-light my-1">
                      <h3>{titleString}</h3>
                    </AccordionHeader>

                    <AccordionBody>
                      <div className="accordion-body ">
                        <div
                          className="d-flex flex-row my-4 gap-1"
                          style={{ flexWrap: "wrap", background: "aliceblue"}}
                        >
                          {userBookShelf[title].length > 0 &&
                            userBookShelf[title].map((data, index) => (
                              <div
                                className="card col-auto px-0"
                                key={data.book_image}
                              >
                                <div className="text-center">
                                  <img
                                    className="mx-auto"
                                    src={data.book_image}
                                    alt=""
                                    height="300"
                                    width="200"
                                  ></img>
                                  <br />
                                  <p>{data.book_name}</p>
                                </div>
                                <DropdownComponent
                                  book={data}
                                  previousCategeory={title}
                                  index={index}
                                  updateBookhelf={updateBookhelf}
                                  previousBookShelf={userBookShelf}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              )
            })}
          </div>
        )}
      </div>
      <button
        className="btn btn-success rounded-circle"
        onClick={() => {
          navigate("/dashboard");
        }}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          border: "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#FFFFFF"
          class="bi bi-plus-lg"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
          />
        </svg>
      </button>
    </div>
  );
}

export default BookShelf;
