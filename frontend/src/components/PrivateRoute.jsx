import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute() {
  const { currentUser } = useAuth()

  // If there is a user, render the child components via <Outlet />
  // Otherwise, redirect them to the login page
  return currentUser ? <Outlet /> : <Navigate to="/login" />
}