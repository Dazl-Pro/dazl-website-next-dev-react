import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RouteGuard = (props) => {
    const [login, setLogin]=useState(false)
    const navigate= useNavigate()
    const {Components}=props
const token = localStorage.getItem("token")
    useEffect(()=>{
    if(token){
        setLogin(true)
    } else{
        setLogin(false)
        navigate("/")
    }
    })
  return (
    <div>
      {login && <Components/>}
    </div>
  )
}

export default RouteGuard
