import React from 'react'
import PropTypes from 'prop-types'
import { fetchMainPosts } from '../utils/api'
import Loading from './Loading'
import PostsList from './PostsList'

function fetchReducer(state, action) {
  if (action.type === 'reset') {
    return {
      posts: null,
      error: null,
      loading: true
    }
  } else if (action.type === 'success') {
    return {
      posts: action.posts,
      error: null,
      loading: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.message,
      loading: false
    }
  } else {
    throw new Error(`That action type is not supported.`)
  }
}
export default function Posts(props) {
  const [state, dispatch] = React.useReducer(fetchReducer, {
    posts: null,
    error: null,
    loading: true
  })

  React.useEffect(() => {
    dispatch({ type: 'reset' })
    fetchMainPosts(props.type)
      .then(posts => dispatch({ type: 'success', posts }))
      .catch(({ message }) => dispatch({ type: 'error', message }))
  }, [props.type])

  const { posts, error, loading } = state

  if (loading === true) {
    return <Loading />
  }

  if (error) {
    return <p className='center-text error'>{error}</p>
  }

  return <PostsList posts={posts} />
}

Posts.propTypes = {
  type: PropTypes.oneOf(['top', 'new'])
}
