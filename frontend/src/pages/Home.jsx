import React from 'react'
import ProductList from '../components/ProductList'
import Hero from '../section/Hero'
import Bestsellers from '../components/Bestseller'
import CategoriesSection from '../components/Categoriessection'

const Home = () => {
  return (
    <div className='mt-9 pt-10'>
<Hero/>
<CategoriesSection/>
<Bestsellers/>
        <ProductList/>
    </div>
  )
}

export default Home