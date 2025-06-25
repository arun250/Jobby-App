import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

import {FaSearch} from 'react-icons/fa'

import Header from '../Header'

import JobCard from '../JobCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    jobDetails: [],
    searchInput: '',
    activeEmploymentType: [],
    activeSalaryRange: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getjobDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedFetchedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedFetchedData,
        apistatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apistatus: apiStatusConstants.failure})
    }
  }

  getjobDetails = async () => {
    const {searchInput, activeEmploymentType, activeSalaryRange} = this.state

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const employmentTypeQuery =
      activeEmploymentType.length > 0 ? activeEmploymentType.join(',') : ''
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedJobData = await response.json()
      console.log(fetchedJobData)
      const updatedJobData = fetchedJobData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
        employmentType: eachItem.employment_type,
      }))
      this.setState({
        jobDetails: updatedJobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeEmploymentType = selectedType => {
    this.setState(
      prevState => {
        const {activeEmploymentType} = prevState
        const isAlreadySelected = activeEmploymentType.includes(selectedType)
        const updatedEmploymentType = isAlreadySelected
          ? activeEmploymentType.filter(type => type !== selectedType)
          : [...activeEmploymentType, selectedType]
        return {activeEmploymentType: updatedEmploymentType}
      },

      this.getjobDetails,
    )
  }
  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  onSearchButton = () => {
    this.getjobDetails()
  }

  changeSalaryRange = selectedRange => {
    this.setState({activeSalaryRange: selectedRange}, this.getjobDetails)
  }

  renderProfileContainer = () => {
    const {profileDetails} = this.state
    const {name, shortBio, profileImageUrl} = profileDetails
    return (
      <div className='profileContainer'>
        <img src={profileImageUrl} alt='profile' className='profileIcon' />
        <h1 className='profileName'>{name}</h1>
        <p className='profileShortBio'>{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => {
    return (
      <div>
        <button
          type='button'
          className='retryButton'
          onClick={() => this.getProfileDetails()}
        >
          Retry
        </button>
      </div>
    )
  }

  renderJobsFailureView = () => {
    return (
      <div>
        <img
          src='https://assets.ccbp.in/frontend/react-js/failure-img.png '
          alt='failure View'
          className='failureViewImage'
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button
          type='button'
          className='retryButton'
          onClick={() => this.getjobDetails()}
        >
          Retry
        </button>
      </div>
    )
  }

  renderNoJobsView = () => {
    return (
      <div>
        <img
          src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
          alt='no jobs'
          className='failureViewImage'
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
        <button
          type='button'
          className='retryButton'
          onClick={() => this.getjobDetails()}
        >
          Retry
        </button>
      </div>
    )
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <>
        <div className='searchBoxContainer'>
          <input
            type='search'
            placeholder='Search'
            className='searchJobsInput'
            value={searchInput}
            onChange={this.changeSearchInput}
          />
          <button
            type='button'
            className='searchButton'
            onClick={this.onSearchButton}
            data-testid='searchButton'
          >
            <FaSearch className='searchIcon' />
          </button>
        </div>
      </>
    )
  }

  renderTypesOfEmployment = () => {
    return (
      <ul>
        {employmentTypesList.map(eachItem => (
          <li key={eachItem.employmentTypeId} className='typesOfEmployment'>
            <input
              type='checkbox'
              value={eachItem.employmentTypeId}
              id={`checkbox-${eachItem.employmentTypeId}`}
              className='checkboxTypesOfEmployment'
              onChange={() =>
                this.changeEmploymentType(eachItem.employmentTypeId)
              }
            />
            <label htmlFor={`checkbox-${eachItem.employmentTypeId}`}>
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderSalaryRange = () => {
    const {activeSalaryRange} = this.state
    return (
      <ul>
        {salaryRangesList.map(eachItem => (
          <li className='salaryRange' key={eachItem.salaryRangeId}>
            <input
              type='radio'
              role='radio'
              value={eachItem.salaryRangeId}
              id={`radio-${eachItem.salaryRangeId}`}
              className='checkboxSalaryRange'
              checked={activeSalaryRange === eachItem.salaryRangeId}
              onChange={() => this.changeSalaryRange(eachItem.salaryRangeId)}
            />
            <label htmlFor={`radio-${eachItem.salaryRangeId}`}>
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  renderJobs = () => {
    const {jobDetails} = this.state
    if (jobDetails.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <>
        <ul className='unorderedJobCard'>
          {jobDetails.map(eachItem => (
            <JobCard jobDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className='products-loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  renderProfileSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileContainer()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobs()
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
      <>
        <Header />
        <div className='displayContainer'>
          <div className='jobsContainerDesktopView'>
            <div className='leftSection'>
              {this.renderProfileSwitchView()}
              <hr className='horizontalLine' />
              <h1 className='typesOfEmploymentHeading'>Type of Employment</h1>
              {this.renderTypesOfEmployment()}
              <hr className='horizontalLine' />
              <h1 className='salaryRangeHeading'>Salary Range</h1>
              {this.renderSalaryRange()}
            </div>
            <div className='searchAndJobsContainer'>
              {this.renderSearchInput()}
              {this.renderJobsSwitchView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
