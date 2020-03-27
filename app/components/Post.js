import React from 'react'
import queryString from 'query-string'
import { fetchItem, fetchPosts, fetchComments } from '../utils/api'
import Loading from './Loading'
import PostMetaInfo from './PostMetaInfo'
import Title from './Title'
import Comment from './Comment'

function fetchPostReducer(state, action) {
  if (action.type === 'fetch') {
    return {
      ...state,
      loadingPost: true,
      loadingComments: true
    }
  } else if (action.type === 'post') {
    return {
      ...state,
      post: action.post,
      loadingPost: false
    }
  } else if (action.type === 'comments') {
    return {
      ...state,
      comments: action.comments,
      loadingComments: false
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      loadingPost: false,
      loadingComments: false
    }
  } else {
    throw new Error(`That action type is not supported`)
  }
}

export default function Post({ loaction }) {
  const { id } = queryString.parse(location.search)
  const [state, dispatch] = React.useReducer(fetchPostReducer, {
    post: null,
    loadingPost: true,
    comments: null,
    loadingComments: true,
    error: null
  })
  const { post, loadingPost, comments, loadingComments, error } = state
  React.useEffect(() => {
    dispatch({ type: 'fetch' })

    fetchItem(id)
      .then(post => {
        dispatch({ type: 'post', post })
        return fetchComments(post.kids || [])
      })
      .then(comments => dispatch({ type: 'comments', comments }))
      .catch(({ message }) => dispatch({ type: 'error', message }))
  }, [id])

  if (error) {
    return <p className='center-text error'>{error}</p>
  }

  return (
    <React.Fragment>
      {loadingPost === true ? (
        <Loading text='Fetching post' />
      ) : (
        <React.Fragment>
          <h1 className='header'>
            <Title url={post.url} title={post.title} id={post.id} />
          </h1>
          <PostMetaInfo
            by={post.by}
            time={post.time}
            id={post.id}
            descendants={post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: post.text }} />
        </React.Fragment>
      )}
      {loadingComments === true ? (
        loadingPost === false && <Loading text='Fetching comments' />
      ) : (
        <React.Fragment>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
