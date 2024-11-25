import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Button, Card, Col, Row } from "reactstrap";
import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Pagination,
  Rating,
  Typography,
} from "@mui/material";
// import {
//   CardActions,
//   CardContent,
//   CardMedia,
//   Pagination,
//   Rating,
//   Typography,
// } from "@mui/material";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "reactstrap";

const Products = () => {
  const [productData, setProductData] = useState([]);

  // For Pagination(Set number of Product in Each Page)
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [limit, setLimit] = useState(8);

  const loadData = async (page, limit) => {
    const result = await axios(
      `https://dummyjson.com/products?skip=${(page - 1) * limit}&limit=${limit}`
    );
    setProductData(result.data.products);
    setNumberOfPages(Math.floor(result?.data?.total / limit));
  };

  useEffect(() => {
    loadData(page, limit);
  }, [page, limit]);

  const handleChange = (e, page) => {
    console.log(page);
    setPage(page);
  };

  return (
    <div className="m-5">
      <div className="text-center my-5">
        <h2>VIEW YOUR FAVORITE PRODUCTS</h2>
      </div>
      <Row className="justify-content-center">
        {productData.map((result, index) => {
          return (
            <Col sm="6" lg="3">
              <Card sx={{ maxWidth: 345 }} className="mb-3">
                <CardMedia
                  sx={{ height: 310 }}
                  image={result.thumbnail}
                  title={result.title}
                  className="img-fluid object-fit-none"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="product-title"
                  >
                    Title : {result.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <h6>Category : {result.category}</h6>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <h6>Brand Name : {result.brand}</h6>
                  </Typography>
                  <Typography className="d-flex">
                    Rating :{" "}
                    <Rating name="read-only" value={result.rating} readOnly />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <h6>Price : {result.price}$</h6>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <h6>Discount : {result.discountPercentage}%</h6>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="product-description"
                  >
                    <h6>Description : {result.description}</h6>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link
                    to={`/dashboard/viewproduct/${result.id}`}
                    className="text-decoration-none text-white"
                  >
                    <Button
                      className="text-white mx-2"
                      variant="contained"
                      id="show-product"
                      style={{
                        backgroundColor: "#57c5b6",
                        borderColor: "#57c5b6",
                      }}
                      outline
                    >
                      Show Product
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div className="d-flex justify-content-center">
        <Pagination
          justifyContent="center"
          count={numberOfPages}
          showFirstButton={true}
          showLastButton={true}
          onChange={(e, page) => handleChange(e, page)}
        />
      </div>
    </div>
  );
};

export default Products;
