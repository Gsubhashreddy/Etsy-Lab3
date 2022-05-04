import React, { Fragment, useEffect, useState } from 'react'
import { Card, Row, Col, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import clothing from './../../images/clothes.png'
import jewelry from './../../images/jewellry.jpg'
import homedecor from './../../images/homedeco.jpg'
import art from './../../images/arts.jpg'
import item from './../../images/item.jpg'
import entertainment from './../../images/entertainment.jpg'
import axios from 'axios'
import { toast } from 'react-toastify'
import constants from './../../utils/constants.json'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [products, setProducts] = useState([])

    const [favorites, setFavorites] = useState([])

    const [user, setUser] = useState()

    const [userName,setUserName] = useState('')

    const [currency, setCurrency] = useState()

    useEffect(async () => {

        //Set user id from access token stored in localstorage
        const token = window.localStorage.getItem("userdetails")
        const res = await axios.post(constants.uri + "/users/auth", { token })
        setUserName(`${res.data.firstName?res.data.firstName:''} ${res.data.lastName?res.data.lastName:''}`)
        setUser(res.data._id)

        //Get all products
        const { data } = await axios.get(constants.uri + '/dashboard/products')
        console.log('line 35',data)
        const grid = []
        for (var i = 0; i < data.length; i = i + 3) {
            var ar = []
            if (data[i]) {
                ar.push(data[i])
            }
            if (data[i + 1]) {
                ar.push(data[i + 1])
            }
            if (data[i + 2]) {
                ar.push(data[i + 2])
            }
            grid.push(ar)
        }
        setProducts(grid)

        const curr = window.localStorage.getItem('country_currency')
        setCurrency(curr.split(',')[1])

        const fav = await axios.post(constants.uri + '/users/myFavorites', { id: res.data._id })
        console.log(fav.data)

        var favItems = []
        fav.data.map(item => {
            favItems.push(item.productId)
        })
        setFavorites(favItems)
    }, [])
    const addToFavorites = async (product) => {
        if (favorites.indexOf(product._id) > -1) {
            //Remove from favorites
            var fav = [...favorites]
            const index = fav.indexOf(product._id)
            if (index != -1) {
                try {
                    const res = await axios.post(constants.uri + "/users/remove-from-favorites", { id: user, productId: product._id })
                    if (res.data) {
                        fav.splice(index, 1)
                        setFavorites(fav)
                        //toast("Removed from your favorites collection!", { position: 'top-center' })
                        alert('Removed from your favorites collection!')
                    }
                } catch (error) {
                    //toast("Failed to remove from Favorites", { position: 'top-center' })
                    alert('Failed to remove from Favorites')
                }
            }
        } else {
            //Add to favorites
            try {
                console.log(user)
                const res = await axios.post(constants.uri +"/users/add-to-favorites", { id: user, productId: product._id })
                setFavorites([...favorites, product._id])
                //toast("Added to your favorites collection!", { position: 'top-center' })
                alert('Added to your favorites collection!')
            } catch (error) {
                console.log(error)
                //toast("Failed to add to favorites")
                alert('Failed to add to favorites')
            }
        }
    }

    return (
        <Fragment >
            <Card >
                <Card.Body style={{ backgroundColor: "rgb(213 218 221)", height: "100%" }}>
                    <Row>
                        {user && (
                            <h2 style={{ textAlign: 'center' }}>Welcome back {userName}!</h2>
                        )}

                        <h3 style={{ textAlign: 'center' }}>Shop Now.</h3>
                    </Row>
                    <br />
                    <Row>
                        <Col sm={1}></Col>
                        <Col sm={2}>
                            <Link to="/productsbycategory/Clothing" style={{ textDecoration: 'none', color: 'black' }}>
                                <Row style={{justifyContent:'center'}}>
                                    <Image rounded width={175} height={165} src={clothing}/>
                                </Row>
                                <Row><h6 style={{ textAlign: 'center' }}>Clothing</h6></Row>
                            </Link>
                        </Col>
                        <Col sm={2}>
                            <Link to="/productsbycategory/Jewelry" style={{ textDecoration: 'none', color: 'black' }}>
                                <Row style={{justifyContent:'center'}}>
                                    <Image rounded width={175} height={165} src={jewelry} />
                                </Row>
                                <Row><h6 style={{ textAlign: 'center' }}>Jewelry</h6></Row>
                            </Link>

                        </Col>
                        <Col sm={2}>
                            <Link to="/productsbycategory/Entertainment" style={{ textDecoration: 'none', color: 'black' }}>
                                <Row style={{justifyContent:'center'}}>
                                    <Image rounded width={175} height={165} src={entertainment} />
                                </Row>
                                <Row><h6 style={{ textAlign: 'center' }}>Entertainment</h6></Row>
                            </Link>
                        </Col>
                        <Col sm={2}>
                            <Link to="/productsbycategory/Home Decor" style={{ textDecoration: 'none', color: 'black' }}>
                                <Row style={{justifyContent:'center'}}>
                                    <Image rounded width={175} height={165} src={homedecor} />
                                </Row>
                                <Row><h6 style={{ textAlign: 'center' }}>Home Decor</h6></Row>
                            </Link>
                        </Col>
                        <Col sm={2}>
                            <Link to="/productsbycategory/Art" style={{ textDecoration: 'none', color: 'black' }}>
                                <Row style={{justifyContent:'center'}}>
                                    <Image rounded width={175} height={165} src={art} />
                                </Row>
                                <Row><h6 style={{ textAlign: 'center' }}>Art</h6></Row>
                            </Link>
                        </Col>
                        <Col sm={1}></Col>
                    </Row>
                </Card.Body>
            </Card>
            <br />
            <Card>
                <Card.Title style={{ marginRight: "10%", marginLeft: "10%", textAlign: 'center' }}>Discover our unique products! Shop NOW.</Card.Title>
                <Card.Body style={{ marginRight: "10%", marginLeft: "10%" }}>
                    {products && products.length > 0 && products.map(productRow => (
                        <Row>
                            {productRow.map(product => (
                                <Col sm={4}>
                                    <Card className='product-card'>
                                        <Link to={`/item/${product._id}/overview`} style={{ textDecoration: 'none', color: 'black' }}>
                                            <Card.Img variant="top" style={{ width: "100%", height: "230px" }} src={item} />
                                        </Link>
                                        <Card.Body>
                                            <Card.Title>
                                                <Row>
                                                    
                                                    <Col cm={5}><Link to={`/item/${product._id}/overview`} style={{ textDecoration: 'none', color: 'black' }}>{product.productName}</Link></Col>
                                                    <Col sm={5}><span style={{ textAlign: 'right' }}>{product.price}{' '}<span style={{ fontWeight: 'lighter' }}>{currency}</span></span></Col>
                                                    <Col sm={2}>
                                                        {favorites.includes(product._id) ? (
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                overlay={<Tooltip id="button-tooltip-2">Remove From favorites</Tooltip>}
                                                            >
                                                                <Button
                                                                    variant="light"
                                                                    className="d-inline-flex align-items-center"
                                                                    onClick={() => addToFavorites(product)}
                                                                >
                                                                    <i style={{ color: 'red' }} className="fa fa-heart" aria-hidden="true"></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        ) :
                                                            (
                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">Add to favorites</Tooltip>}
                                                                >
                                                                    <Button
                                                                        variant="light"
                                                                        className="d-inline-flex align-items-center"
                                                                        onClick={() => addToFavorites(product)}
                                                                    >
                                                                        <i style={{ color: 'lightgrey' }} className="fa fa-heart" aria-hidden="true"></i>
                                                                    </Button>
                                                                </OverlayTrigger>
                                                            )
                                                        }

                                                    </Col>
                                                </Row>
                                                <Row>

                                                </Row>
                                            </Card.Title>
                                            <Link to={`/item/${product.productId}/overview`} style={{ textDecoration: 'none', color: 'black' }}>
                                                <Card.Text>
                                                    <Row>
                                                        {product && product.description.length < 30 ? (<span style={{ fontSize: 14 }}>{product.description}</span>) : (<span style={{ fontSize: 14 }}>{product.description.slice(0, 30)}...</span>)}
                                                    </Row>
                                                    <Row>
                                                        <Col>{product && product.quantity > 0 ? (<span>In Stock ({product.quantity} available)</span>) : (<span style={{ color: 'red' }}>Out of Stock</span>)}</Col>
                                                    </Row>
                                                </Card.Text>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ))}
                </Card.Body>
            </Card>
        </Fragment>
    )
}

export default Dashboard