import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { bookShelfCollectionName } from "./constants";
import DropdownComponent from "./dropdown/dropdown";
function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [allBooks, setallBooks] = useState([]);
  const emailID = localStorage.getItem("emailID");
  const [currentBookshelf, setCurrentBookshelf] = useState({});
  const [getDefaultBooks, setGetDefaultBooks] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [resultTitle, setResultTitle] = useState("");
  

  useEffect(() => {
    if (loading) return;
    if (!user || !emailID) return navigate("/");

    const getAllBooks = async () => {
      console.log(emailID);
      const doc_refs = await getDoc(doc(db, bookShelfCollectionName, emailID));
      const res = doc_refs.data();
      setallBooks(res.all_books)
      setGetDefaultBooks(res.all_books);
      setCurrentBookshelf(res);
      console.log(res);
    };

    getAllBooks();
  }, [user, loading, emailID, navigate]);


//getSuggestions method is for getting the suggestions of the book
  const getSuggestions = (event) => {
    setDefaultInputValue(event.target.value);
    let inputText = event.target.value;
    try {
      inputText = inputText.toString().toLowerCase().trim();
    } catch {}
    console.log(inputText);
    let res = [];
    //getDefaultBooks is getting all the default books 
    if (getDefaultBooks.length) {
      getDefaultBooks.forEach((book) => {
        if (
          book.book_name.toLowerCase().includes(inputText) &&
          inputText.length
        ) {
          res.push(book);
        }
      });
    }

    console.log("sugges", res);
    
    setSuggestions(res);
  };

// search method is for searching the book 
  const search = (event) => {
    event.preventDefault();
    //setDefaultInputvalue is declared in change input value
    setResultTitle(defaultInputValue);
    setSuggestions([]);

    let searchText = defaultInputValue.toLowerCase().trim();

    console.log(typeof searchText);
    let res = [];
    //getDefaultBooks is getting all the default books 
    getDefaultBooks.forEach((book) => {
      console.log(book.book_name.toLowerCase(), searchText);
      if (
        book.book_name.toLowerCase().includes(searchText) &&
        searchText.length
      ) {
        res.push(book);
      }
    });
    console.log(res);
    setallBooks(res);
  };

  const [defaultInputValue, setDefaultInputValue] = useState("");

  const changeInputValue = (event) => {
    console.log(event.target.innerText);
    event.preventDefault();
    setDefaultInputValue(event.target.innerText);
  };

// Taking the index of the book
  const findIndex = (bookName) => {
    let i = 0;
    getDefaultBooks.forEach((ele, index) => {
      if (ele.book_name === bookName) {
        console.log(index);
        i = index;
      }
    });
    return i;
  };

  return (
    <div className="container-fluid p-0">
      <div className="text-center bg-secondary text-white p-2 fs-2  mb-4">
        <strong>Dashboard</strong>

        <button
          className="btn btn-danger my-1"
          onClick={logout}
          style={{ float: "right" }}
        >
          Logout
        </button>
      </div>
      <button  className="book_shelf" onClick={() => navigate("/bookshelf")} >Bookshelf</button>

      <form className="my-5 text-center " onSubmit={search}>
        <div className="d-flex justify-content-center align-center ">
          <input
            value={defaultInputValue} 
            className="form-control me-2 w-50 col-2 "
            type="text"
            placeholder="Seach"
            onChange={getSuggestions}
            autoComplete="off"
          />
          <button className=" col-1 btn btn-success" onClick={search}>
            Search
          </button>
        </div>
        {suggestions.length > 0 && (
          <div
            className="dropdown mt-2 border"
            style={{ overflowY: "scroll", maxHeight: "150px", marginLeft: "19%", width: "47%" }}
          >
            {suggestions.map((element) => (
              <>
                <button
                  className="btn w-100 btn-light dropdown-row"
                  value={element.book_name}
                  onClick={changeInputValue}
                >
                  {element.book_name}
                </button>
                <br />
              </>
            ))}
          </div>
        )}
      </form>
      
      {resultTitle.length > 0 && (
        <div>
          Result: {resultTitle}
          <hr />
        </div>
      )}

      {allBooks.length > 0 && (
        <div
          className="d-flex flex-row my-3 gap-4"
          style={{ flexWrap: "wrap", margin: "50px" }}
        >
          {allBooks.map((book) => (
            <div key={book.book_name}>
              <div className="card col-auto px-0">
                <div className="text-center">
                  <img
                    className="mx-auto"
                    src={book.book_image}
                    alt=""
                    height="300"
                    width="200"
                  ></img>
                  <br />
                  <p>{book.book_name}</p>
                </div>
                <DropdownComponent
                  book={book}
                  previousCategeory={null}
                  index={findIndex(book.book_name)}
                  previousBookShelf={currentBookshelf}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}
export default Dashboard;
