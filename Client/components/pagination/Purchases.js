import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFinalCart } from "../features/cartItemsSlice";
import { selectUser } from "../features/userSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import Navbar from "./Navbar";
import Posts from './Posts';
import Pagination from './Pagination';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

function Purchases() {
  const user = useSelector(selectUser);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostPerPage] = useState(5);

  useEffect(() => {
    Axios.get("/getPurchasedItems/"  + user.id ).then((response) => {
      if (response.data.success === true) 
      {
          console.log( "Purchase Fetched Successfully!")
          setPosts(response.data.result)
          setLoading(false);
          setPurchasedProducts(response.data.result)
      }
    })

  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const [value,setValue]=useState('');
  const handleSelect=(e)=>{
    console.log(e);
    setPostPerPage(e)
    setValue(e)
  }

  return(
   
    <>
      <Navbar />
      <DropdownButton
      style={{marginLeft: "600px", marginBottom : "-80px" }}
      title="-- select --"
      onSelect={handleSelect}
        >
              <Dropdown.Item eventKey="2">2</Dropdown.Item>
              <Dropdown.Item eventKey="5">5</Dropdown.Item>
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
      </DropdownButton>

       <div className='container mt-5'>
      <h1 className='mb-3' style={{marginTop: "-100px"}}>Items you have purchased : </h1>
      <Posts posts={currentPosts} loading={loading} />
      <br></br>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
      />

    </div>
    </>
  );
}

export default Purchases;