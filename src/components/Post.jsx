import { format } from 'date-fns'

import { formatDistanceToNow } from 'date-fns/esm'
import ptBR from 'date-fns/locale/pt-BR'
import { useState } from 'react'
import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'

export function Post({ author, publishedAt, content }) {
  const [comments, setComments] = useState(['post top'])
  const [newCommentText, setNewCommentText] = useState('')
  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    { locale: ptBR }
  )

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  })

  function handleCreateNewComment() {
    event.preventDefault()

    setComments([...comments, newCommentText])
    setNewCommentText('')
    saveOnLocalStorage(newCommentText)
  }

  function handleNewCommentChange() {
    setNewCommentText(event.target.value)
    event.target.setCustomValidity('')
  }

  function handleNewCommentInvalid() {
    event.target.setCustomValidity('esse campo não e valido')
  }

  function saveOnLocalStorage(comment) {
    const object = {
      nome: 'leo',
      idade: 22,
      comentario: comment
    }

    let comentariosjson = localStorage.getItem('comentarios') ?? '[]'
    let comentarios = JSON.parse(comentariosjson)
    console.log(comentarios)
    comentarios.push(object)
    let json = JSON.stringify(comentarios)
    localStorage.setItem('comentarios', json)
  }

  function deleteComment(commentToDelete) {
    const commentsWithoutDeleteOne = comments.filter(comment => {
      return comment != commentToDelete
    })
    setComments(commentsWithoutDeleteOne)
  }

  // useEffect(() => {
  //   console.log({ comments })
  // }, [comments])

  const isNewCommentEmpty = newCommentText == 0

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarImg} />
          <div className={styles.authorInfo}>
            <strong> {author.name} </strong>
            <span> {author.role} </span>
          </div>
        </div>

        <time
          tittle={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map(line => {
          if (line.type == 'paragraph') {
            return <p key={line.content}>{line.content}</p>
          } else if (line.type == 'link') {
            return (
              <p key={line.content}>
                <a href="#">{line.content}</a>
              </p>
            )
          }
        })}
      </div>
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong> Deixe seu feedback </strong>
        <textarea
          name="comment"
          placeholder="Deixe um comentario"
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>
      <div className={styles.commentList}>
        {comments?.map(comment => {
          return (
            <Comment
              key={comment}
              data={comment}
              onDeleteComment={deleteComment}
            />
          )
        })}
      </div>
    </article>
  )
}
