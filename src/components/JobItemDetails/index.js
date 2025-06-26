import {Component} from 'react'

import {FaMapMarkerAlt, FaStar} from 'react-icons/fa'

import {BsBriefcaseFill} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const jobDetailsData = data.job_details || {}
    const similarJobs = data.similar_jobs || []

    const updatedSimilarData = similarJobs.map(eachItem => ({
      id: eachItem.id,
      title: eachItem.title,
      rating: eachItem.rating,
      location: eachItem.location,
      employmentType: eachItem.employment_type,
      jobDescription: eachItem.job_description,
      companyLogoUrl: eachItem.company_logo_url,
    }))

    const updatedJobDetailsData = {
      companyLogoUrl: jobDetailsData.company_logo_url || '',
      companyWebsiteUrl: jobDetailsData.company_website_url || '',
      employmentType: jobDetailsData.employment_type || '',
      jobDescription: jobDetailsData.job_description || '',
      title: jobDetailsData.title || '',
      rating: jobDetailsData.rating || '',
      packagePerAnnum: jobDetailsData.package_per_annum || '',
      location: jobDetailsData.location || '',
      lifeAtCompany: {
        description:
          jobDetailsData.life_at_company?.description || 'Info not available',
        imageUrl: jobDetailsData.life_at_company?.image_url || '',
      },
      skills: jobDetailsData.skills
        ? jobDetailsData.skills.map(skill => ({
            name: skill.name,
            imageUrl: skill.image_url,
          }))
        : [],
    }
    if (response.ok === true) {
      this.setState({
        jobDetails: updatedJobDetailsData,
        similarData: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLifeAtCompany = () => {
    const {jobDetails} = this.state
    const {lifeAtCompany} = jobDetails
    if (!lifeAtCompany) return <p>No Information Available</p>
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="lifeAtCompanyCard">
        <p className="descriptionText">{description} </p>
        <img
          src={imageUrl}
          alt="life at company"
          className="lifeAtCompanyCardImage"
        />
      </div>
    )
  }

  renderSkill = skills => {
    if (!skills || skills.length === 0) return <p>No Skills Available</p>
    return (
      <div className="skillsContainer">
        <ul className="skillsList">
          {skills.map(skill => (
            <li key={skill.name} className="skillItem">
              <img
                src={skill.imageUrl}
                alt={skill.name}
                className="skillIcon"
              />
              <p>{skill.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsData = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    return (
      <>
        <div className="jobItemCard">
          <div className="companyAndPostionCard">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="jobItemIcon"
            />
            <div className="positionAndRatingCard">
              <h1>{title}</h1>
              <div className="ratingContainer">
                <FaStar className="ratingIcon" />
                <p className="ratingText">{rating}</p>
              </div>
            </div>
          </div>
          <div className="infoContainer">
            <div className="locationAndPositionContainer">
              <FaMapMarkerAlt className="mapMarkerAndBreifCaseIcon" />
              <p>{location}</p>
              <BsBriefcaseFill className="mapMarkerAndBreifCaseIcon" />
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="horizontalLine" />
          <div className="descriptionContainer">
            <div className="descriptionHeadingAndVisitLink">
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
            </div>
            <p className="descriptionText">{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          {this.renderSkill(skills)}
          <h1>Life at Company</h1>
          {this.renderLifeAtCompany()}
        </div>
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarData} = this.state

    return (
      <>
        {similarData.map((eachItem, index) => (
          <ul key={eachItem.id} className="similarJobsSection">
            <li className="similarList">
              <div className="companyAndPostionCard">
                <img
                  src={eachItem.companyLogoUrl}
                  alt="similar job company logo"
                  className="jobItemIcon"
                />
                <div className="positionAndRatingCard">
                  <h1>{eachItem.title}</h1>
                  <div className="ratingContainer">
                    <FaStar className="ratingIcon" />
                    <p className="ratingText">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <h1>Description</h1>
              <p className="descriptionText">{eachItem.jobDescription}</p>

              <div className="locationAndPositionContainer">
                <FaMapMarkerAlt className="mapMarkerAndBreifCaseIcon" />
                <p>{eachItem.location}</p>
                <BsBriefcaseFill className="mapMarkerAndBreifCaseIcon" />
                <p>{eachItem.employmentType}</p>
              </div>
            </li>
          </ul>
        ))}
      </>
    )
  }

  // renderFailureView

  onClickJobsFailure = () => {
    this.getJobItemData()
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failureViewImage"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retryButton"
        onClick={this.onClickJobsFailure}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobsSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <div>
            <div className="renderJobDetailsData">
              {this.renderJobDetailsData()}
            </div>
            <h1 className="similarJobsText">Similar Jobs</h1>
            <div className="similarJobsContainer">
              {this.renderSimilarJobs()}
            </div>
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobItemDetailsContainer">
        <Header />
        {this.renderJobsSwitchView()}
      </div>
    )
  }
}

export default JobItemDetails
