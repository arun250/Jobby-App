import Header from '../Header'
import {Link} from 'react-router-dom'

import './index.css'

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="desc-heading">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="linkToJobs">
            <button type="button" className="findJobs-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
