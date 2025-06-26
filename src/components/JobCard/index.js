import {FaMapMarkerAlt, FaStar} from 'react-icons/fa'

import {BsBriefcaseFill} from 'react-icons/bs'

import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    jobDescription,
    location,
    title,
    rating,
    packagePerAnnum,
    employmentType,
    id,
  } = jobDetails
  return (
    <li className="listJobCard">
      <Link to={`/jobs/${id}`} className="linkedContainer">
        <div className="jobItemsCard">
          <div className="logoAndJobInfo">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="jobItemIcon"
            />
            <div className="titleAndRatingCont">
              <h1>{title}</h1>
              <div className="ratCont">
                <FaStar className="ratIcon" />
                <p className="ratText">{rating}</p>
              </div>
            </div>
          </div>

          <div className="locationAndPositionCont">
            <div className="locationAndPositionCard">
              <div className="locationCont">
                <FaMapMarkerAlt className="MarkerAndBreifCaseIcon" />
                <p>{location}</p>
              </div>
              <div className="employmentTypeCont">
                <BsBriefcaseFill className="MarkerAndBreifCaseIcon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobCard
