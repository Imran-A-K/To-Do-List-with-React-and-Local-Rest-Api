import React from 'react'

const Footer = ({ length}) => {
    // const today= new Date();
  return (
    <footer>
        {/* <p>Copyright &copy; {today.getFullYear()}</p> */}
        <p>{length} {length === 1 ? "task" : "tasks"}</p>
        </footer>
  )
}

export default Footer